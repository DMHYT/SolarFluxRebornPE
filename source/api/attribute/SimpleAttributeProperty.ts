class SimpleAttributeProperty extends IAttributeProperty {
    protected value: number;
    protected base: number;
    protected dirty: boolean = true;
    protected readonly mods: java.util.Map<EnumAttributeLayer, java.util.List<IAttributeMod>> = (function(){
        let map: java.util.Map<EnumAttributeLayer, java.util.List<IAttributeMod>> = new java.util.HashMap();
        for(let l of EnumAttributeLayer.values()) map.put(l, new java.util.ArrayList());
        return map;
    })();
    protected readonly modsById: java.util.Map<java.util.UUID, IAttributeMod> = new java.util.HashMap();
    public getValue(): number {
        if(this.dirty) return this.recalculateValue();
        return this.value;
    }
    public getBaseValue(): number {
        return this.base;
    }
    public setBaseValue(value: number): void {
        this.value = value, this.dirty = true;
    }
    public setValue(value: number): void {
        this.value = value, this.dirty = false;
    }
    public getModifier(uuid: java.util.UUID): IAttributeMod {
        return this.modsById.get(uuid);
    }
    public removeModifier(uuid: java.util.UUID): IAttributeMod;
    public removeModifier(mod: IAttributeMod): IAttributeMod;
    public removeModifier(uuid: java.util.UUID | IAttributeMod): IAttributeMod {
        if(uuid instanceof java.util.UUID){
            let mod: IAttributeMod = this.modsById.remove(uuid);
            this.removeModifier(mod);
            return mod;
        } else if(uuid instanceof IAttributeMod){
            if(uuid != null){
                this.mods.get(uuid.getLayer()).remove(uuid);
                let iter: java.util.Iterator<java.util.Map.Entry<java.util.UUID, IAttributeMod>> = this.modsById.entrySet().iterator();
                while(iter.hasNext()){
                    let i$: java.util.Map.Entry<java.util.UUID, IAttributeMod> = iter.next();
                    if(i$.getValue() == uuid){
                        this.modsById.remove(i$.getKey());
                        break;
                    }
                }
                this.dirty = true;
            }
        }
    }
    public applyModifier(mod: IAttributeMod, uuid: java.util.UUID): void {
        if(mod != null){
            let mod2: IAttributeMod = this.modsById.get(uuid);
            if(mod2 != null) throw new java.lang.IllegalArgumentException(`Duplicate attribute modifier with id \'${uuid}\'!`);
            let mods: java.util.List<IAttributeMod> = this.mods.get(mod.getLayer());
            if(mods.contains(mod)) throw new java.lang.IllegalArgumentException(`Attribute modifier \'${mod}\' is already present!`);
            mods.add(mod);
            this.modsById.put(uuid, mod);
            this.dirty = true;
        }
    }
    public recalculateValue(): number {
        this.value = this.getBaseValue();
        for(let l of EnumAttributeLayer.values()){
            let iter: java.util.Iterator<IAttributeMod> = this.mods.get(l).iterator();
            while(iter.hasNext()){
                let mod: IAttributeMod = iter.next();
                this.value = mod.operate(this.value);
            }
        }
        this.dirty = false;
        return this.value;
    }
    public serializeNBT(): NBT.CompoundTag {
        let nbt: NBT.CompoundTag = new NBT.CompoundTag();
        nbt.putDouble("Base", this.getBaseValue());
        let attrs: NBT.ListTag = new NBT.ListTag();
        let iter: java.util.Iterator<IAttributeMod> = this.modsById.values().iterator();
        while(iter.hasNext()){
            let mod: IAttributeMod = iter.next();
            let id: string = AttributeModRegistry.getId(mod);
            if(id == null){
                Logger.Log(`Found not registered attribute: ${mod}. Don\'t know how to handle, skipping.`, "SolarFluxRebornAPI INFO");
                continue;
            }
            let tag: NBT.CompoundTag = new NBT.CompoundTag();
            let that = this;
            let uuid: java.util.UUID = (function(){
                let itera: java.util.Iterator<java.util.UUID> = that.modsById.keySet().iterator();
                while(itera.hasNext()){
                    let u: java.util.UUID = itera.next();
                    if(that.modsById.get(u) == mod){
                        return u;
                    }
                }
            })();
            tag.putInt64("UUIDMost", uuid.getMostSignificantBits());
            tag.putInt64("UUIDLeast", uuid.getLeastSignificantBits());
            tag.putDouble("Val", mod.getValue());
            tag.putString("Id", id);
            attrs.putCompoundTag(attrs.length(), tag);
        }
        nbt.putListTag("Modifiers", attrs);
        return nbt;
    }
    public deserializeNBT(nbt: NBT.CompoundTag): void {
        this.setBaseValue(nbt.getFloat("Base"));
        let attrs: NBT.ListTag = nbt.getListTag("Modifiers");
        for(let i=0; i<attrs.length(); ++i){
            let tag: NBT.CompoundTag = attrs.getCompoundTag(i);
            let mod: IAttributeMod = AttributeModRegistry.create(tag.getString("Id"), tag.getFloat("Val"));
            if(mod == null){
                Logger.Log(`Found not registered attribute with id \'${tag.getString("Id")}\'. Don\'t know how to handle, skipping.`, "SolarFluxRebornAPI INFO");
                continue;
            }
            this.applyModifier(mod, new java.util.UUID(tag.getInt64("UUIDMost"), tag.getInt64("UUIDLeast")));
        }
    }
    public clearAttributes(): void {
        for(let l of EnumAttributeLayer.values()) this.mods.get(l).clear();
        this.modsById.clear();
        this.value = this.getBaseValue();
        this.dirty = false;
    }
}