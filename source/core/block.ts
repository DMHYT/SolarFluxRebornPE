const createPanel = (name: string) => {
    IDRegistry.genBlockID(name);
    Block.createBlock(name, [{name: name, texture: [[`${name}_base`, 0]], inCreative: true}], {base: 1, destroytime: 5, solid: true, sound: "stone", translucency: 1});
    ToolAPI.registerBlockMaterial(BlockID[name], "stone", 1, false);
    ICRender.getGroup("ic-wire").add(BlockID[name], -1);
    ICRender.getGroup("rf-wire").add(BlockID[name], -1);
    SFRModel.setPanelRender(BlockID[name], `${name}_base`, `${name}_top`);
    SFRTile.createPanelTileFor(name);
    EnergyTileRegistry.addEnergyTypeForId(BlockID[name], FE);
    EnergyTileRegistry.addEnergyTypeForId(BlockID[name], EU);
    EnergyTileRegistry.addEnergyTypeForId(BlockID[name], RF);
    SFR_STUFF.push(BlockID[name]);
}