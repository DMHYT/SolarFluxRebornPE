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
var FECharge = /** @class */ (function (_super) {
    __extends(FECharge, _super);
    function FECharge(fe) {
        var _this = _super.call(this) || this;
        _this.FE = Math.max(fe, 0);
        return _this;
    }
    FECharge.prototype.discharge = function (fe) {
        return new FECharge(this.FE - fe);
    };
    FECharge.prototype.containsCharge = function () {
        return this.FE > 0;
    };
    FECharge.prototype.copy = function () {
        return new FECharge(this.FE);
    };
    return FECharge;
}(AbstractCharge));
