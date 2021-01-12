var IAttributeProperty = /** @class */ (function () {
    function IAttributeProperty() {
    }
    IAttributeProperty.prototype.getValueL = function () {
        return Math.round(this.getValue());
    };
    IAttributeProperty.prototype.getValueI = function () {
        return Math.min(this.getValueL(), java.lang.Integer.MAX_VALUE);
    };
    return IAttributeProperty;
}());
