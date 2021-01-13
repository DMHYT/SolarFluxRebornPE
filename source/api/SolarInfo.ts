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
    public getHeight(): number {
        return this.getConfigInstance().height;
    }
    public getGeneration(): number {
        return this.getConfigInstance().generation;
    }
    public getTransfer(): number {
        return this.getConfigInstance().transfer;
    }
    public getCapacity(): number {
        return this.getConfigInstance().capacity;
    }
    public configureBase(cat: any): void {
        this.configInstance = new SolarInfo.SolarConfigInstance(cat, this);
    }
    public resetConfigInstance(): void {
        this.configInstance = new SolarInfo.SolarConfigInstance(this);
    }
    public getConfigInstance(): SolarInfo.SolarConfigInstance {
        if(this.configInstance == null) this.resetConfigInstance();
        return this.configInstance;
    }
    public computeSunIntensity(solar: TileBaseSolar): number {
        if(!solar.doesSeeSky()) return 0;
        let celestialAngleRadians: number = SunUtils.getCelestialAngleRadians(1);
        if(celestialAngleRadians > Math.PI) celestialAngleRadians = 2 * Math.PI - celestialAngleRadians;
        let lowLightCount: number = 0;
        let multiplicator: number = 1.5 - (lowLightCount * .122);
        let displacement: number = 1.2 + (lowLightCount * .08);
        return MinecraftUtils.MathHelper.clamp(multiplicator * Math.cos(celestialAngleRadians / displacement), 0, 1);
    };


    
}

namespace SolarInfo {

    export class SolarConfigInstance {
        public readonly generation: number;
        public readonly capacity: number;
        public readonly transfer: number;
        public readonly height: number;
        public readonly connectTextures: boolean;
        constructor(cat: string, base: SolarInfo);
        constructor(base: SolarInfo);
        constructor(generation: number, capacity: number, transfer: number, height: number, connectTextures: boolean);
        constructor(generation: string | SolarInfo | number, capacity?: SolarInfo | number, transfer?: number, height?: number, connectTextures?: boolean){
            if(typeof generation === "string"){
                
            } else if(typeof generation === "object" && generation instanceof SolarInfo){

            }
        }
        public serialize(): NBT.CompoundTag {
            let nbt: NBT.CompoundTag = new NBT.CompoundTag();
            nbt.putInt64("MG", this.generation);
            nbt.putInt64("MC", this.capacity);
            nbt.putInt64("MT", this.transfer);
            nbt.putFloat("SH", this.height);
            nbt.putByte("CT", Number(this.connectTextures));
            return nbt;
        }
    }
}