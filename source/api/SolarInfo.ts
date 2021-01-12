class SolarInfo {
    public recipes: java.util.List<JavaUtilFunction.Supplier<any>> = new java.util.ArrayList();
    public compatMod: string;
    public baseGeneration: number;
    public baseTransfer: number;
    public baseCapacity: number;
    public baseHeight: number = 6 / 16;
    public baseConnectTextures: boolean = true;
    public isCustom: boolean = false;
    public localizations: java.util.Map<string, string> = null;
    public configInstance: SolarInfo.SolarConfigInstance;
    constructor(mgen: number, mtranf: number, mcap: number);
    constructor(mgen: number, mtranf: number, mcap: number, height: number);
    constructor(mgen: number, mtranf: number, mcap: number, height?: number){
        this.baseGeneration = mgen,
        this.baseTransfer = mtranf,
        this.baseCapacity = mcap;
        if(typeof height === "number") this.baseHeight = height;
    }
    public noConnectTexture(): SolarInfo {
        this.baseConnectTextures = false;
        return this;
    }
    private block: BlockBaseSolar;
    protected createBlock(): BlockBaseSolar {
        return new BlockBaseSolar(this);
    }
    public getBlock(): BlockBaseSolar {
        if(this.block == null) this.block = this.createBlock();
        return this.block;
    }
    public accept(t: SolarInstance): void {
        let data: SolarInfo.SolarConfigInstance;
        
    }
    public setCompatMod(compatMod: string): SolarInfo {
        this.compatMod = compatMod;
        return this;
    }
    public getCompatMod(): string {return this.compatMod;};
    
    public computeSunIntensity(solar: TileBaseSolar): number {return}; //TODO


    
}

namespace SolarInfo {
    export class SolarConfigInstance {

    }
}