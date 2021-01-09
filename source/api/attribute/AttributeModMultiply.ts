class AttributeModMultiply extends IAttributeMod {
    protected value: number;
    constructor(val: number){super(); this.value = val;};
    public operate(given: number): number {
        return given * this.value;
    }
    public getLayer(): EnumAttributeLayer {
        return EnumAttributeLayer.THREE;
    }
    public getValue(): number {return this.value;};
}