class Ingredient {
    private static readonly INSTANCES: java.util.Set<Ingredient> = java.util.Collections.newSetFromMap(new java.util.WeakHashMap<Ingredient, boolean>());
    public static readonly EMPTY: Ingredient = new (class extends Ingredient {
        public apply(stack: Nullable<ItemInstance>): boolean {
            return stack.count <= 0 || stack.id <= 0;
        }
    })([]);
    public readonly matchingStacks: ItemInstance[];
    private readonly matchingStacksExploded: ItemInstance[];
    private matchingStacksPacked: java.util.List<number>;
    private readonly isSimple: boolean;
    protected constructor(size: number);
    protected constructor(stacks: ItemInstance[]);
    protected constructor(par: number | ItemInstance[]){
        if(typeof par === "number") return new Ingredient([]);
        else {
            let simple: boolean = true;
            this.matchingStacks = par;
            let lst: java.util.List<NonNullable<ItemInstance>> = new java.util.ArrayList();
            for(let i in par){
                let s: ItemInstance = par[i];
                if(s.count <= 0 || s.id <= 0) continue;
                if(Item.getMaxDamage(s.id) > 0) simple = false;
                lst.add(s);
            }
            this.matchingStacksExploded = lst.toArray() as ItemInstance[];
            this.isSimple = simple && this.matchingStacksExploded.length > 0;
            Ingredient.INSTANCES.add(this);
        }
    }
    public getMatchingStacks(): ItemInstance[] {
        return this.matchingStacksExploded;
    }
    public apply(stack: Nullable<ItemInstance>): boolean {
        if(stack == null) return false;
        else {
            for(let i in this.matchingStacks){
                let itemstack: ItemInstance = this.matchingStacks[i];
                if(itemstack.id == stack.id){
                    if(itemstack.data || itemstack.data == stack.data) return true;
                }
            }
            return false;
        }
    }
    public getValidItemStacksPacked(): java.util.List<number> {
        if(this.matchingStacksPacked == null){
            this.matchingStacksPacked = new java.util.ArrayList<number>(this.matchingStacksExploded.length);
            for(let i in this.matchingStacksExploded){
                let itemstack: ItemInstance = this.matchingStacksExploded[i];
                this.matchingStacksPacked.add(itemstack.id << 16 | itemstack.data & 65535);
            }
            this.matchingStacksPacked.sort(new (class extends java.util.Comparator<number> {
                public compare(a: number, b: number): number {
                    return ((a)<(b)?-1:((a)==(b)?0:1));
                }
            })());
        }
        return this.matchingStacksPacked;
    }
    public static invalidateAll(): void {
        for(let i in this.INSTANCES){
            let ing: Ingredient = this.INSTANCES[i];
            if(ing !== null) ing.invalidate();
        }
    }
    protected invalidate(): void {
        this.matchingStacksPacked = null;
    }
    public static fromItem(id: number): Ingredient {
        return this.fromStacks([{id: id, count: 1, data: 0}]);
    }
    public static fromItems(...items: number[]): Ingredient {
        let aitemstack: ItemInstance[] = [];
        for(let i=0; i<items.length; ++i){
            aitemstack[i] = {id: items[i], count: 1, data: 0};
        }
        return this.fromStacks(aitemstack);
    }
    public static fromStacks(stacks: ItemInstance[]): Ingredient {
        if(stacks.length > 0){
            for(let i in stacks){
                let itemstack: ItemInstance = stacks[i];
                if(!(itemstack.id <= 0 || itemstack.count <= 0)) return new Ingredient(stacks);
            }
        }
        return this.EMPTY;
    }
    public static merge(parts: java.util.Collection<Ingredient>): Ingredient {
        let lst: java.util.List<NonNullable<ItemInstance>> = new java.util.ArrayList();
        for(let i in parts){
            let part: Ingredient = parts[i];
            for(let j in part.matchingStacks){
                let stack: ItemInstance = part.matchingStacks[j];
                lst.add(stack);
            }
        }
        return new Ingredient(lst.toArray([]) as ItemInstance[]);
    }
    public getIsSimple(): boolean {
        return this.isSimple || this == Ingredient.EMPTY;
    }
}