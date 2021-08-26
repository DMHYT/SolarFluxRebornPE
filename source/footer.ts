createItem("blank_upgrade");
createItem("block_charging_upgrade");
IDRegistry.genItemID("sfr_block_charging_upgrade_bound");
Item.createItem("sfr_block_charging_upgrade_bound", "item.solarflux:block_charging_upgrade.name", {name: "block_charging_upgrade", meta: 0}, {stack: 1, isTech: true});
Item.setGlint(ItemID.sfr_block_charging_upgrade_bound, true);
Item.registerNameOverrideFunction(ItemID.sfr_block_charging_upgrade_bound, (item, name) => {
    if(item.extra == null) return "Block Charging Upgrade (BROKEN)";
    return `${name}\n§7X: ${item.extra.getInt("PosX")}, Y: ${item.extra.getInt("PosY")}, Z: ${item.extra.getInt("PosZ")}, Dimension: ${item.extra.getInt("Dim")}`;
});
createItem("capacity_upgrade");
createItem("dispersive_upgrade");
createItem("efficiency_upgrade");
createItem("furnace_upgrade");
createItem("mirror");
createItem("photovoltaic_cell_1");
createItem("photovoltaic_cell_2");
createItem("photovoltaic_cell_3");
createItem("photovoltaic_cell_4");
createItem("photovoltaic_cell_5");
createItem("photovoltaic_cell_6");
createPanel("1");
createPanel("2");
createPanel("3");
createPanel("4");
createPanel("5");
createPanel("6");
createPanel("7");
createPanel("8");
createItem("transfer_rate_upgrade");
createItem("traversal_upgrade");
Item.getItemById("sfr_block_charging_upgrade").setMaxStackSize(1);
Item.getItemById("sfr_capacity_upgrade").setMaxStackSize(10);
Item.getItemById("sfr_dispersive_upgrade").setMaxStackSize(1);
Item.getItemById("sfr_efficiency_upgrade").setMaxStackSize(20);
Item.getItemById("sfr_furnace_upgrade").setMaxStackSize(1);
Item.getItemById("sfr_transfer_rate_upgrade").setMaxStackSize(10);
Item.getItemById("sfr_traversal_upgrade").setMaxStackSize(1);
Item.addCreativeGroup("sfr", Translation.translate("itemGroup.solarflux"), SFR_STUFF);

Item.registerUseFunction(ItemID.sfr_block_charging_upgrade, (coords, item, block, player) => {
    if(Entity.getSneaking(player)) {
        let region = BlockSource.getDefaultForActor(player),
            tile = TileEntity.getTileEntity(coords.x, coords.y, coords.z, region);
        if(tile != null && tile.isEnergyTile) {
            const etile = tile as EnergyTile;
            if(etile.canReceiveEnergy(coords.side, "RF")) {
                const extra = new ItemExtraData();
                extra.putInt("Dim", region.getDimension());
                extra.putInt("PosX", coords.x);
                extra.putInt("PosY", coords.y);
                extra.putInt("PosZ", coords.z);
                extra.putInt("Face", coords.side);
                Entity.setCarriedItem(player, ItemID.sfr_block_charging_upgrade_bound, 1, 0, extra);
                Sounds.levelup(coords.x, coords.y, coords.z, region.getDimension());
            }
        }
    }
});
Item.registerUseFunction(ItemID.sfr_block_charging_upgrade_bound, (coords, item, block, player) => Entity.getSneaking(player) && !~SFR_STUFF.indexOf(block.id) && Entity.setCarriedItem(player, ItemID.sfr_block_charging_upgrade, 1, 0, null));

