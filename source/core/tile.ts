namespace SFRTile {

    type UpgradeMap = {[id: number]: number};
    type ExtraMap = {[id: number]: ItemExtraData};
    interface DefaultValues {
        energy: number, canSeeSky: boolean, sunIntensity: number, generation: number, finalGeneration: number, transfer: number, isDestroyed: boolean,
        capacity: number, upgradeMap: UpgradeMap, extraMap: ExtraMap, isTraversalEnabled: boolean, traversal: BlockPosFace[], anim: Nullable<Animation.Base>
    }

    export const CONNECTION_CUBES = {
        centerSouth: [-6.5, 7.5, 14, 1],
        centerNorth: [-6.5, -7.5, 14, 1],
        centerEast: [7.5, -6.5, 1, 14],
        centerWest: [-7.5, -6.5, 1, 14],
        cornerNorthEast: [7.5, -7.5, 1, 1],
        cornerNorthWest: [-7.5, -7.5, 1, 1],
        cornerSouthEast: [7.5, 7.5, 1, 1],
        cornerSouthWest: [-7.5, 7.5, 1, 1]
    }

    /**
     * Implementation to make creating
     * TE client instance easier
     */
    export class PanelClientTile {

        public networkData: SyncedNetworkData;
        public render: Render;
        public animation: Animation.Base;
        public readonly x: number;
        public readonly y: number;
        public readonly z: number;

        constructor(readonly skin: string){}

        public updateModel(){
            this.render = new Render();
            this.render.getPart("body").addPart("additionalCubes");
            let boxes: Render.PartElement[] = [];
            for(let cubeName in CONNECTION_CUBES){
                if(this.networkData.getBoolean(cubeName, false)){
                    boxes.push({
                        uv: {x: 0, y: 0},
                        coords: {x: CONNECTION_CUBES[cubeName][0], y: 18.2, z: CONNECTION_CUBES[cubeName][1]},
                        size: {x: CONNECTION_CUBES[cubeName][2], y: 0.4, z: CONNECTION_CUBES[cubeName][3]}
                    });
                }
            }
            this.render.setPart("additionalCubes", boxes, {width: 16, height: 16, u: 0, v: 0, pos: [0, 0, 0]});
            this.animation = new Animation.Base(this.x, this.y, this.z);
            this.animation.describe({render: this.render.getId(), skin: this.skin});
            this.animation.load();
            this.animation.setSkylightMode();
        }

        public load(){;
            this.updateModel();
            this.networkData.addOnDataChangedListener((data, isExternal) => this.updateModel());
        }

        public unload(){
            this.render.setPart("additionalCubes", [], {});
            this.render = null;
            this.animation.destroy();
            this.animation = null;
        }

    }

    export class PanelTile implements EnergyTile {

        // --- --- Unused implementation from standart TE prototype --- --- //
        public liquidStorage: LiquidRegistry.Storage; public isLoaded: boolean;
        public remove: boolean; public selfDestroy(){return}; public sendPacket(name: string, data: object){return};
        public networkData: SyncedNetworkData; public networkEntity: NetworkEntity; 
        public sendResponse(name: string, data: object){return};
        // --- --- --- --- --- ---- --- --- --- --- --- --- --- --- --- --- //

        // --- --- Unused implementation from EnergyTile --- --- //
        public energyNode: EnergyTileNode; public energyReceive(type, amount, voltage){return 0}; public isConductor(){return false};
        public canReceiveEnergy(){return false} public canExtractEnergy(){return true};
        // --- --- --- --- --- ---- ---- --- --- --- --- --- --- //

        public readonly blockID: number;
        public readonly x: number;
        public readonly y: number;
        public readonly z: number;
        public readonly dimension: number;
        public container: ItemContainer;
        public blockSource: BlockSource;

        public readonly client: PanelClientTile;

        public readonly useNetworkItemContainer: boolean = true;
        public readonly initialGeneration: number;
        public readonly initialTransfer: number;
        public readonly initialCapacity: number;

        /**
         * Flag to check if some TileEntity instance
         * is a solar panel from SFR
         */
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
            traversal: [] as BlockPosFace[],
            isDestroyed: false,
            anim: null
        }
        public data: DefaultValues = this.defaultValues;

        public getScreenByName(){ return null; };

        public updateConnectionCubes(){
            let n = this.blockSource.getBlockId(this.x, this.y, this.z - 1) == this.blockID,
                s = this.blockSource.getBlockId(this.x, this.y, this.z + 1) == this.blockID,
                e = this.blockSource.getBlockId(this.x - 1, this.y, this.z) == this.blockID,
                w = this.blockSource.getBlockId(this.x + 1, this.y, this.z) == this.blockID;
            if(!n) this.networkData.putBoolean("centerNorth", true);
            if(!s) this.networkData.putBoolean("centerSouth", true);
            if(!e) this.networkData.putBoolean("centerEast", true);
            if(!w) this.networkData.putBoolean("centerWest", true);
            if(n == !e || (!n && !e)) this.networkData.putBoolean("cornerNorthEast", true);
            if(n == !w || (!n && !w)) this.networkData.putBoolean("cornerNorthWest", true);
            if(s == !e || (!s && !e)) this.networkData.putBoolean("cornerSouthEast", true);
            if(s == !w || (!s && !w)) this.networkData.putBoolean("cornerSouthWest", true);
            this.networkData.sendChanges();
        }

        public init(){
            for(let cubeName in CONNECTION_CUBES){
                this.networkData.putBoolean(cubeName, false);
            }
            this.updateConnectionCubes();
            this.data.canSeeSky = this.blockSource.canSeeSky(this.x, this.y + 1, this.z);
            this.computeSunIntensity();
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
            if(iu != null){
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
        }

        public computeSunIntensity(){
            if(!this.data.canSeeSky) return this.data.sunIntensity = 0;
            let celestialAngleRadians = SunUtils.getCelestialAngleRadians(1);
            if(celestialAngleRadians > Math.PI) celestialAngleRadians = 2 * Math.PI - celestialAngleRadians;
            let lowLightCount = 0, multiplicator = 1.5 - (lowLightCount * .122), displacement = 1.2 + (lowLightCount * .08);
            this.data.sunIntensity = clamp(multiplicator * Math.cos(celestialAngleRadians / displacement), 0, 1);
            this.container.setScale("sunBarScale", this.data.sunIntensity);
            this.container.sendChanges();
        }

        public updateGenerationWithSunIntensity(){
            this.data.finalGeneration = Math.round(this.data.generation * this.data.sunIntensity);
            this.container.setText("textEfficiency", java.lang.String.format(Translation.translate("info.sfr.energy.efficiency"), [java.lang.Integer.valueOf(Math.round(this.data.sunIntensity * 100))]));
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
                if(upgrade != null){
                    let map = this.data.upgradeMap;
                    if(!map[slot.id]) map[slot.id] = 0;
                    map[slot.id] = Math.min(map[slot.id] + slot.count, upgrade.getMaxUpgrades());
                    if(slot.extra != null) this.data.extraMap[slot.id] = slot.extra;
                }
            }
        }

        public applyUpgrades(){
            this.resetUpgrades();
            this.fillUpgradeMap();
            for(let key in this.data.upgradeMap){
                let upgradeId = parseInt(key), upgrade = SolarUpgrades.getUpgrade(upgradeId);
                if(upgrade.update) upgrade.update(this, this.data.upgradeMap[key], this.data.extraMap[upgradeId] ?? null);
            }
            this.updateGenerationWithSunIntensity();
        }

        public chargeItem(){
            let slot = this.container.getSlot("slotCharge");
            if(slot.id != 0 && typeof ChargeItemRegistry.getItemData(slot.id) !== "undefined"){
                let data = ChargeItemRegistry.getItemData(slot.id),
                    type = data.energy,
                    ratio = EnergyTypeRegistry.getValueRatio("FE", type),
                    amount = Math.round(Math.min(this.data.energy, this.data.transfer) * ratio);
                this.data.energy -= Math.round(ChargeItemRegistry.addEnergyToSlot(slot, type, amount, data.tier, true) / ratio);
            }
        }

        public tick(){
            StorageInterface.checkHoppers(this);
            if(World.getThreadTime() % 20 == 0) this.data.canSeeSky = this.blockSource.canSeeSky(this.x, this.y + 1, this.z);
            if(World.getThreadTime() % 20 == 0) this.data.traversal = [];
            if(World.getThreadTime() % __config__.getNumber("sun_intensity_update_interval").intValue() == 0) this.computeSunIntensity();
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
                    if(EnergyTileRegistry.isMachine(tile.blockID) && !tile.__sfr__){
                        let etile = tile as EnergyTile,
                            opposite = BlockPosUtils.oppositeFace(traverse.side);
                        if(etile.blockSource && Object.keys(etile.energyTypes).length > 0){
                            let type = etile.energyTypes[Object.keys(etile.energyTypes)[0]];
                            if(etile.canReceiveEnergy(opposite, type)){
                                let ratio = EnergyTypeRegistry.getValueRatio("FE", type),
                                    amount = Math.round(Math.min(this.data.energy, this.data.transfer) * ratio),
                                    voltage = Math.round(this.data.transfer * ratio * traverse.rate),
                                    protectedVoltage = etile.getMaxPacketSize ? Math.min(etile.getMaxPacketSize(), voltage) : voltage;
                                this.data.energy -= Math.round(etile.energyReceive(type, amount, protectedVoltage) / ratio);
                            }
                        }
                    }
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
            } else {
                Game.prevent();
                this.container.openFor(Network.getClientForPlayer(player), "main");
            } 
        }

        public destroy = () => !this.data.isDestroyed;

        constructor(id: string){
            const stats: PanelStats = getStatsFor(id);
            this.initialGeneration = this.defaultValues.generation = this.defaultValues.finalGeneration = stats.generation;
            this.initialTransfer = this.defaultValues.transfer = stats.transfer;
            this.initialCapacity = this.defaultValues.capacity = stats.capacity;
            this.getScreenByName = () => createSolarGuiFor(Translation.translate(id));
            this.client = new PanelClientTile(`terrain-atlas/${id}_base.png`);
        }

        public energyTick(type: string, node: EnergyTileNode){
            if(!this.data.isTraversalEnabled && this.data.traversal.length == 0){
                let ratio = EnergyTypeRegistry.getValueRatio("FE", node.baseEnergy),
                    output = Math.round(Math.min(this.data.energy, this.data.transfer) * ratio);
                this.data.energy -= Math.round(node.add(Math.min(output, node.tileEntity.getMaxPacketSize ? node.tileEntity.getMaxPacketSize() : output)) / ratio);
            }
        } 

        [key: string]: any;

    }

    export function createPanelTileFor(id: string): void {
        TileEntity.registerPrototype(BlockID[id], new PanelTile(id));
        for(let i in EnergyTypeRegistry.energyTypes)
            EnergyTileRegistry.addEnergyTypeForId(BlockID[id], EnergyTypeRegistry.energyTypes[i] as EnergyType);
        let slots: {[key: string]: SlotData} = {};
        for(let i=0; i<5; i++) slots[`slotUpgrade${i}`] = {input: true, output: true, isValid: (item) => SolarUpgrades.isUpgrade(item.id)};
        slots["slotCharge"] = {input: true, output: true, isValid: (item: ItemInstance) => typeof ChargeItemRegistry.getItemData(item.id) !== "undefined"};
        StorageInterface.createInterface(BlockID[id], { slots: slots });
    }

}