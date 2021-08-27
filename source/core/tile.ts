namespace SFRTile {

    type UpgradeMap = {[id: number]: number};
    type ExtraMap = {[id: number]: ItemExtraData};

    export const TEMPORARY_TILES: {[key: string]: number} = {};

    interface PanelTileDefaultValues {
        energy: number,
        canSeeSky: boolean,
        sunIntensity: number,
        generation: number,
        finalGeneration: number,
        transfer: number,
        capacity: number,
        upgradeMap: UpgradeMap,
        extraMap: ExtraMap,
        isTraversalEnabled: boolean,
        traversal: BlockPosFace[],
        traversalObj: Traversal
    }

    export class PanelTile extends TileEntityImplementation<PanelTileDefaultValues> implements EnergyTile {

        // --- --- Unused implementation from EnergyTile --- --- //
        public readonly energyNode: EnergyTileNode; 
        public isConductor(){ return false }
        public canReceiveEnergy(){ return false } 
        public canExtractEnergy(){ return true }
        public energyReceive() { return 0 }
        // --- --- --- --- --- ---- ---- --- --- --- --- --- --- //

        private readonly initialGeneration: number;
        public readonly initialTransfer: number;
        private readonly initialCapacity: number;

        /**
         * Flag to check if some TileEntity instance
         * is a solar panel from SFR
         */
        private readonly __sfr__: boolean = true;

        public init(): void {
            this.data.traversalObj = new Traversal();
            this.data.canSeeSky = this.blockSource.canSeeSky(this.x, this.y + 1, this.z);
            this.calculateEfficiency();
            this.updateGenerationWithSunIntensity();
            this.container.setGlobalAddTransferPolicy((cont, name, id, count, data, extra, player) => {
                if(name.startsWith("slotUpgrade")) {
                    const isUpgrade = SolarUpgrades.isUpgrade(id);
                    if(!isUpgrade) return 0;
                    const upgrade = SolarUpgrades.getUpgrade(id);
                    const canInstall = upgrade.canInstall(this, { id, count, data, extra }, this.container);
                    if(!canInstall) return 0;
                    const already = this.data.upgradeMap[id];
                    if(!already) return count;
                    const willbe = already + count;
                    if(willbe <= upgrade.getMaxUpgrades()) return count;
                    return willbe - upgrade.getMaxUpgrades();
                } else if(name == "slotCharge") {
                    return ChargeItemRegistry.isValidItem(id, "RF", 1) ? count : 0;
                }
                return count;
            });
        }
        
        public getUpgrades(type: number): number {
            let c: number = 0;
            for(let i=0; i<5; i++) {
                const stack: ItemContainerSlot = this.container.getSlot(`slotUpgrade${i}`);
                if(!stack.isEmpty() && stack.id == type) c += stack.count;
            }
            return c;
        }

        private tryPutUpgrades(id: number, count: number, data: number, extra: ItemExtraData, player: number, inventorySlot: number, isSingle: boolean, sound: boolean): void {
            const amt: number = this.getUpgrades(id);
            const iu: SolarUpgrades.UpgradeParams = SolarUpgrades.getUpgrade(id);
            if(iu != null && amt < iu.getMaxUpgrades() && iu.canInstall(this, {id: id, count: count, data: data, extra: extra}, this.container)) {
                let installed: boolean = false;
                const actor = new PlayerActor(player);
                for(let i=0; i<5; i++) {
                    let stack: ItemContainerSlot = this.container.getSlot(`slotUpgrade${i}`);
                    if(stack.id == id && stack.extra == extra) {
                        const allow: number = isSingle ? 1 : Math.min(iu.getMaxUpgrades() - this.getUpgrades(id), Math.min(Item.getMaxStack(id) - count, count));
                        actor.setInventorySlot(inventorySlot, id, count - allow, data, extra);
                        this.container.setSlot(`slotUpgrade${i}`, id, count + allow, data, extra);
                        installed = true; break;
                    } else if(stack.isEmpty()) {
                        const allow: number = isSingle ? 1 : Math.min(iu.getMaxUpgrades() - this.getUpgrades(id), count);
                        actor.setInventorySlot(inventorySlot, id, count - allow, data, extra);
                        this.container.setSlot(`slotUpgrade${i}`, id, allow, data, extra);
                        installed = true; break;
                    }
                    this.container.sendChanges();
                }
                installed && sound && Sounds.anvil(this.x, this.y, this.z, this.dimension);
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
                const slot = this.container.getSlot(`slotUpgrade${i}`);
                const upgrade = SolarUpgrades.getUpgrade(slot.id);
                if(upgrade != null) {
                    const map = this.data.upgradeMap;
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
                const upgradeId = parseInt(key), upgrade = SolarUpgrades.getUpgrade(upgradeId);
                upgrade != null && upgrade.update(this, this.data.upgradeMap[key], this.data.extraMap[upgradeId] ?? null);
            }
            this.updateGenerationWithSunIntensity();
        }

        private chargeItem(): void {
            const slot = this.container.getSlot("slotCharge");
            if(slot.id != 0) {
                const data = ChargeItemRegistry.getItemData(slot.id);
                if(typeof data !== "undefined") {
                    const type = data.energy;
                    const ratio = EnergyTypeRegistry.getValueRatio("FE", type);
                    const amount = Math.round(Math.min(this.data.energy, this.data.transfer) * ratio);
                    this.data.energy -= Math.round(ChargeItemRegistry.addEnergyToSlot(slot, type, amount, data.tier) / ratio);
                }
            }
        }

        public tick(): void {
            StorageInterface.checkHoppers(this);
            if(World.getThreadTime() % 20 == 0) {
                const canSeeSky = this.blockSource.canSeeSky(this.x, this.y + 1, this.z);
                if(canSeeSky == !this.data.canSeeSky) {
                    this.data.canSeeSky = canSeeSky;
                    this.calculateEfficiency();
                }
                this.data.traversal = [];
            }
            World.getThreadTime() % SUN_INTENSITY_UPDATE_INTERVAL == 0 && this.calculateEfficiency();
            this.applyUpgrades();
            if(this.data.capacity > this.data.energy)
                this.data.energy += Math.min(this.data.capacity - this.data.energy, this.data.finalGeneration);
            this.chargeItem();
            if(ENERGY_AUTO_BALANCING_INTERVAL != -1 && (ENERGY_AUTO_BALANCING_INTERVAL == 1 || World.getThreadTime() % ENERGY_AUTO_BALANCING_INTERVAL == 0)) {
                for(let hor = 2; hor < 6; hor++){
                    const pos = BlockPosUtils.offset(BlockPosUtils.fromTile(this), hor);
                    const tile = TileEntity.getTileEntity(pos.x, pos.y, pos.z, this.blockSource);
                    if(tile == null) continue;
                    if(tile.__sfr__) this.autoBalanceEnergy(tile as PanelTile);
                }
            }
            if(this.data.traversal.length > 0)
                for(let i=0; i<this.data.traversal.length; ++i){
                    const traverse: BlockPosFace = this.data.traversal[i];
                    const tile = TileEntity.getTileEntity(traverse.x, traverse.y, traverse.z, this.blockSource);
                    if(tile == null) continue;
                    if(tile.isEnergyTile && !tile.__sfr__) {
                        if(tile.blockSource && (tile as EnergyTile).canReceiveEnergy(traverse.side, "RF")) {
                            const amount = Math.min(this.data.energy, this.data.transfer);
                            this.data.energy -= (tile as EnergyTile).energyReceive("RF", amount, amount);
                        }
                    }
                }
            if(CONTAINER_UPDATE_INTERVAL <= 1 || World.getThreadTime() % CONTAINER_UPDATE_INTERVAL == 0) {
                this.container.setText("textCharge", JavaString.format(Translation.translate("info.solarflux.energy.stored1"), [Long.valueOf(this.data.energy)]));
                this.container.setText("textCapacity", JavaString.format(Translation.translate("info.solarflux.energy.capacity"), [Long.valueOf(this.data.capacity)]));
                this.container.setText("textGeneration", JavaString.format(Translation.translate("info.solarflux.energy.generation"), [Long.valueOf(this.data.finalGeneration)]));
                this.container.setScale("energyBarScale", this.data.energy / this.data.capacity);
                this.container.sendChanges();
            }
        }

        private autoBalanceEnergy(solar: PanelTile): number {
            const delta: number = this.data.energy - solar.data.energy;
            if(delta < 0) return solar.autoBalanceEnergy(this);
            else if(delta > 0) return this.extractEnergy(solar.receiveEnergyInternal(this.extractEnergy(solar.receiveEnergyInternal(delta / 2, true), true), false), false);
            return 0;
        }

        private extractEnergy(maxExtract: number, simulate: boolean): number {
            const energyExtracted: number = Math.min(this.data.energy, Math.min(this.data.transfer, maxExtract));
            if(!simulate) this.data.energy -= energyExtracted;
            return energyExtracted;
        }

        private receiveEnergyInternal(maxReceive: number, simulate: boolean): number {
            const energyReceived: number = Math.min(Math.min(this.data.capacity - this.data.energy, JavaInt.MAX_VALUE), Math.min(this.data.transfer, maxReceive));
            if(!simulate) this.data.energy += energyReceived;
            return energyReceived;
        }

        public click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData): void {
            if(Entity.getSneaking(player)){
                const carried = Entity.getCarriedItem(player);
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

        constructor(name: string, generation: number, capacity: number, transfer: number) {
            super({
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
            });
            this.initialGeneration = this.defaultValues.generation = this.defaultValues.finalGeneration = generation;
            this.initialTransfer = this.defaultValues.transfer = transfer;
            this.initialCapacity = this.defaultValues.capacity = capacity;
            const screen = createSolarGuiFor(Translation.translate(`tile.solarflux:solar_panel_${name.replace("sfr_", "")}.name`));
            this.getScreenByName = () => screen;
        }

        [key: string]: any;

    }

    export function createPanelTileFor(id: string, generation: number, capacity: number, transfer: number): void {
        TileEntity.registerPrototype(BlockID[id], new PanelTile(id, generation, capacity, transfer));
        EnergyTileRegistry.addEnergyTypeForId(BlockID[id], RF);
        const slots: {[key: string]: SlotData} = {};
        for(let i=0; i<5; i++) 
            slots[`slotUpgrade${i}`] = {
                input: true, output: true, 
                isValid: (item, s, tileEntity: PanelTile) => SolarUpgrades.isUpgrade(item.id) && 
                                                             SolarUpgrades.getUpgrade(item.id).canInstall(tileEntity, item, tileEntity.container)
            }
        slots["slotCharge"] = {input: true, output: true, isValid: (item: ItemInstance) => ChargeItemRegistry.isValidItem(item.id, "RF", 1)};
        StorageInterface.createInterface(BlockID[id], { slots: slots });
        VanillaSlots.registerForTile(BlockID[id]);
    }

}