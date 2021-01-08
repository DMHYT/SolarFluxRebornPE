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
var BlockPosFace = /** @class */ (function (_super) {
    __extends(BlockPosFace, _super);
    function BlockPosFace(pos, face, rate) {
        var _this = _super.call(this) || this;
        if (typeof rate === "number") {
            _this.pos = pos, _this.face = face, _this.rate = rate;
        }
        else
            return new BlockPosFace(pos, face, 1);
        return _this;
    }
    BlockPosFace.prototype.equals = function (obj) {
        if (obj instanceof BlockPosFace) {
            var bpf = obj;
            return java.util.Objects.equals(this.pos, bpf.pos) &&
                java.util.Objects.equals(this.face, bpf.face) && this.rate == bpf.rate;
        }
        ;
        return false;
    };
    return BlockPosFace;
}(java.lang.Object));
