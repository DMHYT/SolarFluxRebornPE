/**
 * Just a remake of TileEntity interface into a class
 * for more convenient work with other TE classes
 */
var TEClass = /** @class */ (function () {
    function TEClass() {
        this.pos = new MinecraftUtils.BlockPos(this.x, this.y, this.z);
    }
    TEClass.prototype.getPos = function () { return this.pos; };
    ;
    ;
    return TEClass;
}());
