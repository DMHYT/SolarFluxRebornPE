createItem("blank");
createItem("u_blockcharging");
createItem("u_capacity");
createItem("u_dispersive");
createItem("u_efficiency");
createItem("u_furnace");
createItem("mirror");
createItem("photo1");
createItem("photo2");
createItem("photo3");
createItem("photo4");
createItem("photo5");
createItem("photo6");
createPanel("sfr_1");
createPanel("sfr_2");
createPanel("sfr_3");
createPanel("sfr_4");
createPanel("sfr_5");
createPanel("sfr_6");
createPanel("sfr_7");
createPanel("sfr_8");
createItem("u_transfer");
createItem("u_traversal");
Item.getItemById("sfr_u_blockcharging").setMaxStackSize(1);
Item.getItemById("sfr_u_capacity").setMaxStackSize(10);
Item.getItemById("sfr_u_dispersive").setMaxStackSize(1);
Item.getItemById("sfr_u_efficiency").setMaxStackSize(20);
Item.getItemById("sfr_u_furnace").setMaxStackSize(1);
Item.getItemById("sfr_u_transfer").setMaxStackSize(10);
Item.getItemById("sfr_u_traversal").setMaxStackSize(1);
Item.addCreativeGroup("sfr", Translation.translate("sfr.itemgroup"), SFR_STUFF);

SolarUpgrades.registerUpgrade(ItemID.sfr_u_blockcharging, {
    getMaxUpgrades: () => 1,
    canInstall: (tile, stack) => 
        stack.extra !== null && 
        stack.extra.getLong("Pos", null) !== null && 
        stack.extra.getInt("Face", null) !== null && 
        (stack.extra.getInt("Dim", null) == null || 
        tile.dimension == stack.extra.getInt("Dim")) && 
        distanceSqBlockPos(blockPosFromTile(tile), blockPosFromLong(stack.extra.getLong("Pos"))) <= 256 &&
        (tile.isMachine ? 
            ((tile as EnergyTile).canReceiveEnergy(stack.extra.getInt("Face"), "Eu") ||
            (tile as EnergyTile).canReceiveEnergy(stack.extra.getInt("Face"), "RF") ||
            (tile as EnergyTile).canReceiveEnergy(stack.extra.getInt("Face"), "FE")) : false ),
    canStayInPanel: (tile, stack, container) => (this as unknown as SolarUpgrades.UpgradeParams).canInstall(tile, stack, container),
    update: (tile, amount, extra) => {
        if(World.getWorldTime() % 20 == 0){
            let pos: BlockPos = blockPosFromLong(extra.getLong("Pos"));
            let d: number = distanceSqBlockPos(blockPosFromTile(tile), pos);
            if(d <= 256){
                d /= 256;
                tile.traversal.clear();
                if(tile.getUpgrades(ItemID.sfr_u_traversal) > 0){
                    Traversal.cache.clear();
                    Traversal.cache.add(pos);
                    Traversal.findMachines(tile, Traversal.cache, tile.traversal);
                }
                tile.traversal.add(bpfFromBp(pos, extra.getInt("Face"), 1 - d));
            }
        }
    }
});
SolarUpgrades.registerUpgrade(ItemID.sfr_u_capacity, {
    getMaxUpgrades: () => 10,
    update: (tile, amount) => tile.data.capacity *= (1 + amount * .1),
});
SolarUpgrades.registerUpgrade(ItemID.sfr_u_dispersive, {
    getMaxUpgrades: () => 1,
    update: (tile) => {
        for(let player of tile.blockSource.fetchEntitiesInAABB(tile.x - 16, tile.y - 16, tile.z - 16, tile.x + 16, tile.y + 16, tile.z + 16, EEntityType.PLAYER, false)){
            let mod: number = Math.max(0, 1 - distanceSqBlockPos(blockPosFromEntity(player), blockPosFromTile(tile)) / 256);
            let transfer: number = Math.round(tile.initialTransfer * mod);
            let sent: number = Math.min(Math.round(tile.data.energy * mod), transfer);
            tile.data.energy -= sent - this.chargePlayer(player, sent);
        }
    },
    chargePlayer: (player: number, fe: number) => {
        let isValid = (id: number) => ChargeItemRegistry.isValidItem(id, "Eu", 1) || ChargeItemRegistry.isValidItem(id, "RF", 1) || ChargeItemRegistry.isValidItem(id, "FE", 1);
        let actor = new PlayerActor(player);
        for(let i=0; i<36; i++){
            let slot = actor.getInventorySlot(i);
            if(isValid(slot.id)){
                let type = ChargeItemRegistry.getItemData(slot.id).energy;
                let ratio = EnergyTypeRegistry.getValueRatio("FE", type);
                fe -= Math.round(ChargeItemRegistry.addEnergyTo(slot, type, Math.min(Math.round(fe * ratio), ChargeItemRegistry.getMaxCharge(slot.id) - ChargeItemRegistry.getEnergyStored(slot)), 1) * ratio);
                return fe;
            }
        }
        for(let i=0; i<4; i++){
            let slot = actor.getArmor(i);
            if(isValid(slot.id)){
                let type = ChargeItemRegistry.getItemData(slot.id).energy;
                let ratio = EnergyTypeRegistry.getValueRatio("FE", type);
                fe -= Math.round(ChargeItemRegistry.addEnergyTo(slot, type, Math.min(Math.round(fe * ratio), ChargeItemRegistry.getMaxCharge(slot.id) - ChargeItemRegistry.getEnergyStored(slot)), 1) * ratio);
                return fe;
            }
        }
        return fe;
    }
});
SolarUpgrades.registerUpgrade(ItemID.sfr_u_efficiency, {
    getMaxUpgrades: () => 20,
    update: (tile, amount) => tile.data.generation *= (1 + amount * .05)
});
SolarUpgrades.registerUpgrade(ItemID.sfr_u_furnace, {
    getMaxUpgrades: () => 1,
    update: (tile) => {
        let t: Nullable<NativeTileEntity> = tile.blockSource.getBlockEntity(tile.x, tile.y - 1, tile.z);
        if(t != null && t.getType() == ETileEntityType.FURNACE){
            if(t.getSlot(0).id != 0 && t.getSlot(1).count == 0 && tile.data.energy >= 1000){
                t.setSlot(1, 5, 1, 0);
                tile.data.energy -= 1000;
            }
        }
    }
});
SolarUpgrades.registerUpgrade(ItemID.sfr_u_transfer, {
    getMaxUpgrades: () => 10,
    update: (tile, amount) => tile.data.transfer *= (1 + amount * .15)
});
SolarUpgrades.registerUpgrade(ItemID.sfr_u_traversal, {
    getMaxUpgrades: () => 1,
    update: (tile) => {
        tile.data.isTraversalEnabled = true;
        Traversal.update(tile);
    }
});

