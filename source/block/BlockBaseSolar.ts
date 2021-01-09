class BlockBaseSolar {
    public readonly solarInfo: SolarInfo;
    constructor(solarInfo: SolarInfo){
        this.solarInfo = solarInfo;
        IDRegistry.genBlockID("")
    }
    
    public getPanelData(): SolarInfo {return this.solarInfo;}
}