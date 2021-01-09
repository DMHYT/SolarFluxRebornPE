class InventoryDummy {
    public inventory: java.util.List<NonNullable<ItemInstance>> = new java.util.List();
    private readonly allSlots: number[];
    public inventoryStackLimit: number = 64;
    public validSlots: any;
    public markedDirty: java.lang.Runnable;
    public openInv: any;
    public closeInv: any;
    public fields: IVariableHandler;
    constructor(inventorySize: number, boundNBT: NBT.CompoundTag);
    constructor(boundNBT: NBT.CompoundTag, items: ItemInstance[]);
    constructor(inventorySize: number);
    constructor(items: ItemInstance[]);
    constructor(par1: number | NBT.CompoundTag | ItemInstance[], par2?: NBT.CompoundTag | ItemInstance[]){
        this.allSlots = [];
        if(typeof par1 === "number" && par2 instanceof NBT.CompoundTag){
            for(let i=0; i<this.inventory.size(); ++i) this.allSlots[i] = i;
        } else if(par1 instanceof NBT.CompoundTag && Array.isArray(par2)){
            for(let i=0; i<par2.length; ++i) this.inventory.set(i, par2[i]);
            for(let i=0; i<par2.length; ++i) this.allSlots[i] = i;
        } else if(typeof par2 === "undefined"){
            if(typeof par1 === "number"){
                for(let i=0; i<par1; ++i) this.allSlots[i] = i;
            } else if(Array.isArray(par1)){
                for(let i=0; i<par1.length; ++i) this.inventory.set(i, par1[i]);
                for(let i=0; i<par1.length; ++i) this.allSlots[i] = i;
            }
        }
    }
    public getAllAvailableSlots(): number[] {
        return this.allSlots;
    }
    public getName(): string {
        return "Dummy Inventory";
    }
    public hasCustomName(): boolean {
        return false;
    }
    public getSizeInventory(): number {
        return this.inventory.size();
    }
    public getStackInSlot(index: number): ItemInstance {
        try {
            return this.inventory.get(index);
        } catch(e) {};
        return {id: 0, count: 0, data: 0, extra: null};
    }
    public decrStackSize(slot: number, count: number): ItemInstance {
        try {
            if(this.inventory.get(slot).id == 0){
                let is: ItemInstance;
                if(this.inventory.get(slot).count <= count){
                    is = this.inventory.get(slot);
                    this.inventory.set(slot, {id: 0, count: 0, data: 0, extra: null});
                    return is;
                } else {
                    is = this.inventory.get(slot);
                    this.inventory.get(slot).count -= count;
                    if(this.inventory.get(slot).count == 0) this.inventory.set(slot, {id: 0, count: 0, data: 0, extra: null});
                    return is;
                }
            }
        } catch(e) {};
        return {id: 0, count: 0, data: 0, extra: null};
    }
    public setInventorySlotContents(index: number, stack: ItemInstance): void {
        try {
            this.inventory.set(index, stack);
            if(this.inventory.get(index).count > Math.min(Item.getMaxStack(this.inventory.get(index).id), this.getInventoryStackLimit()))
            this.inventory.get(index).count = Math.min(Item.getMaxStack(this.inventory.get(index).id), this.getInventoryStackLimit());
        } catch(e) {};
    }
    public getInventoryStackLimit(): number {return this.inventoryStackLimit;};
    public markDirty(): void {
        if(this.markedDirty != null) this.markedDirty.run();
    }
    public clear(): void {
        this.inventory.clear();
    }
    public iterator(): java.util.Iterator<ItemInstance> {
        return this.inventory.iterator();
    }
    public stream(): java.util.stream.Stream<ItemInstance> {
        return this.inventory.stream();
    }
}