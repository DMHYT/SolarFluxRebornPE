const createPanelTileFor = (id: string) => {
    const stats: PanelStats = getStatsFor(id);
    TileEntity.registerPrototype(BlockID[id], {});
}