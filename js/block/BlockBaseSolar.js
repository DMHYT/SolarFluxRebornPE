var BlockBaseSolar = /** @class */ (function () {
    function BlockBaseSolar(solarInfo) {
        this.solarInfo = solarInfo;
        IDRegistry.genBlockID("");
        BlockBaseSolar.registeredBlocks.put(BlockID.id /**@todo */, this);
    }
    BlockBaseSolar.prototype.getPanelData = function () { return this.solarInfo; };
    BlockBaseSolar.getPanelClass = function (id) {
        return this.registeredBlocks.get(id);
    };
    BlockBaseSolar.registeredBlocks = new java.util.HashMap();
    return BlockBaseSolar;
}());
