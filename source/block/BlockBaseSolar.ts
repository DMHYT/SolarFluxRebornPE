class BlockBaseSolar {
    private static readonly registeredBlocks: java.util.Map<number, BlockBaseSolar> = new java.util.HashMap();
    public readonly solarInfo: SolarInfo;
    constructor(solarInfo: SolarInfo){
        this.solarInfo = solarInfo;
        IDRegistry.genBlockID("")

        BlockBaseSolar.registeredBlocks.put(BlockID.id/**@todo */, this);
    }
    
    public getPanelData(): SolarInfo {return this.solarInfo;}





    public static getPanelClass(id: number): BlockBaseSolar {
        return this.registeredBlocks.get(id);
    }
}