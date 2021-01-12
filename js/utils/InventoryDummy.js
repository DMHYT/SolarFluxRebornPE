var InventoryDummy = /** @class */ (function () {
    function InventoryDummy(par1, par2) {
        this.inventory = new java.util.List();
        this.inventoryStackLimit = 64;
        this.allSlots = [];
        if (typeof par1 === "number" && par2 instanceof NBT.CompoundTag) {
            for (var i = 0; i < this.inventory.size(); ++i)
                this.allSlots[i] = i;
        }
        else if (par1 instanceof NBT.CompoundTag && Array.isArray(par2)) {
            for (var i = 0; i < par2.length; ++i)
                this.inventory.set(i, par2[i]);
            for (var i = 0; i < par2.length; ++i)
                this.allSlots[i] = i;
        }
        else if (typeof par2 === "undefined") {
            if (typeof par1 === "number") {
                for (var i = 0; i < par1; ++i)
                    this.allSlots[i] = i;
            }
            else if (Array.isArray(par1)) {
                for (var i = 0; i < par1.length; ++i)
                    this.inventory.set(i, par1[i]);
                for (var i = 0; i < par1.length; ++i)
                    this.allSlots[i] = i;
            }
        }
    }
    InventoryDummy.prototype.getAllAvailableSlots = function () {
        return this.allSlots;
    };
    InventoryDummy.prototype.getName = function () {
        return "Dummy Inventory";
    };
    InventoryDummy.prototype.hasCustomName = function () {
        return false;
    };
    InventoryDummy.prototype.getSizeInventory = function () {
        return this.inventory.size();
    };
    InventoryDummy.prototype.getStackInSlot = function (index) {
        try {
            return this.inventory.get(index);
        }
        catch (e) { }
        ;
        return { id: 0, count: 0, data: 0, extra: null };
    };
    InventoryDummy.prototype.decrStackSize = function (slot, count) {
        try {
            if (this.inventory.get(slot).id == 0) {
                var is = void 0;
                if (this.inventory.get(slot).count <= count) {
                    is = this.inventory.get(slot);
                    this.inventory.set(slot, { id: 0, count: 0, data: 0, extra: null });
                    return is;
                }
                else {
                    is = this.inventory.get(slot);
                    this.inventory.get(slot).count -= count;
                    if (this.inventory.get(slot).count == 0)
                        this.inventory.set(slot, { id: 0, count: 0, data: 0, extra: null });
                    return is;
                }
            }
        }
        catch (e) { }
        ;
        return { id: 0, count: 0, data: 0, extra: null };
    };
    InventoryDummy.prototype.setInventorySlotContents = function (index, stack) {
        try {
            this.inventory.set(index, stack);
            if (this.inventory.get(index).count > Math.min(Item.getMaxStack(this.inventory.get(index).id), this.getInventoryStackLimit()))
                this.inventory.get(index).count = Math.min(Item.getMaxStack(this.inventory.get(index).id), this.getInventoryStackLimit());
        }
        catch (e) { }
        ;
    };
    InventoryDummy.prototype.getInventoryStackLimit = function () { return this.inventoryStackLimit; };
    ;
    InventoryDummy.prototype.markDirty = function () {
        if (this.markedDirty != null)
            this.markedDirty.run();
    };
    InventoryDummy.prototype.clear = function () {
        this.inventory.clear();
    };
    InventoryDummy.prototype.iterator = function () {
        return this.inventory.iterator();
    };
    InventoryDummy.prototype.stream = function () {
        return this.inventory.stream();
    };
    return InventoryDummy;
}());
