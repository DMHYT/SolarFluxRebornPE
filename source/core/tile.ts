namespace SFRTile {

    type UpgradeMap = {[id: number]: number};
    type ExtraMap = {[id: number]: ItemExtraData};
    interface DefaultValues {
        energy: number, canSeeSky: boolean, sunIntensity: number, generation: number, finalGeneration: number, transfer: number, isDestroyed: boolean,
        capacity: number, upgradeMap: UpgradeMap, extraMap: ExtraMap, isTraversalEnabled: boolean, traversal: java.util.ArrayList<BlockPosFace>
    }

    export class PanelTile implements TileEntity {

        // --- --- Unused Implementation --- --- //
        public liquidStorage: LiquidRegistry.Storage; public isLoaded: boolean;
        public remove: boolean; public selfDestroy(){return}; public sendPacket(name: string, data: object){return};
        public networkData: SyncedNetworkData; public networkEntity: NetworkEntity; 
        public sendResponse(name: string, data: object){return};
        // --- --- --- ---- --- ---- --- --- --- //

        public readonly blockID: number;
        public readonly x: number;
        public readonly y: number;
        public readonly z: number;
        public readonly dimension: number;
        public container: ItemContainer;
        public blockSource: BlockSource;

        public readonly useNetworkItemContainer: boolean = true;
        public readonly initialGeneration: number;
        public readonly initialTransfer: number;
        public readonly initialCapacity: number;

        public readonly __sfr__: boolean = true;

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
            traversal: new java.util.ArrayList<BlockPosFace>(),
            isDestroyed: false
        }
        public data: DefaultValues = this.defaultValues;

        public getScreenByName(){ return null; };

        public init(){
            this.data.canSeeSky = this.blockSource.canSeeSky(this.x, this.y + 1, this.z);
            this.updateGenerationWithSunIntensity();
        }
        
        public getUpgrades(type: number){
            let c: number = 0;
            for(let i=0; i<5; i++){
                let stack: ItemContainerSlot = this.container.getSlot(`slotUpgrade${i}`);
                if(!stack.isEmpty() && stack.id == type) c += stack.count;
            }
            return c;
        }

        public tryPutUpgrades(id: number, count: number, data: number, extra: ItemExtraData, player: number, inventorySlot: number, isSingle: boolean, sound: boolean): void {
            let amt: number = this.getUpgrades(id);
            let iu: SolarUpgrades.UpgradeParams = SolarUpgrades.getUpgrade(id);
            if(amt < iu.getMaxUpgrades() && iu.canInstall(this, {id: id, count: count, data: data, extra: extra}, this.container)){
                let installed: boolean = false;
                let actor = new PlayerActor(player);
                for(let i=0; i<5; i++){
                    let stack: ItemContainerSlot = this.container.getSlot(`slotUpgrade${i}`);
                    if(stack.id == id && stack.extra == extra){
                        let allow: number = isSingle ? 1 : Math.min(iu.getMaxUpgrades() - this.getUpgrades(id), Math.min(Item.getMaxStack(id) - count, count));
                        actor.setInventorySlot(inventorySlot, id, count - allow, data, extra);
                        this.container.setSlot(`slotUpgrade${i}`, id, count + allow, data, extra);
                        installed = true; break;
                    } else if(stack.isEmpty()){
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

        public updateGenerationWithSunIntensity(){
            if(!this.data.canSeeSky) return this.data.sunIntensity = 0;
            let celestialAngleRadians = SunUtils.getCelestialAngleRadians(1);
            if(celestialAngleRadians > Math.PI) celestialAngleRadians = 2 * Math.PI - celestialAngleRadians;
            let lowLightCount = 0, multiplicator = 1.5 - (lowLightCount * .122), displacement = 1.2 + (lowLightCount * .08);
            this.data.sunIntensity = clamp(multiplicator * Math.cos(celestialAngleRadians / displacement), 0, 1);
            this.data.finalGeneration = Math.round(this.data.generation * this.data.sunIntensity);
            this.container.setText("textEfficiency", java.lang.String.format(Translation.translate("sfr.efficiency"), [java.lang.Integer.valueOf(Math.round(this.data.sunIntensity * 100))]));
            this.container.setScale("sunBarScale", this.data.sunIntensity);
            this.container.sendChanges();
        }

        public resetUpgrades(){
            this.data.generation = this.data.finalGeneration = this.initialGeneration;
            this.data.transfer = this.initialTransfer;
            this.data.capacity = this.initialCapacity;
            this.data.upgradeMap = {};
            this.data.extraMap = {};
            this.data.isTraversalEnabled = false;
        }

        public fillUpgradeMap(){
            for(let i=0; i<5; i++){
                let slot = this.container.getSlot(`slotUpgrade${i}`);
                let upgrade = SolarUpgrades.getUpgrade(slot.id);
                let map = this.data.upgradeMap;
                if(!map[slot.id]) map[slot.id] = 0;
                map[slot.id] = Math.min(map[slot.id] + slot.count, upgrade.getMaxUpgrades());
                if(slot.extra != null) this.data.extraMap[slot.id] = slot.extra;
            }
        }

        public applyUpgrades(){
            this.resetUpgrades();
            this.fillUpgradeMap();
            for(let key in this.data.upgradeMap){
                let upgradeId = parseInt(key), upgrade = SolarUpgrades.getUpgrade(upgradeId);
                if(upgrade.update) upgrade.update(this, this.data.upgradeMap[key], this.data.extraMap[upgradeId] ?? null);
            }
        }

        public tick(){
            StorageInterface.checkHoppers(this);
            if(World.getWorldTime() % 20 === 0) this.data.traversal.clear();
            this.applyUpgrades();
            if(World.getThreadTime() % 20 == 0) this.data.canSeeSky = this.blockSource.canSeeSky(this.x, this.y + 1, this.z);
            if(World.getThreadTime() % 200 == 0) this.updateGenerationWithSunIntensity();
            this.data.energy += Math.min(this.data.capacity - this.data.energy, this.data.finalGeneration);
            {
                for(let hor of HORIZONTAL_FACES){ // horizontal faces
                    let pos = BlockPosUtils.offset(BlockPosUtils.fromTile(this), hor);
                    let tile = TileEntity.getTileEntity(pos.x, pos.y, pos.z, this.blockSource);
                    if(tile.__sfr__) this.autoBalanceEnergy(tile as PanelTile);
                }
                for(let hor of ALL_FACES){
                    if(hor == EBlockSide.UP) continue;
                    let pos = BlockPosUtils.offset(BlockPosUtils.fromTile(this), hor),
                        tile = TileEntity.getTileEntity(pos.x, pos.y, pos.z, this.blockSource);
                    if(tile == null) continue;
                    if(tile.isEnergyTile){
                        let etile = tile as EnergyTile,
                            opposite = BlockPosUtils.oppositeFace(hor);
                        if(etile.canReceiveEnergy(opposite, "Eu") ||
                           etile.canReceiveEnergy(opposite, "RF") ||
                           etile.canReceiveEnergy(opposite, "FE")){
                                let type = etile.energyTypes["Eu"] ? "Eu" : etile.energyTypes["RF"] ? "RF" : "FE",
                                    ratio = EnergyTypeRegistry.getValueRatio("FE", type);
                                this.data.energy -= etile.energyReceive(type, Math.round(Math.min(this.data.energy, this.data.transfer) * ratio), etile.getMaxPacketSize() ? Math.min(etile.getMaxPacketSize(), Math.round(this.data.transfer * ratio)) : Math.round(this.data.transfer * ratio)) * ratio;
                           }
                    }
                }
                if(!this.data.traversal.isEmpty()){
                    for(let i=0; i<this.data.traversal.size(); ++i){
                        let traverse: BlockPosFace = this.data.traversal.get(i),
                            tile = TileEntity.getTileEntity(traverse.x, traverse.y, traverse.z, this.blockSource);
                        if(tile == null) continue;
                        if(tile.isEnergyTile){
                            let etile = tile as EnergyTile,
                                opposite = BlockPosUtils.oppositeFace(traverse.side);
                            if(etile.canReceiveEnergy(opposite, "Eu") ||
                               etile.canReceiveEnergy(opposite, "RF") ||
                               etile.canReceiveEnergy(opposite, "FE")){
                                    let type = etile.energyTypes["Eu"] ? "Eu" : etile.energyTypes["RF"] ? "RF" : "FE",
                                        ratio = EnergyTypeRegistry.getValueRatio("FE", type);
                                    this.data.energy -= etile.energyReceive(type, Math.round(Math.min(this.data.energy, this.data.transfer) * ratio), etile.getMaxPacketSize() ? Math.min(etile.getMaxPacketSize(), Math.round(this.data.transfer * ratio * traverse.rate)) : Math.round(this.data.transfer * ratio * traverse.rate)) * ratio;
                                    continue;
                               }
                        }
                    }
                }
            }
            let chargingItem = this.container.getSlot("slotCharge");
            if(chargingItem.id != 0 && ChargeItemRegistry.getItemData(chargingItem.id)){
                let type = ChargeItemRegistry.getItemData(chargingItem.id).energy,
                    ratio = EnergyTypeRegistry.getValueRatio("FE", type);
                this.data.energy -= Math.round(ChargeItemRegistry.addEnergyToSlot(chargingItem, type, Math.round(this.data.energy * ratio), 1) * ratio);
            }
            this.container.setText("textCharge", java.lang.String.format(Translation.translate("info.sfr.energy.stored1"), [java.lang.Long.valueOf(this.data.energy)]));
            this.container.setText("textCapacity", java.lang.String.format(Translation.translate("info.sfr.energy.capacity"), [java.lang.Long.valueOf(this.data.capacity)]));
            this.container.setText("textGeneration", java.lang.String.format(Translation.translate("info.sfr.energy.generation"), [java.lang.Long.valueOf(this.data.finalGeneration)]));
            this.container.setScale("energyBarScale", this.data.energy / this.data.capacity);
            this.container.sendChanges();
        }

        public autoBalanceEnergy(solar: PanelTile): number {
            let delta: number = this.data.energy - solar.data.energy;
            if(delta < 0) return solar.autoBalanceEnergy(this);
            else if(delta > 0) return this.extractEnergy(solar.receiveEnergyInternal(this.extractEnergy(solar.receiveEnergyInternal(delta / 2, true), true), false), false);
            return 0;
        }

        public extractEnergy(maxExtract: number, simulate: boolean): number {
            let energyExtracted: number = Math.min(this.data.energy, Math.min(this.data.transfer, maxExtract));
            if(!simulate) this.data.energy -= energyExtracted;
            return energyExtracted;
        }

        public receiveEnergyInternal(maxReceive: number, simulate: boolean): number {
            let energyReceived: number = Math.min(Math.min(this.data.capacity - this.data.energy, java.lang.Integer.MAX_VALUE), Math.min(this.data.transfer, maxReceive));
            if(!simulate) this.data.energy += energyReceived;
            return energyReceived;
        }

        public click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData){
            if(Entity.getSneaking(player)){
                let carried = Entity.getCarriedItem(player);
                if(carried.count > 0 && SolarUpgrades.isUpgrade(carried.id)) this.tryPutUpgrades(id, count, data, extra, player, new PlayerActor(player).getSelectedSlot(), false, true);
            } else this.container.openFor(Network.getClientForPlayer(player), "main");
        }

        public destroy = () => !this.data.isDestroyed;

        constructor(id: string){
            const stats: PanelStats = getStatsFor(id);
            this.initialGeneration = this.defaultValues.generation = this.defaultValues.finalGeneration = stats.generation;
            this.initialTransfer = this.defaultValues.transfer = stats.transfer;
            this.initialCapacity = this.defaultValues.capacity = stats.capacity;
            this.getScreenByName = () => SFRGui.createSolarGuiFor(Translation.translate(id));
        }

        [key: string]: any;

    }

    export function createPanelTileFor(id: string): void {
        TileEntity.registerPrototype(BlockID[id], new PanelTile(id));
        let slots: {[key: string]: SlotData} = {};
        for(let i=0; i<5; i++) slots[`slotUpgrade${i}`] = {input: true, output: true, isValid: (item) => SolarUpgrades.isUpgrade(item.id)};
        slots["slotCharge"] = {input: true, output: true, isValid: (item: ItemInstance) => ChargeItemRegistry.isValidItem(item.id, "Eu", 1) || 
                                                                                           ChargeItemRegistry.isValidItem(item.id, "RF", 1) || 
                                                                                           ChargeItemRegistry.isValidItem(item.id, "FE", 1)};
        StorageInterface.createInterface(BlockID[id], { slots: slots });
    }

}