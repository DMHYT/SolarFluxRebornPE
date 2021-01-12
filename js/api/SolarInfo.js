var SolarInfo = /** @class */ (function () {
    function SolarInfo(mgen, mtranf, mcap, height) {
        this.recipes = new java.util.ArrayList();
        this.baseHeight = 6 / 16;
        this.baseConnectTextures = true;
        this.isCustom = false;
        this.localizations = null;
        this.baseGeneration = mgen,
            this.baseTransfer = mtranf,
            this.baseCapacity = mcap;
        if (typeof height === "number")
            this.baseHeight = height;
    }
    SolarInfo.prototype.noConnectTexture = function () {
        this.baseConnectTextures = false;
        return this;
    };
    SolarInfo.prototype.createBlock = function () {
        return new BlockBaseSolar(this);
    };
    SolarInfo.prototype.getBlock = function () {
        if (this.block == null)
            this.block = this.createBlock();
        return this.block;
    };
    SolarInfo.prototype.accept = function (t) {
        var data;
    };
    SolarInfo.prototype.setCompatMod = function (compatMod) {
        this.compatMod = compatMod;
        return this;
    };
    SolarInfo.prototype.getCompatMod = function () { return this.compatMod; };
    ;
    SolarInfo.prototype.computeSunIntensity = function (solar) { return; };
    ; //TODO
    return SolarInfo;
}());
(function (SolarInfo) {
    var SolarConfigInstance = /** @class */ (function () {
        function SolarConfigInstance() {
        }
        return SolarConfigInstance;
    }());
    SolarInfo.SolarConfigInstance = SolarConfigInstance;
})(SolarInfo || (SolarInfo = {}));
