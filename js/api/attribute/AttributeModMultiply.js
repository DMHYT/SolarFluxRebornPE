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
var AttributeModMultiply = /** @class */ (function (_super) {
    __extends(AttributeModMultiply, _super);
    function AttributeModMultiply(val) {
        var _this = _super.call(this) || this;
        _this.value = val;
        return _this;
    }
    ;
    AttributeModMultiply.prototype.operate = function (given) {
        return given * this.value;
    };
    AttributeModMultiply.prototype.getLayer = function () {
        return EnumAttributeLayer.THREE;
    };
    AttributeModMultiply.prototype.getValue = function () { return this.value; };
    ;
    return AttributeModMultiply;
}(IAttributeMod));
