var SolarInstance = /** @class */ (function () {
    function SolarInstance() {
        this.valid = false;
    }
    SolarInstance.prototype.getDelegate = function () {
        if (this.infoDelegate == null)
            return this.infoDelegate; //todo;
        return this.infoDelegate;
    };
    SolarInstance.prototype.computeSunIntensity = function (solar) {
        if (this.getDelegate() != null)
            return this.infoDelegate.computeSunIntensity(solar);
        if (!solar.blockSource.canSeeSky(solar.x, solar.y + 1, solar.z))
            return 0;
        var celestialAngleRadians;
        (function () {
            var calculateCelestialAngle = function (worldTime, partialTicks) {
                var i = worldTime % 24000;
                var f = (i + partialTicks) / 24000 - 0.25;
                if (f < 0)
                    ++f;
                if (f > 1)
                    --f;
                var f1 = 1 - (Math.cos(f * Math.PI) + 1) / 2;
                f = f + (f1 - f) / 3;
                return f;
            };
            var getCelestialAngle = function (partialTicks) {
                return calculateCelestialAngle(World.getWorldTime(), partialTicks);
            };
            var getCelestialAngleRadians = function (partialTicks) { return getCelestialAngle(partialTicks) * (Math.PI * 2); };
            celestialAngleRadians = getCelestialAngleRadians(1);
        })();
        if (celestialAngleRadians > Math.PI)
            celestialAngleRadians = 2 * Math.PI - celestialAngleRadians;
        var lowLightCount = 0;
        var multiplicator = 1.5 - (lowLightCount * .122);
        var displacement = 1.2 + (lowLightCount * .08);
        return MinecraftUtils.MathHelper.clamp(multiplicator * Math.cos(celestialAngleRadians / displacement), 0, 1);
    };
    SolarInstance.prototype.isValid = function () { return this.valid; };
    ;
    SolarInstance.prototype.reset = function () {
        var info = this.getDelegate();
        this.valid = info != null;
        if (this.valid)
            info.accept(this);
    };
    SolarInstance.prototype.serializeNBT = function () {
        var nbt = new NBT.CompoundTag();
        nbt.putString("Delegate", this.delegate);
        return nbt;
    };
    SolarInstance.deserialize = function (nbt) {
        var inst = new SolarInstance();
        inst.deserializeNBT(nbt);
        return inst;
    };
    SolarInstance.prototype.deserializeNBT = function (nbt) {
        this.delegate = nbt.getString("Delegate");
        this.reset();
    };
    return SolarInstance;
}());
