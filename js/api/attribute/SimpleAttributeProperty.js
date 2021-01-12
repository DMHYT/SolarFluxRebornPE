var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SimpleAttributeProperty = /** @class */ (function (_super) {
    __extends(SimpleAttributeProperty, _super);
    function SimpleAttributeProperty() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dirty = true;
        _this.mods = (function () {
            var map = new java.util.HashMap();
            for (var _i = 0, _a = EnumAttributeLayer.values(); _i < _a.length; _i++) {
                var l = _a[_i];
                map.put(l, new java.util.ArrayList());
            }
            return map;
        })();
        _this.modsById = new java.util.HashMap();
        return _this;
    }
    SimpleAttributeProperty.prototype.getValue = function () {
        if (this.dirty)
            return this.recalculateValue();
        return this.value;
    };
    SimpleAttributeProperty.prototype.getBaseValue = function () {
        return this.base;
    };
    SimpleAttributeProperty.prototype.setBaseValue = function (value) {
        this.value = value, this.dirty = true;
    };
    SimpleAttributeProperty.prototype.setValue = function (value) {
        this.value = value, this.dirty = false;
    };
    SimpleAttributeProperty.prototype.getModifier = function (uuid) {
        return this.modsById.get(uuid);
    };
    SimpleAttributeProperty.prototype.removeModifier = function (uuid) {
        if (uuid instanceof java.util.UUID) {
            var mod = this.modsById.remove(uuid);
            this.removeModifier(mod);
            return mod;
        }
        else if (uuid instanceof IAttributeMod) {
            if (uuid != null) {
                this.mods.get(uuid.getLayer()).remove(uuid);
                var iter = this.modsById.entrySet().iterator();
                while (iter.hasNext()) {
                    var i$ = iter.next();
                    if (i$.getValue() == uuid) {
                        this.modsById.remove(i$.getKey());
                        break;
                    }
                }
                this.dirty = true;
            }
        }
    };
    SimpleAttributeProperty.prototype.applyModifier = function (mod, uuid) {
        if (mod != null) {
            var mod2 = this.modsById.get(uuid);
            if (mod2 != null)
                throw new java.lang.IllegalArgumentException("Duplicate attribute modifier with id '" + uuid + "'!");
            var mods = this.mods.get(mod.getLayer());
            if (mods.contains(mod))
                throw new java.lang.IllegalArgumentException("Attribute modifier '" + mod + "' is already present!");
            mods.add(mod);
            this.modsById.put(uuid, mod);
            this.dirty = true;
        }
    };
    SimpleAttributeProperty.prototype.recalculateValue = function () {
        this.value = this.getBaseValue();
        for (var _i = 0, _a = EnumAttributeLayer.values(); _i < _a.length; _i++) {
            var l = _a[_i];
            var iter = this.mods.get(l).iterator();
            while (iter.hasNext()) {
                var mod = iter.next();
                this.value = mod.operate(this.value);
            }
        }
        this.dirty = false;
        return this.value;
    };
    SimpleAttributeProperty.prototype.serializeNBT = function () {
        var nbt = new NBT.CompoundTag();
        nbt.putDouble("Base", this.getBaseValue());
        var attrs = new NBT.ListTag();
        var iter = this.modsById.values().iterator();
        var _loop_1 = function () {
            var mod = iter.next();
            var id = AttributeModRegistry.getId(mod);
            if (id == null) {
                Logger.Log("Found not registered attribute: " + mod + ". Don't know how to handle, skipping.", "SolarFluxRebornAPI INFO");
                return "continue";
            }
            var tag = new NBT.CompoundTag();
            var that = this_1;
            var uuid = (function () {
                var itera = that.modsById.keySet().iterator();
                while (itera.hasNext()) {
                    var u = itera.next();
                    if (that.modsById.get(u) == mod) {
                        return u;
                    }
                }
            })();
            tag.putInt64("UUIDMost", uuid.getMostSignificantBits());
            tag.putInt64("UUIDLeast", uuid.getLeastSignificantBits());
            tag.putDouble("Val", mod.getValue());
            tag.putString("Id", id);
            attrs.putCompoundTag(attrs.length(), tag);
        };
        var this_1 = this;
        while (iter.hasNext()) {
            _loop_1();
        }
        nbt.putListTag("Modifiers", attrs);
        return nbt;
    };
    SimpleAttributeProperty.prototype.deserializeNBT = function (nbt) {
        this.setBaseValue(nbt.getFloat("Base"));
        var attrs = nbt.getListTag("Modifiers");
        for (var i = 0; i < attrs.length(); ++i) {
            var tag = attrs.getCompoundTag(i);
            var mod = AttributeModRegistry.create(tag.getString("Id"), tag.getFloat("Val"));
            if (mod == null) {
                Logger.Log("Found not registered attribute with id '" + tag.getString("Id") + "'. Don't know how to handle, skipping.", "SolarFluxRebornAPI INFO");
                continue;
            }
            this.applyModifier(mod, new java.util.UUID(tag.getInt64("UUIDMost"), tag.getInt64("UUIDLeast")));
        }
    };
    SimpleAttributeProperty.prototype.clearAttributes = function () {
        for (var _i = 0, _a = EnumAttributeLayer.values(); _i < _a.length; _i++) {
            var l = _a[_i];
            this.mods.get(l).clear();
        }
        this.modsById.clear();
        this.value = this.getBaseValue();
        this.dirty = false;
    };
    return SimpleAttributeProperty;
}(IAttributeProperty));