const block_charging_upgrade_validator = (tile: TileEntity, stack: ItemInstance) => {
    if(stack.extra.getInt("Dim") !== tile.blockSource.getDimension()) return false;
    const tilePos = BlockPosUtils.fromTile(tile);
    const otherTilePos = { x: stack.extra.getInt("PosX"), y: stack.extra.getInt("PosY"), z: stack.extra.getInt("PosZ") } as BlockPos;
    if(BlockPosUtils.distanceSq(tilePos, otherTilePos) <= 256) {
        let otherTile = TileEntity.getTileEntity(otherTilePos.x, otherTilePos.y, otherTilePos.z, tile.blockSource);
        if(otherTile.isEnergyTile)
            return (otherTile as EnergyTile).canReceiveEnergy(stack.extra.getInt("Face"), "RF");
    }
}
SolarUpgrades.registerUpgrade(ItemID.sfr_block_charging_upgrade_bound, {
    getMaxUpgrades: () => 1,
    canInstall: block_charging_upgrade_validator,
    canStayInPanel: block_charging_upgrade_validator,
    update: (tile, amount, extra) => {
        if(World.getThreadTime() % 20 == 0){
            const pos: BlockPos = { x: extra.getInt("PosX"), y: extra.getInt("PosY"), z: extra.getInt("PosZ"), dimension: extra.getInt("Dim") };
            let d: number = BlockPosUtils.distanceSq(BlockPosUtils.fromTile(tile), pos);
            if(d <= 256) {
                d /= 256;
                tile.data.traversal = [];
                if(tile.getUpgrades(ItemID.sfr_u_traversal) > 0) {
                    tile.data.traversalObj.cache = [];
                    tile.data.traversalObj.cache.push(pos);
                    tile.data.traversalObj.findMachines(tile, tile.data.traversal);
                }
                tile.data.traversal.push(BlockPosUtils.BlockPosFaceFromBlockPos(pos, extra.getInt("Face"), 1 - d));
            }
        }
    }
});
SolarUpgrades.registerUpgrade(ItemID.sfr_capacity_upgrade, {
    getMaxUpgrades: () => 10,
    update: (tile, amount) => tile.data.capacity *= (1 + amount * .1),
});
SolarUpgrades.registerUpgrade(ItemID.sfr_dispersive_upgrade, {
    getMaxUpgrades: () => 1,
    update: (tile) => {
        const chargePlayer = (player: number, fe: number) => {
            const isValid = (id: number) => ChargeItemRegistry.isValidItem(id, "RF", 1);
            const actor = new PlayerActor(player);
            for(let i=0; i<36; i++) {
                const slot = actor.getInventorySlot(i);
                if(isValid(slot.id))
                    return fe - ChargeItemRegistry.addEnergyTo(slot, "RF", Math.min(fe, ChargeItemRegistry.getMaxCharge(slot.id) - ChargeItemRegistry.getEnergyStored(slot)), 1);
            }
            for(let i=0; i<4; i++){
                const slot = actor.getArmor(i);
                if(isValid(slot.id))
                    return fe - ChargeItemRegistry.addEnergyTo(slot, "RF", Math.min(fe, ChargeItemRegistry.getMaxCharge(slot.id) - ChargeItemRegistry.getEnergyStored(slot)), 1);
            }
            return fe;
        }
        const fetch = tile.blockSource.fetchEntitiesInAABB(tile.x - 16, tile.y - 16, tile.z - 16, tile.x + 16, tile.y + 16, tile.z + 16, EEntityType.PLAYER, false);
        for(let p in fetch){
            const player = fetch[p];
            const mod: number = Math.max(0, 1 - BlockPosUtils.distanceSq(BlockPosUtils.fromEntity(player), BlockPosUtils.fromTile(tile)) / 256);
            const transfer: number = Math.round(tile.initialTransfer * mod);
            const sent: number = Math.min(Math.round(tile.data.energy * mod), transfer);
            tile.data.energy -= sent - chargePlayer(player, sent);
        }
    }
});
SolarUpgrades.registerUpgrade(ItemID.sfr_efficiency_upgrade, {
    getMaxUpgrades: () => 20,
    update: (tile, amount) => tile.data.generation *= (1 + amount * .05)
});
SolarUpgrades.registerUpgrade(ItemID.sfr_furnace_upgrade, {
    getMaxUpgrades: () => 1,
    update: (panel) => {
        const furnace = panel.blockSource.getBlockEntity(panel.x, panel.y - 1, panel.z);
        if(
            furnace !== null && furnace.getType() == ETileEntityType.FURNACE &&
            furnace.getSlot(0).id != 0 && furnace.getSlot(1).count == 0 &&
            furnace.getCompoundTag().getShort("BurnTime") == 0 &&
            panel.data.energy >= 1000
        ) {
            furnace.setSlot(1, 5, 1, 0);
            panel.data.energy -= 1000;
        }
    }
});
SolarUpgrades.registerUpgrade(ItemID.sfr_transfer_rate_upgrade, {
    getMaxUpgrades: () => 10,
    update: (tile, amount) => tile.data.transfer *= (1 + amount * .15)
});
SolarUpgrades.registerUpgrade(ItemID.sfr_traversal_upgrade, {
    getMaxUpgrades: () => 1,
    update: (tile) => {
        tile.data.isTraversalEnabled = true;
        tile.data.traversalObj.update(tile);
    }
});

