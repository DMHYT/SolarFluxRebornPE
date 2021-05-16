const createPanelTileFor = (id: string) => {
    const stats: PanelStats = getStatsFor(id);
    const gui: UI.Window = createSolarGuiFor(Translation.translate(id));
    TileEntity.registerPrototype(BlockID[id], {
        useNetworkItemContainer: true,
        initialGeneration: stats.generation,
        initialTransfer: stats.transfer,
        initialCapacity: stats.capacity,
        defaultValues: {
            energy: 0,
            canSeeSky: false,
            sunIntensity: 0,
            generation: stats.generation,
            finalGeneration: stats.generation,
            transfer: stats.transfer,
            capacity: stats.capacity,
            upgradeMap: {},
            extraMap: {},
            isTraversalEnabled: false,
            traversal: new java.util.ArrayList<BlockPosFace>()
        },
        getScreenByName: () => gui,
        canReceiveEnergy: () => false,
        canExtractEnergy: () => true,
        getUpgrades: (type: number) => {
            let c: number = 0;
            for(let i=0; i<5; i++){
                let stack: ItemContainerSlot = (this.container as ItemContainer).getSlot(`slotUpgrade${i}`);
                if(!stack.isEmpty() && stack.id == type) c += stack.count;
            }
            return c;
        },
        tryPutUpgradesNoSound: (id: number, count: number, data: number, extra: ItemExtraData, player: number, inventorySlot: number, isSingle: boolean) => {
            let amt: number = this.getUpgrades(id);
            let iu: SolarUpgrades.UpgradeParams = SolarUpgrades.getUpgrade(id);
            if(amt < iu.getMaxUpgrades() && iu.canInstall(this as unknown as TileEntity, {id: id, count: count, data: data, extra: extra}, this.container)){
                let installed: boolean = false;
                for(let i=0; i<5; i++){
                    let stack: ItemContainerSlot = (this.container as ItemContainer).getSlot(`slotUpgrade${i}`);
                    if(stack.id == id && stack.extra == extra){
                        let allow: number = isSingle ? 1 : Math.min(iu.getMaxUpgrades() - this.getUpgrades(id), Math.min(Item.getMaxStack(id) - count, count));
                        new PlayerActor(player).setInventorySlot(inventorySlot, id, count - allow, data, extra);
                        (this.container as ItemContainer).setSlot(`slotUpgrade${i}`, id, count + allow, data, extra);
                        installed = true; break;
                    } else if(stack.isEmpty()){
                        let allow: number = isSingle ? 1 : Math.min(iu.getMaxUpgrades() - this.getUpgrades(id), count);
                        new PlayerActor(player).setInventorySlot(inventorySlot, id, count - allow, data, extra);
                        (this.container as ItemContainer).setSlot(`slotUpgrade${i}`, id, allow, data, extra);
                        installed = true; break;
                    }
                    (this.container as ItemContainer).sendChanges();
                }
                return installed;
            }
            return false;
        },
        tryPutUpgrades: (id: number, count: number, data: number, extra: ItemExtraData, player: number, inventorySlot: number, isSingle: boolean) => {
            if(this.tryPutUpgradesNoSound(id, count, data, extra, player, inventorySlot, isSingle)){
                playAnvilSoundOn(this.x, this.y, this.z, this.dimension);
            }
        },
        updateGenerationWithSunIntensity: () => {
            if(!this.data.canSeeSky) return 0;
            let celestialAngleRadians: number = SunUtils.getCelestialAngleRadians(1);
            if(celestialAngleRadians > Math.PI) celestialAngleRadians = 2 * Math.PI - celestialAngleRadians;
            let lowLightCount: number = 0;
            let multiplicator: number = 1.5 - (lowLightCount * .122);
            let displacement: number = 1.2 + (lowLightCount * .08);
            this.data.sunIntensity = clamp(multiplicator * Math.cos(celestialAngleRadians / displacement), 0, 1);
            this.data.finalGeneration = this.data.generation * this.data.sunIntensity;
            (this.container as ItemContainer).setText("textEfficiency", java.lang.String.format(Translation.translate("sfr.efficiency"), [Math.round(this.data.sunIntensity * 100)]));
            (this.container as ItemContainer).setScale("sunBarScale", this.data.sunIntensity);
        },
        resetUpgrades: () => {
            this.data.generation = this.initialGeneration;
            this.data.transfer = this.initialTransfer;
            this.data.capacity = this.initialCapacity;
            this.data.upgradeMap = {} as {[key: number]: number};
            this.data.traversal = false;
        },
        fillUpgradeMap: () => {
            for(let i=0; i<5; i++){
                let slot: ItemContainerSlot = this.container.getSlot(`slotUpgrade${i}`);
                let upgrade: SolarUpgrades.UpgradeParams = SolarUpgrades.getUpgrade(slot.id);
                if(!this.data.upgradeMap[slot.id]) this.data.upgradeMap[slot.id] = 0;
                this.data.upgradeMap[slot.id] = Math.min(this.data.upgradeMap[slot.id] + slot.count, upgrade.getMaxUpgrades());
                if(slot.extra != null) this.data.extraMap[slot.id] = slot.extra;
            }
        },
        applyUpgrades: () => {
            this.resetUpgrades();
            this.fillUpgradeMap();
            for(let key in this.data.upgradeMap){
                let upgradeId = parseInt(key);
                SolarUpgrades.getUpgrade(upgradeId).update(this as unknown as TileEntity, this.data.upgradeMap[key], !!this.data.extraMap[upgradeId] ? this.data.extraMap[upgradeId] : null);
            }
        },
        tick: () => {
            StorageInterface.checkHoppers(this as unknown as TileEntity);
            if(World.getThreadTime() % 20 == 0) this.data.canSeeSky = (this.blockSource as BlockSource).canSeeSky(this.x, this.y + 1, this.z);
            this.applyUpgrades();
            if(World.getThreadTime() % 200 == 0) this.updateGenerationWithSunIntensity();
            this.data.energy = Math.min(this.data.energy + this.data.finalGeneration, this.data.capacity);
            let chargingItem = this.container.getSlot("slotCharge");
            let itemEnergyType = ChargeItemRegistry.getItemData(chargingItem.id).energy;
            let ratio = EnergyTypeRegistry.getValueRatio("FE", itemEnergyType);
            this.data.energy -= Math.round(ChargeItemRegistry.addEnergyToSlot(chargingItem, itemEnergyType, Math.round(this.data.energy * ratio), 1) * ratio);
            (this.container as ItemContainer).setText("textCharge", java.lang.String.format(Translation.translate("sfr.charge"), [numberWithCommas(this.data.energy)]));
            (this.container as ItemContainer).setText("textCapacity", java.lang.String.format(Translation.translate("sfr.capacity"), [numberWithCommas(this.data.capacity)]));
            (this.container as ItemContainer).setText("textGeneration", java.lang.String.format(Translation.translate("sfr.generation"), [numberWithCommas(this.data.finalGeneration)]));
            (this.container as ItemContainer).setScale("energyBarScale", this.data.energy / this.data.capacity);
            (this.container as ItemContainer).sendChanges();
        },
        energyTick: (type: string, node: EnergyTileNode) => {
            if(this.data.isTraversalEnabled && (!(this.data.traversal as java.util.ArrayList<BlockPosFace>).isEmpty())){
                for(let i=0; i<this.data.traversal.size(); i++){
                    let traverse: BlockPosFace = this.data.traversal.get(i);
                    let tile: TileEntity = TileEntity.getTileEntity(traverse.x, traverse.y, traverse.z, this.blockSource);
                    if(tile == null) continue;
                    if(tile.isMachine){
                        let etile: EnergyTile = tile as EnergyTile;
                        if(etile.canReceiveEnergy(traverse.side, "Eu") || etile.canReceiveEnergy(traverse.side, "RF") || etile.canReceiveEnergy(traverse.side, "FE")){
                            let type: string = etile.__energyTypes["Eu"] ? "Eu" : etile.__energyTypes["RF"] ? "RF" : "FE";
                            let ratio: number = EnergyTypeRegistry.getValueRatio("FE", type);
                            this.data.energy -= Math.round(etile.energyReceive(type, Math.round(Math.min(this.data.energy, Math.round(this.data.transfer * traverse.rate)) * ratio), etile.getMaxPacketSize ? etile.getMaxPacketSize() : Math.round(this.data.transfer * traverse.rate)) * ratio);
                        }
                    }
                }
            } else {
                let type: string = node.tileEntity.__energyTypes["Eu"] ? "Eu" : node.tileEntity.__energyTypes["RF"] ? "RF" : "FE";
                let ratio: number = EnergyTypeRegistry.getValueRatio("FE", type);
                this.data.energy -= Math.round(node.tileEntity.energyReceive(type, Math.round(Math.min(this.data.energy, this.data.transfer) * ratio), node.tileEntity.getMaxPacketSize ? node.tileEntity.getMaxPacketSize() : Math.round(this.data.transfer * ratio)) * ratio);
            }
        },
        click: (id, count, data, coords, player, extra) => {
            if(Entity.getSneaking(player)){
                let carried = Entity.getCarriedItem(player);
                if(carried.count > 0 && SolarUpgrades.isUpgrade(carried.id)) this.tryPutUpgrades(id, count, data, extra, player, new PlayerActor(player).getSelectedSlot(), false);
            } else (this.container as ItemContainer).openFor(Network.getClientForPlayer(player), "main");
        }
    });
    let slots: {[key: string]: SlotData} = {};
    for(let i=0; i<5; i++) slots[`slotUpgrade${i}`] = {input: true, output: true, isValid: (item) => SolarUpgrades.isUpgrade(item.id)};
    let chargeItemValid = (item: ItemInstance) => ChargeItemRegistry.isValidItem(item.id, EU.name, 1) || ChargeItemRegistry.isValidItem(item.id, RF.name, 1) || ChargeItemRegistry.isValidItem(item.id, FE.name, 1);
    slots["slotCharge"] = {input: true, output: true, isValid: chargeItemValid};
    StorageInterface.createInterface(BlockID[id], { slots: slots });
}