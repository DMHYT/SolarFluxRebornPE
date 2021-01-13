class SolarInstance {
    public infoDelegate: SolarInfo;
    public delegate: string;
    public gen: number;
    public cap: number;
    public transfer: number;
    public valid: boolean = false;
    public getDelegate(): SolarInfo {
        if(this.infoDelegate == null) return this.infoDelegate//todo;
        return this.infoDelegate;
    }
    public computeSunIntensity(solar: TileBaseSolar): number {
        if(this.getDelegate() != null) return this.infoDelegate.computeSunIntensity(solar);
        if(!solar.blockSource.canSeeSky(solar.x, solar.y + 1, solar.z)) return 0;
        let celestialAngleRadians: number = SunUtils.getCelestialAngleRadians(1);
        if(celestialAngleRadians > Math.PI) celestialAngleRadians = 2 * Math.PI - celestialAngleRadians;
        let lowLightCount: number = 0;
        let multiplicator: number = 1.5 - (lowLightCount * .122);
        let displacement: number = 1.2 + (lowLightCount * .08);
        return MinecraftUtils.MathHelper.clamp(multiplicator * Math.cos(celestialAngleRadians / displacement), 0, 1);
    }
    public isValid(): boolean {return this.valid};
    public reset(): void {
        let info: SolarInfo = this.getDelegate();
        this.valid = info != null;
        if(this.valid) info.accept(this);
    }
    public serializeNBT(): NBT.CompoundTag {
        let nbt: NBT.CompoundTag = new NBT.CompoundTag();
        nbt.putString("Delegate", this.delegate);
        return nbt;
    }
    public static deserialize(nbt: NBT.CompoundTag): SolarInstance {
        let inst: SolarInstance = new SolarInstance();
        inst.deserializeNBT(nbt);
        return inst;
    }
    public deserializeNBT(nbt: NBT.CompoundTag): void {
        this.delegate = nbt.getString("Delegate");
        this.reset();
    }
}