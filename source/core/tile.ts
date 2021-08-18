namespace SFRTile {

    type UpgradeMap = {[id: number]: number};
    type ExtraMap = {[id: number]: ItemExtraData};
    interface DefaultValues {
        energy: number,
        canSeeSky: boolean,
        sunIntensity: number,
        generation: number,
        finalGeneration: number,
        transfer: number
        capacity: number,
        upgradeMap: UpgradeMap,
        extraMap: ExtraMap,
        isTraversalEnabled: boolean,
        traversal: BlockPosFace[],
        traversalObj: Traversal
    }

    export const TEMPORARY_TILES: {[key: string]: number} = {};

    export class PanelTile implements EnergyTile {

        // --- --- Unused implementation from standart TE prototype --- --- //
        public readonly liquidStorage: LiquidRegistry.Storage;
        public readonly isLoaded: boolean;
        public readonly remove: boolean;
        public selfDestroy() {}
        public sendPacket(name: string, data: object) {}
        public readonly networkData: SyncedNetworkData;
        public readonly networkEntity: NetworkEntity;
        public sendResponse(name: string, data: object) {}
        // --- --- --- --- --- ---- --- --- --- --- --- --- --- --- --- --- //

        // --- --- Unused implementation from EnergyTile --- --- //
        public readonly energyNode: EnergyTileNode; 
        public isConductor(){ return false }
        public canReceiveEnergy(){ return false } 
        public canExtractEnergy(){ return true }
        public energyReceive() { return 0 }
        // --- --- --- --- --- ---- ---- --- --- --- --- --- --- //

        public readonly blockID: number;
        public readonly x: number;
        public readonly y: number;
        public readonly z: number;
        public readonly dimension: number;
        public container: ItemContainer;
        public blockSource: BlockSource;

        public readonly useNetworkItemContainer: boolean = true;
        private readonly initialGeneration: number;
        public readonly initialTransfer: number;
        private readonly initialCapacity: number;

        /**
         * Flag to check if some TileEntity instance
         * is a solar panel from SFR
         */
        private readonly __sfr__: boolean = true;

        public defaultValues: DefaultValues = {
            energy: 0,
            canSeeSky: false,
            sunIntensity: 0,
            generation: 0,
            finalGeneration: 0,
            transfer: 0,
            capacity: 0,
            upgradeMap: {} as UpgradeMap,
            extraMap: {} as ExtraMap,
            isTraversalEnabled: false,
            traversal: [] as BlockPosFace[],
            traversalObj: new Traversal()
        }
        public data: DefaultValues = this.defaultValues;

        public getScreenByName(){ return null }

        public init(): void {
            this.data.canSeeSky = this.blockSource.canSeeSky(this.x, this.y + 1, this.z);
            this.calculateEfficiency();
            this.updateGenerationWithSunIntensity();
        }
        
        public getUpgrades(type: number): number {
            let c: number = 0;
            for(let i=0; i<5; i++) {
                let stack: ItemContainerSlot = this.container.getSlot(`slotUpgrade${i}`);
                if(!stack.isEmpty() && stack.id == type) c += stack.count;
            }
            return c;
        }

        private tryPutUpgrades(id: number, count: number, data: number, extra: ItemExtraData, player: number, inventorySlot: number, isSingle: boolean, sound: boolean): void {
            let amt: number = this.getUpgrades(id);
            let iu: SolarUpgrades.UpgradeParams = SolarUpgrades.getUpgrade(id);
            if(iu != null && amt < iu.getMaxUpgrades() && iu.canInstall(this, {id: id, count: count, data: data, extra: extra}, this.container)) {
                let installed: boolean = false;
                let actor = new PlayerActor(player);
                for(let i=0; i<5; i++) {
                    let stack: ItemContainerSlot = this.container.getSlot(`slotUpgrade${i}`);
                    if(stack.id == id && stack.extra == extra) {
                        let allow: number = isSingle ? 1 : Math.min(iu.getMaxUpgrades() - this.getUpgrades(id), Math.min(Item.getMaxStack(id) - count, count));
                        actor.setInventorySlot(inventorySlot, id, count - allow, data, extra);
                        this.container.setSlot(`slotUpgrade${i}`, id, count + allow, data, extra);
                        installed = true; break;
                    } else if(stack.isEmpty()) {
                        let allow: number = isSingle ? 1 : Math.min(iu.getMaxUpgrades() - this.getUpgrades(id), count);
                        actor.setInventorySlot(inventorySlot, id, count - allow, data, extra);
                        this.container.setSlot(`slotUpgrade${i}`, id, allow, data, extra);
                        installed = true; break;
                    }
                    this.container.sendChanges();
                }
                if(installed && sound) Sounds.anvil(this.x, this.y, this.z, this.dimension);
            }
        }

        private computeSunIntensity(): number {
            if(!this.data.canSeeSky) return 0;
            let celestialAngleRadians = SunUtils.getCelestialAngleRadians(1);
            if(celestialAngleRadians > Math.PI)
                celestialAngleRadians = 2 * Math.PI - celestialAngleRadians;
            const lowLightCount = 0;
            const multiplicator = 1.5 - (lowLightCount * .122);
            const displacement = 1.2 - (lowLightCount * .08);
            return clamp(multiplicator * Math.cos(celestialAngleRadians / displacement), 0, 1);
        }

        private calculateEfficiency(): void {
            let eff = this.computeSunIntensity();
            const weather = World.getWeather();
            let raining = weather.rain / 10;
            raining = raining > .2 ? (raining - .2) / .8 : 0;
            raining = Math.sin(raining * Math.PI / 2);
            raining = 1 - raining * (1 - RAIN_MULTIPLIER);
            let thundering = weather.thunder / 10;
            thundering = thundering > .75 ? (thundering - .75) / .25 : 0;
            thundering = Math.sin(thundering * Math.PI / 2);
            thundering = 1 - thundering * (1 - THUNDER_MULTIPLIER);
            eff *= raining * thundering;
            this.data.sunIntensity = eff;
            this.container.setScale("sunBarScale", this.data.sunIntensity);
            this.container.sendChanges();
        }

        private updateGenerationWithSunIntensity(): void {
            this.data.finalGeneration = Math.round(this.data.generation * this.data.sunIntensity);
            this.container.setText("textEfficiency", JavaString.format(Translation.translate("info.solarflux.energy.efficiency"), [JavaInt.valueOf(Math.round(this.data.sunIntensity * 100))]));
            this.container.sendChanges();
        }

        private resetUpgrades(): void {
            this.data.generation = this.data.finalGeneration = this.initialGeneration;
            this.data.transfer = this.initialTransfer;
            this.data.capacity = this.initialCapacity;
            this.data.upgradeMap = {};
            this.data.extraMap = {};
            this.data.isTraversalEnabled = false;
        }

        private fillUpgradeMap(): void {
            for(let i=0; i<5; i++) {
                let slot = this.container.getSlot(`slotUpgrade${i}`);
                let upgrade = SolarUpgrades.getUpgrade(slot.id);
                if(upgrade != null) {
                    let map = this.data.upgradeMap;
                    if(!map[slot.id]) map[slot.id] = 0;
                    map[slot.id] = Math.min(map[slot.id] + slot.count, upgrade.getMaxUpgrades());
                    if(slot.extra != null) this.data.extraMap[slot.id] = slot.extra;
                }
            }
        }

        private applyUpgrades(): void {
            this.resetUpgrades();
            this.fillUpgradeMap();
            for(let key in this.data.upgradeMap) {
                let upgradeId = parseInt(key), upgrade = SolarUpgrades.getUpgrade(upgradeId);
                upgrade != null && upgrade.update && upgrade.update(this, this.data.upgradeMap[key], this.data.extraMap[upgradeId] ?? null);
            }
            this.updateGenerationWithSunIntensity();
        }

        private chargeItem(): void {
            let slot = this.container.getSlot("slotCharge"),
                data = ChargeItemRegistry.getItemData(slot.id);
            if(typeof data !== "undefined") {
                let type = data.energy,
                    ratio = EnergyTypeRegistry.getValueRatio("FE", type),
                    amount = Math.round(Math.min(this.data.energy, this.data.transfer) * ratio);
                this.data.energy -= Math.round(ChargeItemRegistry.addEnergyToSlot(slot, type, amount, data.tier) / ratio);
            }
        }

        public tick(): void {
            StorageInterface.checkHoppers(this);
            if(World.getThreadTime() % 20 == 0) this.data.canSeeSky = this.blockSource.canSeeSky(this.x, this.y + 1, this.z);
            if(World.getThreadTime() % 20 == 0) this.data.traversal = [];
            if(World.getThreadTime() % SUN_INTENSITY_UPDATE_INTERVAL == 0) this.calculateEfficiency();
            this.applyUpgrades();
            this.data.energy += Math.min(this.data.capacity - this.data.energy, this.data.finalGeneration);
            this.chargeItem();
            for(let f in HORIZONTAL_FACES){
                let hor = HORIZONTAL_FACES[f],
                    pos = BlockPosUtils.offset(BlockPosUtils.fromTile(this), hor),
                    tile = TileEntity.getTileEntity(pos.x, pos.y, pos.z, this.blockSource);
                if(tile == null) continue;
                if(tile.__sfr__) this.autoBalanceEnergy(tile as PanelTile);
            }
            if(this.data.traversal.length > 0)
                for(let i=0; i<this.data.traversal.length; ++i){
                    let traverse: BlockPosFace = this.data.traversal[i],
                        tile = TileEntity.getTileEntity(traverse.x, traverse.y, traverse.z, this.blockSource);
                    if(tile == null) continue;
                    if(tile.isEnergyTile && !tile.__sfr__) {
                        let etile = tile as EnergyTile;
                        if(etile.blockSource && etile.canReceiveEnergy(traverse.side, "RF")) {
                            const amount = Math.min(this.data.energy, this.data.transfer);
                            this.data.energy -= etile.energyReceive("RF", amount, amount);
                        }
                    }
                }
            this.container.setText("textCharge", JavaString.format(Translation.translate("info.solarflux.energy.stored1"), [Long.valueOf(this.data.energy)]));
            this.container.setText("textCapacity", JavaString.format(Translation.translate("info.solarflux.energy.capacity"), [Long.valueOf(this.data.capacity)]));
            this.container.setText("textGeneration", JavaString.format(Translation.translate("info.solarflux.energy.generation"), [Long.valueOf(this.data.finalGeneration)]));
            this.container.setScale("energyBarScale", this.data.energy / this.data.capacity);
            this.container.sendChanges();
        }

        private autoBalanceEnergy(solar: PanelTile): number {
            let delta: number = this.data.energy - solar.data.energy;
            if(delta < 0) return solar.autoBalanceEnergy(this);
            else if(delta > 0) return this.extractEnergy(solar.receiveEnergyInternal(this.extractEnergy(solar.receiveEnergyInternal(delta / 2, true), true), false), false);
            return 0;
        }

        private extractEnergy(maxExtract: number, simulate: boolean): number {
            let energyExtracted: number = Math.min(this.data.energy, Math.min(this.data.transfer, maxExtract));
            if(!simulate) this.data.energy -= energyExtracted;
            return energyExtracted;
        }

        private receiveEnergyInternal(maxReceive: number, simulate: boolean): number {
            let energyReceived: number = Math.min(Math.min(this.data.capacity - this.data.energy, JavaInt.MAX_VALUE), Math.min(this.data.transfer, maxReceive));
            if(!simulate) this.data.energy += energyReceived;
            return energyReceived;
        }

        public click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData): void {
            if(Entity.getSneaking(player)){
                let carried = Entity.getCarriedItem(player);
                carried.count > 0 && SolarUpgrades.isUpgrade(carried.id) && this.tryPutUpgrades(id, count, data, extra, player, new PlayerActor(player).getSelectedSlot(), false, true);
            } else {
                Game.prevent();
                this.container.openFor(Network.getClientForPlayer(player), "main");
            }
        }

        public destroy(): boolean {
            TEMPORARY_TILES[`${this.x}:${this.y}:${this.z}:${this.dimension}`] = this.data.energy - Math.round(this.data.energy * PICKUP_ENERGY_LOSS / 100);
            return false;
        }

        public energyTick(type: string, node: EnergyTileNode): void {
            if(!this.data.isTraversalEnabled && this.data.traversal.length == 0){
                const output = Math.min(this.data.energy, this.data.transfer);
                this.data.energy += node.add(output) - output;
            }
        }

        constructor(name: string, height: number, generation: number, capacity: number, transfer: number) {
            this.initialGeneration = this.defaultValues.generation = this.defaultValues.finalGeneration = generation;
            this.initialTransfer = this.defaultValues.transfer = transfer;
            this.initialCapacity = this.defaultValues.capacity = capacity;
            const screen = createSolarGuiFor(Translation.translate(`tile.solarflux:solar_panel_${name.replace("sfr_", "")}.name`));
            this.getScreenByName = () => screen;
        }

        [key: string]: any;

    }

    export function createPanelTileFor(id: string, height: number, generation: number, capacity: number, transfer: number): void {
        TileEntity.registerPrototype(BlockID[id], new PanelTile(id, height, generation, capacity, transfer));
        EnergyTileRegistry.addEnergyTypeForId(BlockID[id], RF);
        let slots: {[key: string]: SlotData} = {};
        for(let i=0; i<5; i++) slots[`slotUpgrade${i}`] = {input: true, output: true, isValid: (item, side, tileEntity: PanelTile) => SolarUpgrades.isUpgrade(item.id) && SolarUpgrades.getUpgrade(item.id).canInstall ? SolarUpgrades.getUpgrade(item.id).canInstall(tileEntity, item, tileEntity.container) : true};
        slots["slotCharge"] = {input: true, output: true, isValid: (item: ItemInstance) => ChargeItemRegistry.isValidItem(item.id, "RF", 1)};
        StorageInterface.createInterface(BlockID[id], { slots: slots });
        VanillaSlots.registerForTile(BlockID[id]);
    }

}