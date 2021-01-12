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
var AttributeModAdd = /** @class */ (function (_super) {
    __extends(AttributeModAdd, _super);
    function AttributeModAdd(val) {
        var _this = _super.call(this) || this;
        _this.value = val;
        return _this;
    }
    ;
    AttributeModAdd.prototype.operate = function (given) {
        return given + this.value;
    };
    AttributeModAdd.prototype.getValue = function () { return this.value; };
    ;
    return AttributeModAdd;
}(IAttributeMod));
