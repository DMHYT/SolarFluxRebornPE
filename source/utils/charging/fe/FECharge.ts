class FECharge extends AbstractCharge {
    public FE: number;
    constructor(fe: number){
        super();
        this.FE = Math.max(fe, 0);
    }
    public discharge(fe: number): FECharge {
        return new FECharge(this.FE - fe);
    }
    public containsCharge(): boolean {
        return this.FE > 0;
    }
    public copy(): AbstractCharge {
        return new FECharge(this.FE);
    }
}