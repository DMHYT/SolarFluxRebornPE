const createPanelFromStats = (name: string, height: number, generation: number, capacity: number, transfer: number) => {
    IDRegistry.genBlockID(`sfr_${name}`);
    Block.createBlock(`sfr_${name}`, [{name: `tile.solarflux:solar_panel_${name}.name`, texture: [[`sfr_${name}_base`, 0], [`sfr_${name}_top`, 0], [`sfr_${name}_base`, 0]], inCreative: true}], {base: 1, destroytime: 5, solid: true, sound: "stone", translucency: 1});
    ToolAPI.registerBlockMaterial(BlockID[`sfr_${name}`], "stone", 1, false);
    ICRender.getGroup("ic-wire").add(BlockID[`sfr_${name}`], -1);
    ICRender.getGroup("rf-wire").add(BlockID[`sfr_${name}`], -1);
    const render = new ICRender.Model(BlockRenderer.createTexturedBox(0, 0, 0, 1, height, 1, [[`sfr_${name}_base`, 0], [`sfr_${name}_top`, 0], [`sfr_${name}_base`, 0]]));
    BlockRenderer.setStaticICRender(BlockID[`sfr_${name}`], -1, render);
    const shape = new ICRender.CollisionShape();
    shape.addEntry().addBox(0, 0, 0, 1, height, 1);
    BlockRenderer.setCustomCollisionAndRaycastShape(BlockID[`sfr_${name}`], -1, shape);
    const item_render = new ICRender.Model();
    const item_model = new BlockRenderer.Model();
    item_model.addBox(0, 0, 0, 1, height, 1, [[`sfr_${name}_base`, 0], [`sfr_${name}_top`, 0], [`sfr_${name}_base`, 0]]);
    item_model.addBox(0, height, 0, 1, (height + .4) / 16, 1/16, `sfr_${name}_base`, 0);
    item_model.addBox(0, height, 15/16, 1, (height + .4) / 16, 1, `sfr_${name}_base`, 0);
    item_model.addBox(0, height, 1/16, 1/16, (height + .4) / 16, 15/16, `sfr_${name}_base`, 0);
    item_model.addBox(15/16, height, 1/16, 1, (height + .4) / 16, 15/16, `sfr_${name}_base`, 0);
    item_render.addEntry(item_model);
    BlockRenderer.enableCoordMapping(BlockID[`sfr_${name}`], -1, item_render);
    ItemModel.getFor(BlockID[`sfr_${name}`], -1).setModel(item_render);
    SFRTile.createPanelTileFor(`sfr_${name}`, height, generation, capacity, transfer);
    Block.registerDropFunction(BlockID[`sfr_${name}`], (coords, blockID, blockData, level, enchant, item, region) => {
        const toStore = SFRTile.TEMPORARY_TILES[`${coords.x}:${coords.y}:${coords.z}:${region.getDimension()}`];
        const extra = new ItemExtraData();
        if(toStore) {
            extra.putLong("SFREnergy", toStore ?? 0);
            delete SFRTile.TEMPORARY_TILES[`${coords.x}:${coords.y}:${coords.z}:${region.getDimension()}`];
        } else Logger.Log("Energy to be saved into itemstack from broken panel was not found!", "SolarFluxReborn DEBUG");
        return [[blockID, 1, blockData, toStore ? extra : null]];
    }, 1);
    Block.registerPlaceFunction(BlockID[`sfr_${name}`], (coords, item, block, player, region) => {
        const r = coords.relative;
        region.setBlock(r.x, r.y, r.z, BlockID[`sfr_${name}`], 0);
        TileEntity.addTileEntity(r.x, r.y, r.z, region);
        if(item.extra != null && item.extra.getLong("SFREnergy", -1) != -1){
            const panel = TileEntity.getTileEntity(r.x, r.y, r.z) as SFRTile.PanelTile;
            panel.data.energy = Math.min(panel.data.energy + item.extra.getInt("SFREnergy", panel.data.capacity));
        }
    });
    Block.registerNeighbourChangeFunction(BlockID[`sfr_${name}`], (coords, block, changed, region) => {
        changed.y == coords.y &&
        region.getBlockId(changed.x, changed.y, changed.z) == BlockID[`sfr_${name}`] &&
        (TileEntity.getTileEntity(coords.x, coords.y, coords.z) as SFRTile.PanelTile).updateConnectionCubes();
    });
    Item.registerNameOverrideFunction(BlockID[`sfr_${name}`], (item, name) => {
        if(item.extra !== null && item.extra.getLong("SFREnergy", -1) != -1)
            name += `\n${EColor.GRAY}${java.lang.String.format("info.solarflux.energy.stored2", [java.lang.Long.valueOf(item.extra.getLong("SFREnergy")), java.lang.Long.valueOf(getStatsFor(`sfr_${name}`).capacity)])}`
        return name;
    });
    SFR_STUFF.push(BlockID[`sfr_${name}`]);
}

const createStandardPanel = (name: string) => {
    const stats = getStatsFor(`sfr_${name}`);
    createPanelFromStats(name, DIFFERENT_PANEL_HEIGHT ? parseInt(name) / 16 : 6/16, stats.generation, stats.capacity, stats.transfer);
}