Callback.addCallback("PostLoaded", () => {
    addShaped(ItemID.sfr_blank_upgrade, 1, 0, [" c ", "cmc", " c "], ['c', 4, 0, 'm', ItemID.sfr_mirror, 0]);
    addShaped(ItemID.sfr_block_charging_upgrade, 1, 0, ["prp", "rur", "prp"], ['p', 368, 0, 'r', 152, 0, 'u', ItemID.sfr_dispersive_upgrade, 0]);
    addShaped(ItemID.sfr_capacity_upgrade, 1, 0, [" r ", "rbr", "rdr"], ['r', 331, 0, 'b', ItemID.sfr_blank_upgrade, 0, 'd', 57, 0]);
    addShaped(ItemID.sfr_dispersive_upgrade, 1, 0, ["ded", "ebe", "ded"], ['d', 348, 0, 'e', 381, 0, 'b', ItemID.sfr_blank_upgrade, 0]);
    addShaped(ItemID.sfr_efficiency_upgrade, 1, 0, [" m ", "mbm", " p "], ['m', ItemID.sfr_mirror, 0, 'b', ItemID.sfr_blank_upgrade, 0, 'p', ItemID.sfr_photovoltaic_cell_1, 0]);
    addShaped(ItemID.sfr_furnace_upgrade, 1, 0, ["ccc", "cbc", "cfc"], ['c', 263, -1, 'b', ItemID.sfr_blank_upgrade, 0, 'f', 61, 0]);
    addShaped(ItemID.sfr_mirror, 3, 0, ["ggg", " i "], ['g', 20, -1, 'i', 265, 0]);
    addShaped(ItemID.sfr_photovoltaic_cell_1, 1, 0, ["ggg", "lll", "mmm"], ['g', 20, -1, 'l', 834, 0, 'm', ItemID.sfr_mirror, 0]);
    addShaped(ItemID.sfr_photovoltaic_cell_2, 1, 0, ["clc", "lcl", "mpm"], ['c', 337, 0, 'l', 834, 0, 'm', ItemID.sfr_mirror, 0, 'p', ItemID.sfr_photovoltaic_cell_1, 0]);
    addShaped(ItemID.sfr_photovoltaic_cell_3, 1, 0, ["ggg", "ddd", "opo"], ['g', 20, -1, 'd', 348, 0, 'o', 49, 0, 'p', ItemID.sfr_photovoltaic_cell_2, 0]);
    addShaped(ItemID.sfr_photovoltaic_cell_4, 1, 0, ["bbb", "gdg", "qpq"], ['b', 377, 0, 'g', 348, 0, 'd', 264, 0, 'q', 155, 0, 'p', ItemID.sfr_photovoltaic_cell_3, 0]);
    addShaped(ItemID.sfr_photovoltaic_cell_5, 1, 0, ["bbb", "gdg", "qpq"], ['b', 369, 0, 'g', 89, 0, 'd', 57, 0, 'q', 155, 0, 'p', ItemID.sfr_photovoltaic_cell_4, 0]);
    addShaped(ItemID.sfr_photovoltaic_cell_6, 1, 0, ["eee", "gdg", "qpq"], ['e', 388, 0, 'g', 89, 0, 'd', 57, 0, 'q', 155, 0, 'p', ItemID.sfr_photovoltaic_cell_5, 0]);
    addShaped(BlockID.sfr_1, 1, 0, ["mmm", "prp", "ppp"], ['m', ItemID.sfr_mirror, 0, 'p', 5, -1, 'r', 331, 0]);
    addShaped(BlockID.sfr_2, 1, 0, ["sss", "sps", "sss"], ['s', BlockID.sfr_1, 0, 'p', 33, 0]);
    addShaped(BlockID.sfr_3, 2, 0, ["ppp", "srs", "sis"], ['p', ItemID.sfr_photovoltaic_cell_1, 0, 's', BlockID.sfr_2, 0, 'r', 356, 0, 'i', 42, 0]);
    addShaped(BlockID.sfr_4, 2, 0, ["ppp", "scs", "sis"], ['p', ItemID.sfr_photovoltaic_cell_2, 0, 's', BlockID.sfr_3, 0, 'c', 347, 0, 'i', 42, 0]);
    addShaped(BlockID.sfr_5, 2, 0, ["ppp", "sds", "sgs"], ['p', ItemID.sfr_photovoltaic_cell_3, 0, 's', BlockID.sfr_4, 0, 'd', 348, 0, 'g', 41, 0]);
    addShaped(BlockID.sfr_6, 2, 0, ["ppp", "sls", "sds"], ['p', ItemID.sfr_photovoltaic_cell_4, 0, 's', BlockID.sfr_5, 0, 'l', 123, 0, 'd', 57, 0]);
    addShaped(BlockID.sfr_7, 2, 0, ["ppp", "sbs", "sbs"], ['p', ItemID.sfr_photovoltaic_cell_5, 0, 's', BlockID.sfr_6, 0, 'b', 437, 0]);
    addShaped(BlockID.sfr_8, 2, 0, ["ppp", "ses", "ses"], ['p', ItemID.sfr_photovoltaic_cell_6, 0, 's', BlockID.sfr_7, 0, 'e', 122, 0]);
    addShaped(ItemID.sfr_transfer_rate_upgrade, 1, 0, ["rrr", "gbg", "rrr"], ['r', 331, 0, 'g', 266, 0, 'b', ItemID.sfr_blank_upgrade, 0]);
    addShaped(ItemID.sfr_traversal_upgrade, 1, 0, ["ipi", "rbr", "ipi"], ['i', 265, 0, 'p', 33, 0, 'r', 331, 0, 'b', ItemID.sfr_blank_upgrade, 0]);
    addShaped(ItemID.sfr_traversal_upgrade, 1, 0, ["ipi", "rbr", "ipi"], ['i', 265, 0, 'p', 29, 0, 'r', 331, 0, 'b', ItemID.sfr_blank_upgrade, 0]);
});