Callback.addCallback("PostLoaded", () => {
    addShaped(ItemID.sfr_blank, 1, 0, [" c ", "cmc", " c "], ['c', 4, 0, 'm', ItemID.sfr_mirror, 0]);
    addShaped(ItemID.sfr_u_blockcharging, 1, 0, ["prp", "rur", "prp"], ['p', 368, 0, 'r', 152, 0, 'u', ItemID.sfr_u_dispersive, 0]);
    addShaped(ItemID.sfr_u_capacity, 1, 0, [" r ", "rbr", "rdr"], ['r', 331, 0, 'b', ItemID.sfr_blank, 0, 'd', 57, 0]);
    addShaped(ItemID.sfr_u_dispersive, 1, 0, ["ded", "ebe", "ded"], ['d', 348, 0, 'e', 381, 0, 'b', ItemID.sfr_blank, 0]);
    addShaped(ItemID.sfr_u_efficiency, 1, 0, [" m ", "mbm", " p "], ['m', ItemID.sfr_mirror, 0, 'b', ItemID.sfr_blank, 0, 'p', ItemID.sfr_photo1, 0]);
    addShaped(ItemID.sfr_u_furnace, 1, 0, ["ccc", "cbc", "cfc"], ['c', 263, -1, 'b', ItemID.sfr_blank, 0, 'f', 61, 0]);
    addShaped(ItemID.sfr_mirror, 3, 0, ["ggg", " i "], ['g', 20, -1, 'i', 265, 0]);
    addShaped(ItemID.sfr_photo1, 1, 0, ["ggg", "lll", "mmm"], ['g', 20, -1, 'l', 834, 0, 'm', ItemID.sfr_mirror, 0]);
    addShaped(ItemID.sfr_photo2, 1, 0, ["clc", "lcl", "mpm"], ['c', 337, 0, 'l', 834, 0, 'm', ItemID.sfr_mirror, 0, 'p', ItemID.sfr_photo1, 0]);
    addShaped(ItemID.sfr_photo3, 1, 0, ["ggg", "ddd", "opo"], ['g', 20, -1, 'd', 348, 0, 'o', 49, 0, 'p', ItemID.sfr_photo2, 0]);
    addShaped(ItemID.sfr_photo4, 1, 0, ["bbb", "gdg", "qpq"], ['b', 377, 0, 'g', 348, 0, 'd', 264, 0, 'q', 155, 0, 'p', ItemID.sfr_photo3, 0]);
    addShaped(ItemID.sfr_photo5, 1, 0, ["bbb", "gdg", "qpq"], ['b', 369, 0, 'g', 89, 0, 'd', 57, 0, 'q', 155, 0, 'p', ItemID.sfr_photo4, 0]);
    addShaped(ItemID.sfr_photo6, 1, 0, ["eee", "gdg", "qpq"], ['e', 388, 0, 'g', 89, 0, 'd', 57, 0, 'q', 155, 0, 'p', ItemID.sfr_photo5, 0]);
    addShaped(BlockID.sfr_1, 1, 0, ["mmm", "prp", "ppp"], ['m', ItemID.sfr_mirror, 0, 'p', 5, -1, 'r', 331, 0]);
    addShaped(BlockID.sfr_2, 1, 0, ["sss", "sps", "sss"], ['s', BlockID.sfr_1, 0, 'p', 33, 0]);
    addShaped(BlockID.sfr_3, 2, 0, ["ppp", "srs", "sis"], ['p', ItemID.sfr_photo1, 0, 's', BlockID.sfr_2, 0, 'r', 356, 0, 'i', 42, 0]);
    addShaped(BlockID.sfr_4, 2, 0, ["ppp", "scs", "sis"], ['p', ItemID.sfr_photo2, 0, 's', BlockID.sfr_3, 0, 'c', 347, 0, 'i', 42, 0]);
    addShaped(BlockID.sfr_5, 2, 0, ["ppp", "sds", "sgs"], ['p', ItemID.sfr_photo3, 0, 's', BlockID.sfr_4, 0, 'd', 348, 0, 'g', 41, 0]);
    addShaped(BlockID.sfr_6, 2, 0, ["ppp", "sls", "sds"], ['p', ItemID.sfr_photo4, 0, 's', BlockID.sfr_5, 0, 'l', 123, 0, 'd', 57, 0]);
    addShaped(BlockID.sfr_7, 2, 0, ["ppp", "sbs", "sbs"], ['p', ItemID.sfr_photo5, 0, 's', BlockID.sfr_6, 0, 'b', 437, 0]);
    addShaped(BlockID.sfr_8, 2, 0, ["ppp", "ses", "ses"], ['p', ItemID.sfr_photo6, 0, 's', BlockID.sfr_7, 0, 'e', 122, 0]);
    addShaped(ItemID.sfr_u_transfer, 1, 0, ["rrr", "gbg", "rrr"], ['r', 331, 0, 'g', 266, 0, 'b', ItemID.sfr_blank, 0]);
    addShaped(ItemID.sfr_u_traversal, 1, 0, ["ipi", "rbr", "ipi"], ['i', 265, 0, 'p', 33, 0, 'r', 331, 0, 'b', ItemID.sfr_blank, 0]);
    addShaped(ItemID.sfr_u_traversal, 1, 0, ["ipi", "rbr", "ipi"], ['i', 265, 0, 'p', 29, 0, 'r', 331, 0, 'b', ItemID.sfr_blank, 0]);
});