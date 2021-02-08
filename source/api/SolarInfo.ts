class SolarInfo extends java.lang.Object {
    public recipes: java.util.List<any> = new java.util.ArrayList();
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
        super();
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
    public readonly delegate: RegistryDelegate<SolarInfo> = new RegistryDelegate<SolarInfo>(this, this.getClass());
    private registryName: string = null;
    public setRegistryName(name: string): SolarInfo;
    public setRegistryName(modID: string, name: string): SolarInfo;
    public setRegistryName(modID: string, name?: string): SolarInfo {
        if(typeof name !== "undefined"){
            return this.setRegistryName(`${modID}:${name}`);
        } else {

        }
    }
    public getRegistryName(): string {
        if(this.delegate.getName() != null) return this.delegate.getName();
        return this.registryName != null ? this.registryName : null;
    }
    public getRegistryType(): java.lang.Class<SolarInfo> {
        return SolarInfo.class as java.lang.Class<SolarInfo>;
    }
    public static builder(): SolarInfo.Builder {
        return new SolarInfo.Builder();
    }
    public static customBuilder(): SolarInfo.Builder {
        let b: SolarInfo.Builder = new SolarInfo.Builder();
        b.custom = true;
        return b;
    }
    public langBuilder(): SolarInfo.LanguageData {
        return new SolarInfo.LanguageData(this);
    }
    public recipeBuilder(): SolarInfo.RecipeBuilder {
        return new SolarInfo.RecipeBuilder(this);
    }
    public hasConnectedTextures(): boolean {
        return this.getConfigInstance().connectTextures;
    }
}

namespace SolarInfo {
    export class Builder {
        name: string;
        generation: number;
        capacity: number;
        transfer: number;
        height: number = 6/16;
        custom: boolean = false;
        public setName(s: string): Builder {
            this.name = s;
            return this;
        }
        public setHeight(f: number): Builder {
            this.height = f;
            return this;
        }
        public setGeneration(n: number): Builder;
        public setGeneration(s: string): Builder;
        public setGeneration(yyy: number | string): Builder {
            if(typeof yyy === "number"){
                this.generation = yyy;
                return this;
            } else {
                this.generation = new java.lang.Long(yyy as string).longValue();
                return this;
            }
        }
        public setCapacity(n: number): Builder;
        public setCapacity(s: string): Builder;
        public setCapacity(yyy: number | string): Builder {
            if(typeof yyy === "number"){
                this.capacity = yyy;
                return this;
            } else {
                this.capacity = new java.lang.Long(yyy as string).longValue();
                return this;
            }
        }
        public setTransfer(n: number): Builder;
        public setTransfer(s: string): Builder;
        public setTransfer(yyy: number | string): Builder {
            if(typeof yyy === "number"){
                this.transfer = yyy;
                return this;
            } else {
                this.transfer = new java.lang.Long(yyy as string).longValue();
                return this;
            }
        }
        public build(): SolarInfo {
            if(this.name == null) throw new java.lang.NullPointerException("name == null");
            if(this.generation == null) throw new java.lang.NullPointerException("generation == null");
            if(this.capacity == null) throw new java.lang.NullPointerException("capacity == null");
            if(this.transfer == null) throw new java.lang.NullPointerException("transfer == null");
            let info: SolarInfo = new SolarInfo(this.generation, this.transfer, this.capacity);
            info.isCustom = this.custom;
            info.setRegistryName(this.name);
            info.baseHeight = this.height;
            return info;
        }
        public buildAndRegister(): SolarInfo {
            let info: SolarInfo = this.build();
            SolarsSF.modSolars.add(info);
            return info;
        }
    }
    export class LanguageData {
        public readonly langToName: java.util.Map<string, string> = new java.util.HashMap();
        public def: string;
        readonly panel: SolarInfo;
        constructor(panel: SolarInfo){
            this.panel = panel;
        }
        public put(lang: string, loc: string): LanguageData {
            lang = lang.toLowerCase();
            if(lang == "en_us") this.def = loc;
            this.langToName.put(lang, loc);
            return this;
        }
        public getName(lang: string): string {
            return this.langToName.getOrDefault(lang, this.def);
        }
        public build(): SolarInfo {
            if(this.def == null) throw new java.lang.RuntimeException("Unable to apply languages: no \'en_use\' value found!");
            this.panel.localizations = this.langToName;
            return this.panel;
        }
    }
    export class RecipeBuilder {
        readonly panel: SolarInfo;
        args: java.util.List<any> = new java.util.ArrayList();
        constructor(panel: SolarInfo){
            this.panel = panel;
        }
        public shape(...strings: string[]): RecipeBuilder {
            this.args.addAll(java.util.Arrays.asList(strings));
            return this;
        }
        public bind(ch: string, output: any): RecipeBuilder {
            if(ch.length != 1) throw new java.lang.IllegalArgumentException(`${ch} is not a single character!`);
            this.args.add(ch.charAt(0));
            this.args.add(output);
            return this;
        }
        public build(): SolarInfo;
        public build(amount: number): SolarInfo;
        public build(amount?: number): SolarInfo {
            if(typeof amount !== "undefined"){
                let that = this;
                this.panel.recipes.add(() => {
                    let objs: native.Array<any> = that.args.toArray([]);
                    for(let i=0; i<objs.length; ++i){
                        let j: any = objs[i];
                        if(typeof j === "function") objs[i] = j();
                    }
                    return null;//TODO
                });
                return this.panel;
            } else return this.build(1);
        }
    }
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