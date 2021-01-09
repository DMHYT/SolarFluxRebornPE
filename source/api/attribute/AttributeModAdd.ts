class AttributeModAdd extends IAttributeMod {
    protected value: number;
    constructor(val: number){super(); this.value = val;};
    public operate(given: number): number {
        return given + this.value;
    }
    public getValue(): number {return this.value;};
}