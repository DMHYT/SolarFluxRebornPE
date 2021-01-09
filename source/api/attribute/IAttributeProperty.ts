abstract class IAttributeProperty {
    abstract serializeNBT(): NBT.CompoundTag;
    abstract deserializeNBT(nbt: NBT.CompoundTag): void;
    abstract getValue(): number;
    getValueL(): number {
        return Math.round(this.getValue());
    }
    getValueI(): number {
        return Math.min(this.getValueL(), java.lang.Integer.MAX_VALUE);
    }
    abstract getBaseValue(): number;
    abstract setBaseValue(value: number): void;
    abstract getModifier(uuid: java.util.UUID): IAttributeMod;
    abstract removeModifier(uuid: java.util.UUID): IAttributeMod;
    abstract recalculateValue(): number;
    abstract clearAttributes(): void;
}