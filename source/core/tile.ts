namespace SFRTile {

    type UpgradeMap = {[id: number]: number};
    type ExtraMap = {[id: number]: ItemExtraData};
    interface DefaultValues {
        energy: number, canSeeSky: boolean, sunIntensity: number, generation: number, finalGeneration: number, transfer: number,
        capacity: number, upgradeMap: UpgradeMap, extraMap: ExtraMap, isTraversalEnabled: boolean, traversal: java.util.ArrayList<BlockPosFace>
    }

    export class PanelTile implements EnergyTile {

        // --- --- Unused Implementation --- --- //
        public energyNode: EnergyTileNode; public energyReceive(type: string, amount: number, voltage: number){return 0};
        public isConductor(type: string){return true}; public liquidStorage: LiquidRegistry.Storage; public isLoaded: boolean;
        public remove: boolean; public selfDestroy(){return}; public sendPacket(name: string, data: object){return};
        public networkData: SyncedNetworkData; public networkEntity: NetworkEntity; public sendResponse(name: string, data: object){return};
        // --- --- --- ---- --- ---- --- --- --- //

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
            traversal: new java.util.ArrayList<BlockPosFace>()
        }
        public data: DefaultValues = this.defaultValues;

        public getScreenByName(){ return null; };
        public canReceiveEnergy(){ return false; };
        public canExtractEnergy(){ return true; };

        public init(){
            this.container.setGlobalAddTransferPolicy((container, name, id, amount) => {
                if(name.startsWith("slotUpgrade")) this.applyUpgrades();
                return amount;
            });
            this.container.setGlobalGetTransferPolicy((container, name, id, amount) => {
                if(name.startsWith("slotUpgrade")) this.applyUpgrades();
                return amount;
            });
        }
        
        public getUpgrades(type: number){
            let c: number = 0;
            for(let i=0; i<5; i++){
                let stack: ItemContainerSlot = this.container.getSlot(`slotUpgrade${i}`);
                if(!stack.isEmpty() && stack.id == type) c += stack.count;
            }
            return c;
        }

        public tryPutUpgradesNoSound(id: number, count: number, data: number, extra: ItemExtraData, player: number, inventorySlot: number, isSingle: boolean){
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
                return installed;
            }
            return false;
        }

        public tryPutUpgrades(id: number, count: number, data: number, extra: ItemExtraData, player: number, inventorySlot: number, isSingle: boolean){
            if(this.tryPutUpgradesNoSound(id, count, data, extra, player, inventorySlot, isSingle)) Sounds.anvil(this.x, this.y, this.z, this.dimension);
        }

        public updateGenerationWithSunIntensity(){
            if(!this.data.canSeeSky) return 0;
            let celestialAngleRadians = SunUtils.getCelestialAngleRadians(1);
            if(celestialAngleRadians > Math.PI) celestialAngleRadians = 2 * Math.PI - celestialAngleRadians;
            let lowLightCount = 0, multiplicator = 1.5 - (lowLightCount * .122), displacement = 1.2 + (lowLightCount * .08);
            this.data.sunIntensity = clamp(multiplicator * Math.cos(celestialAngleRadians / displacement), 0, 1);
            this.data.finalGeneration = this.data.generation * this.data.sunIntensity;
            this.container.setText("textEfficiency", java.lang.String.format(Translation.translate("sfr.efficiency"), [Math.round(this.data.sunIntensity * 100)]));
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
                let upgradeId = parseInt(key);
                SolarUpgrades.getUpgrade(upgradeId).update(this, this.data.upgradeMap[key], this.data.extraMap[upgradeId] ?? null);
            }
        }

        public tick(){
            StorageInterface.checkHoppers(this);
            if(World.getThreadTime() % 20 == 0) this.data.canSeeSky = this.blockSource.canSeeSky(this.x, this.y + 1, this.z);
            if(World.getThreadTime() % 200 == 0) this.updateGenerationWithSunIntensity();
            this.data.energy = Math.min(this.data.energy + this.data.finalGeneration, this.data.capacity);
            let chargingItem = this.container.getSlot("slotCharge"),
                type = ChargeItemRegistry.getItemData(chargingItem.id).energy,
                ratio = EnergyTypeRegistry.getValueRatio("FE", type);
            this.data.energy -= Math.round(ChargeItemRegistry.addEnergyToSlot(chargingItem, type, Math.round(this.data.energy * ratio), 1) * ratio);
            this.container.setText("textCharge", java.lang.String.format(Translation.translate("sfr.charge"), [numberWithCommas(this.data.energy)]));
            this.container.setText("textCapacity", java.lang.String.format(Translation.translate("sfr.capacity"), [numberWithCommas(this.data.capacity)]));
            this.container.setText("textGeneration", java.lang.String.format(Translation.translate("sfr.generation"), [numberWithCommas(this.data.finalGeneration)]));
            this.container.setScale("energyBarScale", this.data.energy / this.data.capacity);
            this.container.sendChanges();
        }

        public energyTick(type: string, node: EnergyTileNode){
            if(this.data.isTraversalEnabled && !this.data.traversal.isEmpty()){
                for(let i=0; i<this.data.traversal.size(); i++){
                    let traverse = this.data.traversal.get(i) as BlockPosFace;
                    let tile = TileEntity.getTileEntity(traverse.x, traverse.y, traverse.z, this.blockSource);
                    if(tile == null) continue;
                    if(tile.isMachine){
                        let etile = tile as EnergyTile;
                        if(etile.canReceiveEnergy(traverse.side, "Eu") ||
                           etile.canReceiveEnergy(traverse.side, "RF") ||
                           etile.canReceiveEnergy(traverse.side, "FE")){
                               let type = etile.energyTypes["Eu"] ? "Eu" : etile.energyTypes["RF"] ? "RF" : "FE";
                               let ratio = EnergyTypeRegistry.getValueRatio("FE", type);
                               this.data.energy -= Math.round(etile.energyReceive(type, Math.round(Math.min(this.data.energy, Math.round(this.data.transfer * traverse.rate)) * ratio), etile.getMaxPacketSize ? etile.getMaxPacketSize() : Math.round(this.data.transfer * traverse.rate)) * ratio);
                           }
                    }
                }
            } else {
                let type = node.tileEntity.energyTypes["Eu"] ? "Eu" : node.tileEntity.energyTypes["RF"] ? "RF" : "FE";
                let ratio = EnergyTypeRegistry.getValueRatio("FE", type);
                this.data.energy -= Math.round(node.tileEntity.energyReceive(type, Math.round(Math.min(this.data.energy, this.data.transfer) * ratio), node.tileEntity.getMaxPacketSize ? node.tileEntity.getMaxPacketSize() : Math.round(this.data.transfer * ratio)) * ratio);
            }
        }

        public click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData){
            if(Entity.getSneaking(player)){
                let carried = Entity.getCarriedItem(player);
                if(carried.count > 0 && SolarUpgrades.isUpgrade(carried.id)) this.tryPutUpgrades(id, count, data, extra, player, new PlayerActor(player).getSelectedSlot(), false);
            } else this.container.openFor(Network.getClientForPlayer(player), "main");
        }

        constructor(id: string){
            const stats: PanelStats = getStatsFor(id);
            this.initialGeneration = this.defaultValues.generation = this.defaultValues.finalGeneration = stats.generation;
            this.initialTransfer = this.defaultValues.transfer = stats.transfer;
            this.initialCapacity = this.defaultValues.capacity = stats.capacity;
            this.getScreenByName = () => createSolarGuiFor(Translation.translate(id));
        }

        [key: string]: any;

    }

    export function createPanelTileFor(id: string): void {
        TileEntity.registerPrototype(BlockID[id], new PanelTile(id));
        let slots: {[key: string]: SlotData} = {};
        for(let i=0; i<5; i++) slots[`slotUpgrade${i}`] = {input: true, output: true, isValid: (item) => SolarUpgrades.isUpgrade(item.id)};
        let chargeItemValid = (item: ItemInstance) => ChargeItemRegistry.isValidItem(item.id, "Eu", 1) || 
                                                      ChargeItemRegistry.isValidItem(item.id, "RF", 1) || 
                                                      ChargeItemRegistry.isValidItem(item.id, "FE", 1);
        slots["slotCharge"] = {input: true, output: true, isValid: chargeItemValid};
        StorageInterface.createInterface(BlockID[id], { slots: slots });
    }

}