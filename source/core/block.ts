const createPanel = (name: string) => {
    IDRegistry.genBlockID(name);
    Block.createBlock(name, [{name: name, texture: [[`${name}_base`, 0], [`${name}_top`, 0], [`${name}_base`, 0]], inCreative: true}], {base: 1, destroytime: 5, solid: true, sound: "stone", translucency: 1});
    ToolAPI.registerBlockMaterial(BlockID[name], "stone", 1, false);
    ICRender.getGroup("ic-wire").add(BlockID[name], -1);
    ICRender.getGroup("rf-wire").add(BlockID[name], -1);
    Block.setShape(BlockID[name], 0, 0, 0, 1, 6/16, 1);
    const shape = new ICRender.CollisionShape();
    shape.addEntry().addBox(0, 0, 0, 1, 6/16, 1);
    BlockRenderer.setCustomCollisionShape(BlockID[name], -1, shape);
    BlockRenderer.setCustomRaycastShape(BlockID[name], -1, shape);
    const render = new ICRender.Model();
    const model = new BlockRenderer.Model();
    model.addBox(0, 0, 0, 1, 6/16, 1, [[`${name}_base`, 0], [`${name}_top`, 0], [`${name}_base`, 0]]);
    model.addBox(0, 6/16, 0, 1, 6.4/16, 1/16, `${name}_base`, 0);
    model.addBox(0, 6/16, 15/16, 1, 6.4/16, 1, `${name}_base`, 0);
    model.addBox(0, 6/16, 1/16, 1/16, 6.4/16, 15/16, `${name}_base`, 0);
    model.addBox(15/16, 6/16, 1/16, 1, 6.4/16, 15/16, `${name}_base`, 0);
    render.addEntry(model);
    ItemModel.getFor(BlockID[name], -1).setModel(render);
    // SFRModel.setPanelRender(BlockID[name], `${name}_base`, `${name}_top`);
    SFRTile.createPanelTileFor(name);
    Block.registerDropFunction(BlockID[name], (coords, blockID, blockData, level, enchant, item, region) => {
        let tile: SFRTile.PanelTile = TileEntity.getTileEntity(coords.x, coords.y, coords.z, region) as SFRTile.PanelTile;
        let extra = new ItemExtraData();
        extra.putLong("SFREnergy", tile.data.energy);
        tile.data.isDestroyed = true;
        TileEntity.destroyTileEntity(tile);
        return [[blockID, 1, blockData, extra]];
    }, 1);
    Block.registerPlaceFunction(BlockID[name], (coords, item, block, player, region) => {
        let r = coords.relative;
        region.setBlock(r.x, r.y, r.z, BlockID[name], 0);
        TileEntity.addTileEntity(r.x, r.y, r.z, region);
        if(item.extra != null && item.extra.getLong("SFREnergy", -1) != -1){
            let panel = TileEntity.getTileEntity(r.x, r.y, r.z) as SFRTile.PanelTile;
            panel.data.energy = Math.min(panel.data.energy + item.extra.getInt("SFREnergy", panel.data.capacity));
        }
    });
    Block.registerNeighbourChangeFunction(BlockID[name], (coords, block, changed, region) => {
        if(region.getBlockId(changed.x, changed.y, changed.z) == BlockID[name]){
            (TileEntity.getTileEntity(coords.x, coords.y, coords.z) as SFRTile.PanelTile).updateConnectionCubes();
        }
    });
    SFR_STUFF.push(BlockID[name]);
}