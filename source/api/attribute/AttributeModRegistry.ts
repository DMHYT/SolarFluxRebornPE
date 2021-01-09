namespace AttributeModRegistry {
    const registry: java.util.Map<string, Function> = new java.util.HashMap();
    const typeRegistry: java.util.Map<string, java.lang.Class<IAttributeMod>> = new java.util.HashMap();
    export function register<T extends IAttributeMod>(id: string, type: java.lang.Class<T>, generator: Function): void {
        id = id.toLowerCase();
        if(registry.containsKey(id)) throw new java.lang.IllegalArgumentException(`Duplicate entry for \'${id}\'!`);
        registry.put(id, generator);
        typeRegistry.put(id, type);
    }
    export function getId(mod: IAttributeMod): string {
        if(mod == null) return null;
        let inversedTypeRegistry: java.util.Map<java.lang.Class<IAttributeMod>, string>;
        let iter: java.util.Iterator<java.util.Map.Entry<string, java.lang.Class<IAttributeMod>>> = typeRegistry.entrySet().iterator();
        while(iter.hasNext()){
            let entry = iter.next();
            inversedTypeRegistry.put(entry.getValue(), entry.getKey());
        }
        return inversedTypeRegistry.get(mod.getClass());
    }
    export function create(id: string, value: number): IAttributeMod {
        id = id.toLowerCase();
        return registry.containsKey(id) ? registry.get(id).apply(this, value) : null;
    }
}