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
var TileBaseSolar = /** @class */ (function (_super) {
    __extends(TileBaseSolar, _super);
    function TileBaseSolar(instance) {
        var _this = _super.call(this) || this;
        _this.renderConnectedTextures = true;
        _this.crafters = new java.util.ArrayList();
        _this.generation = new SimpleAttributeProperty();
        _this.transfer = new SimpleAttributeProperty();
        _this.capacity = new SimpleAttributeProperty();
        // public readonly upgradeInventory: InventoryDummy = new InventoryDummy(5);
        // public readonly chargeInventory: InventoryDummy = new InventoryDummy(1);
        _this.traversal = new java.util.ArrayList();
        _this.tickedUpgrades = new java.util.ArrayList();
        if (typeof instance !== "undefined")
            _this.instance = instance;
        return _this;
    }
    //public getUpgrades
    TileBaseSolar.prototype.isSameLevel = function (other) {
        if (other == null)
            return false;
        if (other.instance == null || this.instance == null)
            return false;
        return other.instance.delegate === this.instance.delegate;
    };
    TileBaseSolar.prototype.doesSeeSky = function () {
        if (this.seeSkyTimer < 1) {
            this.seeSkyTimer = 20;
            this.seeSky = this.blockSource.getLightLevel(this.x, this.y, this.z) > 0 ? this.blockSource.canSeeSky(this.x, this.y, this.z) : false;
        }
        return this.seeSky;
    };
    TileBaseSolar.prototype.tickUpgrades = function () {
        var stack;
        var id;
        this.generation.clearAttributes();
        this.transfer.clearAttributes();
        this.capacity.clearAttributes();
        //upgrade slots checking
    };
    TileBaseSolar.prototype.tick = function () {
        if (this.seeSkyTimer > 0)
            --this.seeSkyTimer;
        var panelClass = BlockBaseSolar.getPanelClass(this.blockSource.getBlockId(this.x, this.y, this.z));
        if (panelClass !== null) {
            var si = panelClass.solarInfo;
            this.renderConnectedTextures = null; //TODO
        }
    };
    return TileBaseSolar;
}(TEClass));
