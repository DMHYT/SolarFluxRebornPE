class TileBaseSolar extends TEClass {
    public energy: number;
    public currentGeneration: number;
    public sunIntensity: number;
    public instance: SolarInstance;
    public renderConnectedTextures: boolean = true;
    public crafters: java.util.List<number> = new java.util.ArrayList();
    public readonly generation: SimpleAttributeProperty = new SimpleAttributeProperty();
    public readonly transfer: SimpleAttributeProperty = new SimpleAttributeProperty();
    public readonly capacity: SimpleAttributeProperty = new SimpleAttributeProperty();
    // public readonly upgradeInventory: InventoryDummy = new InventoryDummy(5);
    // public readonly chargeInventory: InventoryDummy = new InventoryDummy(1);
    public readonly traversal: java.util.List<BlockPosFace> = new java.util.ArrayList();
    constructor(instance: SolarInstance);
    constructor();
    constructor(instance?: SolarInstance){
        super();
        if(typeof instance !== "undefined") this.instance = instance;
    }
    //public getUpgrades
    public isSameLevel(other: TileBaseSolar): boolean {
        if(other == null) return false;
        if(other.instance == null || this.instance == null) return false;
        return other.instance.delegate === this.instance.delegate;
    }
    public seeSky: boolean;
    public seeSkyTimer: number;
    public doesSeeSky(): boolean {
        if(this.seeSkyTimer < 1){
            this.seeSkyTimer = 20;
            this.seeSky = this.blockSource.getLightLevel(this.x, this.y, this.z) > 0 ? this.blockSource.canSeeSky(this.x, this.y, this.z) : false;
        }
        return this.seeSky;
    }
    public tickedUpgrades: java.util.List<string> = new java.util.ArrayList();
    public tickUpgrades(): void {
        let stack: ItemInstance;
        let id: string;
        this.generation.clearAttributes();
        this.transfer.clearAttributes();
        this.capacity.clearAttributes();
        //upgrade slots checking
    }
    public tick(): void {
        if(this.seeSkyTimer > 0) --this.seeSkyTimer;
        let panelClass: BlockBaseSolar = BlockBaseSolar.getPanelClass(this.blockSource.getBlockId(this.x, this.y, this.z));
        if(panelClass !== null){
            let si: SolarInfo = panelClass.solarInfo;
            this.renderConnectedTextures = null;//TODO
        }
    }
}