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
LIBRARY({
    name: "MinecraftUtils",
    version: 1,
    shared: false,
    api: 'CoreEngine'
});
var MinecraftUtils;
(function (MinecraftUtils) {
    var RayTraceResultType;
    (function (RayTraceResultType) {
        RayTraceResultType[RayTraceResultType["MISS"] = 0] = "MISS";
        RayTraceResultType[RayTraceResultType["BLOCK"] = 1] = "BLOCK";
        RayTraceResultType[RayTraceResultType["ENTITY"] = 2] = "ENTITY";
    })(RayTraceResultType || (RayTraceResultType = {}));
    ;
    var RayTraceResult = /** @class */ (function (_super) {
        __extends(RayTraceResult, _super);
        function RayTraceResult(par1, par2, par3, par4) {
            var _this = _super.call(this) || this;
            if (typeof par1 === "number" && par2 instanceof Vec3d) {
                _this.typeOfHit = RayTraceResult.Type.ENTITY;
                _this.entityHit = par1;
                _this.hitVec = par2;
            }
            else if (par2 instanceof Vec3d && par3 instanceof EnumFacing && par4 instanceof BlockPos) {
                _this.typeOfHit = par1;
                _this.blockPos = par4;
                _this.sideHit = par3;
                _this.hitVec = new Vec3d(par2.xCoord, par2.yCoord, par2.zCoord);
            }
            else if (typeof par1 === "number" && !(par2 instanceof Vec3d)) {
                var pos = Entity.getPosition(par1);
                return new RayTraceResult(par1, new Vec3d(pos.x, pos.y, pos.z));
            }
            else if (par1 instanceof Vec3d && par2 instanceof EnumFacing) {
                if (par3 instanceof BlockPos) {
                    return new RayTraceResult(RayTraceResult.Type.BLOCK, par1, par2, par3);
                }
                else
                    return new RayTraceResult(RayTraceResult.Type.BLOCK, par1, par2, BlockPos.ORIGIN);
            }
            return _this;
        }
        RayTraceResult.prototype.getBlockPos = function () {
            return this.blockPos;
        };
        RayTraceResult.prototype.toString = function () {
            return "HitResult{type=" + this.typeOfHit + ", blockpos=" + this.blockPos + ", f=" + this.sideHit + ", pos=" + this.hitVec + ", entity=" + this.entityHit + "}";
        };
        RayTraceResult.Type = RayTraceResultType;
        return RayTraceResult;
    }(java.lang.Object));
    MinecraftUtils.RayTraceResult = RayTraceResult;
    var AxisAlignedBB = /** @class */ (function (_super) {
        __extends(AxisAlignedBB, _super);
        function AxisAlignedBB(x1, y1, z1, x2, y2, z2) {
            var _this = _super.call(this) || this;
            if (typeof x1 === "number" && typeof y1 === "number" && typeof z1 === "number" &&
                typeof x2 === "number" && typeof y2 === "number" && typeof z2 === "number") {
                _this.minX = Math.min(x1, x2), _this.minY = Math.min(y1, y2), _this.minZ = Math.min(z1, z2),
                    _this.maxX = Math.max(x1, x2), _this.maxY = Math.max(y1, y2), _this.maxZ = Math.max(z1, z2);
            }
            else if (typeof x1 === "object" && typeof y1 === "object") {
                if (x1 instanceof BlockPos && y1 instanceof BlockPos) {
                    return new AxisAlignedBB(x1.getX(), x1.getY(), x1.getZ(), y1.getX(), y1.getY(), y1.getZ());
                }
                else if (x1 instanceof Vec3d && y1 instanceof Vec3d) {
                    return new AxisAlignedBB(x1.xCoord, x1.yCoord, x1.zCoord, y1.xCoord, y1.yCoord, y1.zCoord);
                }
            }
            else if (typeof x1 === "object" && typeof y1 !== "object" && x1 instanceof BlockPos) {
                return new AxisAlignedBB(x1.getX(), x1.getY(), x1.getZ(), x1.getX() + 1, x1.getY() + 1, x1.getZ() + 1);
            }
            return _this;
        }
        AxisAlignedBB.prototype.setMaxY = function (y2) {
            return new AxisAlignedBB(this.minX, this.minY, this.minZ, this.maxX, y2, this.maxZ);
        };
        AxisAlignedBB.prototype.equals = function (obj) {
            if (this == obj)
                return true;
            else if (!(obj instanceof AxisAlignedBB))
                return false;
            else {
                var axisalignedbb = obj;
                return java.lang.Double.compare(axisalignedbb.minX, this.minX) != 0 ? false :
                    (java.lang.Double.compare(axisalignedbb.minY, this.minY) != 0 ? false :
                        (java.lang.Double.compare(axisalignedbb.minZ, this.minZ) != 0 ? false :
                            (java.lang.Double.compare(axisalignedbb.maxX, this.maxX) != 0 ? false :
                                (java.lang.Double.compare(axisalignedbb.maxY, this.maxY) != 0 ? false :
                                    (java.lang.Double.compare(axisalignedbb.maxZ, this.maxZ) == 0)))));
            }
        };
        AxisAlignedBB.prototype.hashCode = function () {
            var i = java.lang.Double.doubleToLongBits(this.minX);
            var j = Math.floor(i ^ i >>> 32);
            i = java.lang.Double.doubleToLongBits(this.minY);
            j = 31 * j + Math.floor(i ^ i >>> 32);
            i = java.lang.Double.doubleToLongBits(this.minZ);
            j = 31 * j + Math.floor(i ^ i >>> 32);
            i = java.lang.Double.doubleToLongBits(this.maxX);
            j = 31 * j + Math.floor(i ^ i >>> 32);
            i = java.lang.Double.doubleToLongBits(this.maxY);
            j = 31 * j + Math.floor(i ^ i >>> 32);
            i = java.lang.Double.doubleToLongBits(this.maxZ);
            j = 31 * j + (i ^ i >>> 32);
            return j;
        };
        AxisAlignedBB.prototype.addCoord = function (x, y, z) {
            var d0 = this.minX, d1 = this.minY, d2 = this.minZ, d3 = this.maxX, d4 = this.maxY, d5 = this.maxZ;
            if (x < 0)
                d0 += x;
            else if (x > 0)
                d3 += x;
            if (y < 0)
                d1 += y;
            else if (y > 0)
                d4 += y;
            if (z < 0)
                d2 += z;
            else if (z > 0)
                d5 += z;
            return new AxisAlignedBB(d0, d1, d2, d3, d4, d5);
        };
        AxisAlignedBB.prototype.expand = function (x, y, z) {
            return new AxisAlignedBB(this.minX - x, this.minY - y, this.minZ - z, this.maxX + x, this.maxY + y, this.maxZ + z);
        };
        AxisAlignedBB.prototype.expandXyz = function (value) {
            return this.expand(value, value, value);
        };
        AxisAlignedBB.prototype.union = function (other) {
            return new AxisAlignedBB(Math.min(this.minX, other.minX), Math.min(this.minY, other.minY), Math.min(this.minZ, other.minZ), Math.max(this.maxX, other.maxX), Math.max(this.maxY, other.maxY), Math.max(this.maxZ, other.maxZ));
        };
        AxisAlignedBB.prototype.offset = function (x, y, z) {
            if (typeof x === "number") {
                return new AxisAlignedBB(this.minX + x, this.minY + y, this.minZ + z, this.maxX + x, this.maxY + y, this.maxZ + z);
            }
            else if (typeof x === "object" && x instanceof BlockPos) {
                return new AxisAlignedBB(this.minX + x.getX(), this.minY + x.getY(), this.minZ + x.getZ(), this.maxX + x.getX(), this.maxY + x.getY(), this.maxZ + x.getZ());
            }
        };
        AxisAlignedBB.prototype.calculateXOffset = function (other, offsetX) {
            if (other.maxY > this.minY && other.minY < this.maxY && other.maxZ > this.minZ && other.minZ < this.maxZ) {
                if (offsetX > 0 && other.maxX <= this.minX) {
                    var d1 = this.minX - other.maxX;
                    if (d1 < offsetX)
                        offsetX = d1;
                }
                else if (offsetX < 0 && other.minX >= this.maxX) {
                    var d0 = this.maxX - other.minX;
                    if (d0 > offsetX)
                        offsetX = d0;
                }
                return offsetX;
            }
            else
                return offsetX;
        };
        AxisAlignedBB.prototype.calculateYOffset = function (other, offsetY) {
            if (other.maxX > this.minX && other.minX < this.maxX && other.maxZ > this.minZ && other.minZ < this.maxZ) {
                if (offsetY > 0 && other.maxY <= this.minY) {
                    var d1 = this.minY - other.maxY;
                    if (d1 < offsetY)
                        offsetY = d1;
                }
                else if (offsetY < 0 && other.minY >= this.maxY) {
                    var d0 = this.maxY - other.minY;
                    if (d0 > offsetY)
                        offsetY = d0;
                }
                return offsetY;
            }
            else
                return offsetY;
        };
        AxisAlignedBB.prototype.calculateZOffset = function (other, offsetZ) {
            if (other.maxX > this.minX && other.minX < this.maxX && other.maxY > this.minY && other.minY < this.maxY) {
                if (offsetZ > 0 && other.maxZ <= this.minZ) {
                    var d1 = this.minZ - other.maxZ;
                    if (d1 < offsetZ)
                        offsetZ = d1;
                }
                else if (offsetZ < 0 && other.minZ >= this.maxZ) {
                    var d0 = this.maxZ - other.minZ;
                    if (d0 > offsetZ)
                        offsetZ = d0;
                }
                return offsetZ;
            }
            else
                return offsetZ;
        };
        AxisAlignedBB.prototype.intersectsWith = function (other) {
            return this.intersects(other.minX, other.minY, other.minZ, other.maxX, other.maxY, other.maxZ);
        };
        AxisAlignedBB.prototype.intersects = function (x1, y1, z1, x2, y2, z2) {
            if (typeof x1 === "number" && typeof y1 === "number") {
                return this.minX < x2 && this.maxX > x1 && this.minY < y2 && this.maxY > y1 && this.minZ < z2 && this.maxZ > z1;
            }
            else if (typeof x1 === "object" && x1 instanceof Vec3d && typeof y1 === "object" && y1 instanceof Vec3d) {
                return this.intersects(Math.min(x1.xCoord, y1.xCoord), Math.min(x1.yCoord, y1.yCoord), Math.min(x1.zCoord, y1.zCoord), Math.max(x1.xCoord, y1.xCoord), Math.max(x1.yCoord, y1.yCoord), Math.max(x1.zCoord, y1.zCoord));
            }
        };
        AxisAlignedBB.prototype.isVecInside = function (vec) {
            return vec.xCoord > this.minX && vec.xCoord < this.maxX ?
                (vec.yCoord > this.minY && vec.yCoord < this.maxY ?
                    vec.zCoord > this.minZ && vec.zCoord < this.maxZ : false) : false;
        };
        AxisAlignedBB.prototype.getAverageEdgeLength = function () {
            return (this.maxX - this.minX, this.maxY - this.minY, this.maxZ - this.minZ) / 3;
        };
        AxisAlignedBB.prototype.contract = function (value) {
            return this.expandXyz(-value);
        };
        AxisAlignedBB.prototype.calculateIntercept = function (vecA, vecB) {
            var vec3d = this.collideWithXPlane(this.minX, vecA, vecB);
            var enumfacing = EnumFacing.WEST;
            var vec3d1 = this.collideWithXPlane(this.maxX, vecA, vecB);
            if (vec3d1 != null && this.isClosest(vecA, vec3d, vec3d1)) {
                vec3d = vec3d1, enumfacing = EnumFacing.EAST;
            }
            vec3d1 = this.collideWithYPlane(this.minY, vecA, vecB);
            if (vec3d1 != null && this.isClosest(vecA, vec3d, vec3d1)) {
                vec3d = vec3d1, enumfacing = EnumFacing.DOWN;
            }
            vec3d1 = this.collideWithYPlane(this.maxY, vecA, vecB);
            if (vec3d1 != null && this.isClosest(vecA, vec3d, vec3d1)) {
                vec3d = vec3d1, enumfacing = EnumFacing.UP;
            }
            vec3d1 = this.collideWithZPlane(this.minZ, vecA, vecB);
            if (vec3d1 != null && this.isClosest(vecA, vec3d, vec3d1)) {
                vec3d = vec3d1, enumfacing = EnumFacing.NORTH;
            }
            vec3d1 = this.collideWithZPlane(this.maxZ, vecA, vecB);
            if (vec3d1 != null && this.isClosest(vecA, vec3d, vec3d1)) {
                vec3d = vec3d1, enumfacing = EnumFacing.SOUTH;
            }
            return vec3d == null ? null : new RayTraceResult(vec3d, enumfacing);
        };
        AxisAlignedBB.prototype.isClosest = function (vec1, vec2, vec3) {
            return vec2 == null || vec1.squareDistanceTo(vec3) < vec1.squareDistanceTo(vec2);
        };
        AxisAlignedBB.prototype.collideWithXPlane = function (num, vec1, vec2) {
            var vec3d = vec1.getIntermediateWithXValue(vec2, num);
            return vec3d != null && this.intersectsWithYZ(vec3d) ? vec3d : null;
        };
        AxisAlignedBB.prototype.collideWithYPlane = function (num, vec1, vec2) {
            var vec3d = vec1.getIntermediateWithYValue(vec2, num);
            return vec3d != null && this.intersectsWithXZ(vec3d) ? vec3d : null;
        };
        AxisAlignedBB.prototype.collideWithZPlane = function (num, vec1, vec2) {
            var vec3d = vec1.getIntermediateWithZValue(vec2, num);
            return vec3d != null && this.intersectsWithXY(vec3d) ? vec3d : null;
        };
        AxisAlignedBB.prototype.intersectsWithYZ = function (vec) {
            return vec.yCoord >= this.minY && vec.yCoord <= this.maxY && vec.zCoord >= this.minZ && vec.zCoord <= this.maxZ;
        };
        AxisAlignedBB.prototype.intersectsWithXZ = function (vec) {
            return vec.xCoord >= this.minX && vec.xCoord <= this.maxX && vec.zCoord >= this.minZ && vec.zCoord <= this.maxZ;
        };
        AxisAlignedBB.prototype.intersectsWithXY = function (vec) {
            return vec.xCoord >= this.minX && vec.xCoord <= this.maxX && vec.yCoord >= this.minY && vec.yCoord <= this.maxY;
        };
        AxisAlignedBB.prototype.toString = function () {
            return "box[" + this.minX + ", " + this.minY + ", " + this.minZ + " -> " + this.maxX + ", " + this.maxY + ", " + this.maxZ + "]";
        };
        AxisAlignedBB.prototype.hasNaN = function () {
            return java.lang.Double.isNaN(this.minX) ||
                java.lang.Double.isNaN(this.minY) ||
                java.lang.Double.isNaN(this.minZ) ||
                java.lang.Double.isNaN(this.maxX) ||
                java.lang.Double.isNaN(this.maxY) ||
                java.lang.Double.isNaN(this.maxZ);
        };
        AxisAlignedBB.prototype.getCenter = function () {
            return new Vec3d(this.minX + (this.maxX - this.minX) * 0.5, this.minY + (this.maxY - this.minY) * 0.5, this.minZ + (this.maxZ - this.minZ) * 0.5);
        };
        return AxisAlignedBB;
    }(java.lang.Object));
    MinecraftUtils.AxisAlignedBB = AxisAlignedBB;
    var UnmodifiableIterator = /** @class */ (function (_super) {
        __extends(UnmodifiableIterator, _super);
        function UnmodifiableIterator() {
            return _super.call(this) || this;
        }
        ;
        UnmodifiableIterator.prototype.remove = function () {
            throw new java.lang.UnsupportedOperationException();
        };
        return UnmodifiableIterator;
    }(java.util.Iterator));
    var AbstractIteratorState;
    (function (AbstractIteratorState) {
        AbstractIteratorState[AbstractIteratorState["READY"] = 0] = "READY";
        AbstractIteratorState[AbstractIteratorState["NOT_READY"] = 1] = "NOT_READY";
        AbstractIteratorState[AbstractIteratorState["DONE"] = 2] = "DONE";
        AbstractIteratorState[AbstractIteratorState["FAILED"] = 3] = "FAILED";
    })(AbstractIteratorState || (AbstractIteratorState = {}));
    var AbstractIterator = /** @class */ (function (_super) {
        __extends(AbstractIterator, _super);
        function AbstractIterator() {
            var _this = _super.call(this) || this;
            _this.state = AbstractIteratorState.NOT_READY;
            _this.State = AbstractIteratorState;
            return _this;
        }
        ;
        AbstractIterator.prototype.next = function () {
            if (!this.hasNext())
                throw new java.util.NoSuchElementException();
            this.state = this.State.NOT_READY;
            var result = this.nextt;
            this.nextt = null;
            return result;
        };
        AbstractIterator.prototype.endOfData = function () {
            this.state = this.State.DONE;
            return null;
        };
        AbstractIterator.prototype.hasNext = function () {
            if (!(this.state != this.State.FAILED))
                throw new java.lang.IllegalStateException();
            switch (this.state) {
                case this.State.DONE: return false;
                case this.State.READY: return true;
                default:
            }
            return this.tryToComputeNext();
        };
        AbstractIterator.prototype.tryToComputeNext = function () {
            this.state = this.State.FAILED;
            this.nextt = this.computeNext();
            if (this.state != this.State.DONE) {
                this.state = this.State.READY;
                return true;
            }
            return false;
        };
        AbstractIterator.prototype.peek = function () {
            if (!this.hasNext())
                throw new java.util.NoSuchElementException();
            return this.nextt;
        };
        return AbstractIterator;
    }(UnmodifiableIterator));
    var Vec2f = /** @class */ (function (_super) {
        __extends(Vec2f, _super);
        function Vec2f(xIn, yIn) {
            var _this = _super.call(this) || this;
            _this.x = xIn;
            _this.y = yIn;
            return _this;
        }
        Vec2f.ZERO = new Vec2f(0, 0);
        Vec2f.ONE = new Vec2f(1, 1);
        Vec2f.UNIT_X = new Vec2f(1, 0);
        Vec2f.NEGATIVE_UNIT_X = new Vec2f(-1, 0);
        Vec2f.UNIT_Y = new Vec2f(0, 1);
        Vec2f.NEGATIVE_UNIT_Y = new Vec2f(0, -1);
        Vec2f.MAX = new Vec2f(java.lang.Float.MAX_VALUE, java.lang.Float.MAX_VALUE);
        Vec2f.MIN = new Vec2f(java.lang.Float.MIN_VALUE, java.lang.Float.MIN_VALUE);
        return Vec2f;
    }(java.lang.Object));
    MinecraftUtils.Vec2f = Vec2f;
    var Vec3i = /** @class */ (function (_super) {
        __extends(Vec3i, _super);
        function Vec3i(xIn, yIn, zIn) {
            var _this = _super.call(this) || this;
            _this.x = Math.floor(xIn), _this.y = Math.floor(yIn), _this.z = Math.floor(zIn);
            return _this;
        }
        Vec3i.prototype.equals = function (obj) {
            if (this == obj)
                return true;
            else if (!(obj instanceof Vec3i))
                return false;
            else {
                var vec3i = obj;
                return this.getX() != vec3i.getX() ? false :
                    (this.getY() != vec3i.getY() ? false :
                        this.getZ() == vec3i.getZ());
            }
        };
        Vec3i.prototype.hashCode = function () {
            return (this.getY() + this.getZ() * 31) * 31 + this.getX();
        };
        Vec3i.prototype.compareTo = function (toCompare) {
            return this.getY() == toCompare.getY() ?
                (this.getZ() == toCompare.getZ() ? this.getX() - toCompare.getX() :
                    this.getZ() - toCompare.getZ()) : this.getY() - toCompare.getY();
        };
        Vec3i.prototype.getX = function () { return this.x; };
        ;
        Vec3i.prototype.getY = function () { return this.y; };
        ;
        Vec3i.prototype.getZ = function () { return this.z; };
        ;
        Vec3i.prototype.crossProduct = function (vec) {
            return new Vec3i(this.getY() * vec.getZ() - this.getZ() * vec.getY(), this.getZ() * vec.getX() - this.getX() * vec.getZ(), this.getX() * vec.getY() - this.getY() * vec.getX());
        };
        Vec3i.prototype.getDistance = function (xIn, yIn, zIn) {
            return Math.sqrt(this.distanceSq(xIn, yIn, zIn));
        };
        Vec3i.prototype.distanceSq = function (toX, toY, toZ) {
            if (typeof toX === "number") {
                return Math.pow(this.getX() - toX, 2) + Math.pow(this.getY() - toY, 2) + Math.pow(this.getZ() + toZ, 2);
            }
            else if (typeof toX === "object" && toX instanceof Vec3i) {
                toX = toX;
                return this.distanceSq(toX.getX(), toX.getY(), toX.getZ());
            }
        };
        Vec3i.prototype.distanceSqToCenter = function (xIn, yIn, zIn) {
            return this.distanceSq(xIn + 0.5, yIn + 0.5, zIn + 0.5);
        };
        Vec3i.prototype.toString = function () {
            return this.getX() + ", " + this.getY() + ", " + this.getZ();
        };
        Vec3i.NULL_VECTOR = new Vec3i(0, 0, 0);
        return Vec3i;
    }(java.lang.Object));
    MinecraftUtils.Vec3i = Vec3i;
    var Vec3d = /** @class */ (function (_super) {
        __extends(Vec3d, _super);
        function Vec3d(x, y, z) {
            var _this = _super.call(this) || this;
            if (typeof x === "number") {
                if (x == -0)
                    x = 0;
                if (y == -0)
                    y = 0;
                if (z == -0)
                    z = 0;
                _this.xCoord = x;
                _this.yCoord = y;
                _this.zCoord = z;
            }
            else if (typeof x === "object" && x instanceof Vec3i) {
                return new Vec3d(x.getX(), x.getY(), x.getZ());
            }
            return _this;
        }
        Vec3d.prototype.subtractReverse = function (vec) {
            return new Vec3d(vec.xCoord - this.xCoord, vec.yCoord - this.yCoord, vec.zCoord - this.zCoord);
        };
        Vec3d.prototype.normalize = function () {
            var d0 = Math.sqrt(Math.pow(this.xCoord, 2) + Math.pow(this.yCoord, 2) + Math.pow(this.zCoord, 2));
            return d0 < 1e-4 ? Vec3d.ZERO : new Vec3d(this.xCoord / d0, this.yCoord / d0, this.zCoord / d0);
        };
        Vec3d.prototype.dotProduct = function (vec) {
            return this.xCoord * vec.xCoord + this.yCoord * vec.yCoord + this.zCoord * vec.zCoord;
        };
        Vec3d.prototype.crossProduct = function (vec) {
            return new Vec3d(this.yCoord * vec.zCoord - this.zCoord * vec.yCoord, this.zCoord * vec.xCoord - this.xCoord * vec.zCoord, this.xCoord * vec.yCoord - this.yCoord * vec.xCoord);
        };
        Vec3d.prototype.subtract = function (x, y, z) {
            if (typeof x === "number") {
                return this.addVector(-x, -y, -z);
            }
            else if (typeof x === "object" && x instanceof Vec3d) {
                return this.subtract(x.xCoord, x.yCoord, x.zCoord);
            }
        };
        Vec3d.prototype.add = function (vec) {
            return this.addVector(vec.xCoord, vec.yCoord, vec.zCoord);
        };
        Vec3d.prototype.addVector = function (x, y, z) {
            return new Vec3d(this.xCoord + x, this.yCoord + y, this.zCoord + z);
        };
        Vec3d.prototype.mul = function (factorX, factorY, factorZ) {
            return new Vec3d(this.xCoord * factorX, this.yCoord * factorY, this.zCoord * factorZ);
        };
        Vec3d.prototype.distanceTo = function (vec) {
            return Math.sqrt(this.squareDistanceTo(vec));
        };
        Vec3d.prototype.squareDistanceTo = function (vec, y, z) {
            if (typeof vec === "object" && vec instanceof Vec3d) {
                return Math.pow(vec.xCoord - this.xCoord, 2) + Math.pow(vec.yCoord - this.yCoord, 2) + Math.pow(vec.zCoord - this.zCoord, 2);
            }
            else
                return Math.pow(vec - this.xCoord, 2) + Math.pow(y - this.yCoord, 2) + Math.pow(z - this.zCoord, 2);
        };
        Vec3d.prototype.scale = function (scale) {
            return new Vec3d(this.xCoord * scale, this.yCoord * scale, this.zCoord * scale);
        };
        Vec3d.prototype.lengthVector = function () {
            return Math.sqrt(this.lengthSquared());
        };
        Vec3d.prototype.lengthSquared = function () {
            return Math.pow(this.xCoord, 2) + Math.pow(this.yCoord, 2) + Math.pow(this.zCoord, 2);
        };
        Vec3d.prototype.getIntermediateWithXValue = function (vec, x) {
            var d0 = vec.xCoord - this.xCoord;
            var d1 = vec.yCoord - this.yCoord;
            var d2 = vec.zCoord - this.zCoord;
            if (Math.pow(d0, 2) < 1.0000000116860974e-7)
                return null;
            else {
                var d3 = (x - this.xCoord) / d0;
                return d3 >= 0 && d3 <= 1 ? new Vec3d(this.xCoord + d0 * d3, this.yCoord + d1 * d3, this.zCoord + d2 * d3) : null;
            }
        };
        Vec3d.prototype.getIntermediateWithYValue = function (vec, y) {
            var d0 = vec.xCoord - this.xCoord;
            var d1 = vec.yCoord - this.yCoord;
            var d2 = vec.zCoord - this.zCoord;
            if (Math.pow(d0, 2) < 1.0000000116860974e-7)
                return null;
            else {
                var d3 = (y - this.yCoord) / d0;
                return d3 >= 0 && d3 <= 1 ? new Vec3d(this.xCoord + d0 * d3, this.yCoord + d1 * d3, this.zCoord + d2 * d3) : null;
            }
        };
        Vec3d.prototype.getIntermediateWithZValue = function (vec, z) {
            var d0 = vec.xCoord - this.xCoord;
            var d1 = vec.yCoord - this.yCoord;
            var d2 = vec.zCoord - this.zCoord;
            if (Math.pow(d0, 2) < 1.0000000116860974e-7)
                return null;
            else {
                var d3 = (z - this.zCoord) / d0;
                return d3 >= 0 && d3 <= 1 ? new Vec3d(this.xCoord + d0 * d3, this.yCoord + d1 * d3, this.zCoord + d2 * d3) : null;
            }
        };
        Vec3d.prototype.equals = function (obj) {
            if (this == obj)
                return true;
            else if (!(obj instanceof Vec3d))
                return false;
            else {
                var vec3d = obj;
                return java.lang.Double.compare(vec3d.xCoord, this.xCoord) != 0 ? false :
                    (java.lang.Double.compare(vec3d.yCoord, this.yCoord) != 0 ? false :
                        (java.lang.Double.compare(vec3d.zCoord, this.zCoord) == 0));
            }
        };
        Vec3d.prototype.hashCode = function () {
            var j = java.lang.Double.doubleToLongBits(this.xCoord);
            var i = Math.floor(j ^ j >>> 32);
            j = java.lang.Double.doubleToLongBits(this.yCoord);
            i = 31 * i + Math.floor(j ^ j >>> 32);
            j = java.lang.Double.doubleToLongBits(this.zCoord);
            i = 31 * i + Math.floor(j ^ j >>> 32);
            return i;
        };
        Vec3d.prototype.toString = function () {
            return "(" + this.xCoord + ", " + this.yCoord + ", " + this.zCoord + ")";
        };
        Vec3d.prototype.rotatePitch = function (pitch) {
            var f = Math.cos(pitch);
            var f1 = Math.sin(pitch);
            var d0 = this.xCoord;
            var d1 = this.yCoord * f + this.zCoord * f1;
            var d2 = this.zCoord * f - this.yCoord * f1;
            return new Vec3d(d0, d1, d2);
        };
        Vec3d.prototype.rotateYaw = function (yaw) {
            var f = Math.cos(yaw);
            var f1 = Math.sin(yaw);
            var d0 = this.xCoord * f + this.zCoord * f1;
            var d1 = this.yCoord;
            var d2 = this.zCoord * f - this.xCoord * f1;
            return new Vec3d(d0, d1, d2);
        };
        Vec3d.fromPitchYawVector = function (vec) {
            return Vec3d.fromPitchYaw(vec.x, vec.y);
        };
        Vec3d.fromPitchYaw = function (pitch, yaw) {
            var f = Math.cos(-yaw * 0.017453292 - Math.PI);
            var f1 = Math.sin(-yaw * 0.017453292 - Math.PI);
            var f2 = Math.cos(-pitch * 0.017453292);
            var f3 = Math.sin(-pitch * 0.017453292);
            return new Vec3d(f1 * f2, f3, f * f2);
        };
        Vec3d.ZERO = new Vec3d(0, 0, 0);
        return Vec3d;
    }(java.lang.Object));
    MinecraftUtils.Vec3d = Vec3d;
    var BlockPos = /** @class */ (function (_super) {
        __extends(BlockPos, _super);
        function BlockPos(x, y, z) {
            var _this = this;
            if (typeof y !== "undefined" && typeof z !== "undefined") {
                _this = _super.call(this, x, y, z) || this;
            }
            else if (typeof x === "number") {
                var pos = Entity.getPosition(x);
                return new BlockPos(pos.x, pos.y, pos.z);
            }
            else if (typeof x === "object") {
                if (x instanceof Vec3d) {
                    return new BlockPos(x.xCoord, x.yCoord, x.zCoord);
                }
                else if (x instanceof Vec3i) {
                    return new BlockPos(x.getX(), x.getY(), x.getZ());
                }
            }
            return _this;
        }
        BlockPos.prototype.add = function (x, y, z) {
            if (typeof x === "number") {
                return x == 0 && y == 0 && z == 0 ? this : new BlockPos(this.getX() + x, this.getY() + y, this.getZ() + z);
            }
            else
                return x.getX() == 0 && x.getY() == 0 && x.getZ() == 0 ? this : new BlockPos(this.getX() + x.getX(), this.getY() + x.getY(), this.getZ() + x.getZ());
        };
        BlockPos.prototype.subtract = function (vec) {
            return vec.getX() == 0 && vec.getY() == 0 && vec.getZ() == 0 ? this : new BlockPos(this.getX() - vec.getX(), this.getY() - vec.getY(), this.getZ() - vec.getZ());
        };
        BlockPos.prototype.up = function (n) {
            if (typeof n !== "undefined") {
                return this.offset(EnumFacing.UP, n);
            }
            else
                return this.up(1);
        };
        BlockPos.prototype.down = function (n) {
            if (typeof n !== "undefined") {
                return this.offset(EnumFacing.DOWN, n);
            }
            else
                return this.down(1);
        };
        BlockPos.prototype.north = function (n) {
            if (typeof n !== "undefined") {
                return this.offset(EnumFacing.NORTH, n);
            }
            else
                return this.north(1);
        };
        BlockPos.prototype.south = function (n) {
            if (typeof n !== "undefined") {
                return this.offset(EnumFacing.SOUTH, n);
            }
            else
                return this.south(1);
        };
        BlockPos.prototype.west = function (n) {
            if (typeof n !== "undefined") {
                return this.offset(EnumFacing.WEST, n);
            }
            else
                return this.west(1);
        };
        BlockPos.prototype.east = function (n) {
            if (typeof n !== "undefined") {
                return this.offset(EnumFacing.EAST, n);
            }
            else
                return this.east(1);
        };
        BlockPos.prototype.offset = function (facing, n) {
            if (typeof n !== "undefined") {
                return n == 0 ? this : new BlockPos(this.getX() + facing.getFrontOffsetX() * n, this.getY() + facing.getFrontOffsetY() * n, this.getZ() + facing.getFrontOffsetZ() * n);
            }
            else
                return this.offset(facing, 1);
        };
        BlockPos.prototype.crossProduct = function (vec) {
            return new BlockPos(this.getY() * vec.getZ() - this.getZ() * vec.getY(), this.getZ() * vec.getX() - this.getX() * vec.getZ(), this.getX() * vec.getY() - this.getY() * vec.getX());
        };
        BlockPos.prototype.toLong = function () {
            return (this.getX() & BlockPos.X_MASK) << BlockPos.X_SHIFT |
                (this.getY() & BlockPos.Y_MASK) << BlockPos.Y_SHIFT |
                (this.getZ() & BlockPos.Z_MASK) << 0;
        };
        BlockPos.prototype.fromLong = function (serialized) {
            return new BlockPos(serialized << 64 - BlockPos.X_SHIFT - BlockPos.NUM_X_BITS >> 64 - BlockPos.NUM_X_BITS, serialized << 64 - BlockPos.Y_SHIFT - BlockPos.NUM_Y_BITS >> 64 - BlockPos.NUM_Y_BITS, serialized << 64 - BlockPos.NUM_Z_BITS >> 64 - BlockPos.NUM_Z_BITS);
        };
        BlockPos.getAllInBox = function (from, to) {
            var blockpos = new BlockPos(Math.min(from.getX(), to.getX()), Math.min(from.getY(), to.getY()), Math.min(from.getZ(), to.getZ()));
            var blockpos1 = new BlockPos(Math.max(from.getX(), to.getX()), Math.max(from.getY(), to.getY()), Math.max(from.getZ(), to.getZ()));
            return new (/** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_1.prototype.iterator = function () {
                    return new (/** @class */ (function (_super) {
                        __extends(class_2, _super);
                        function class_2() {
                            return _super.call(this) || this;
                        }
                        ;
                        class_2.prototype.computeNext = function () {
                            if (this.lastReturned == null) {
                                this.lastReturned = blockpos;
                                return this.lastReturned;
                            }
                            else if (this.lastReturned.equals(blockpos1))
                                return this.endOfData();
                            else {
                                var i = this.lastReturned.getX();
                                var j = this.lastReturned.getY();
                                var k = this.lastReturned.getZ();
                                if (i < blockpos1.getX())
                                    ++i;
                                else if (j < blockpos1.getY()) {
                                    i = blockpos.getX();
                                    ++j;
                                }
                                else if (k < blockpos1.getZ()) {
                                    i = blockpos.getX(), j = blockpos.getY();
                                    ++k;
                                }
                                ;
                                this.lastReturned = new BlockPos(i, j, k);
                                return this.lastReturned;
                            }
                        };
                        return class_2;
                    }(AbstractIterator)));
                };
                return class_1;
            }(java.lang.Iterable)));
        };
        BlockPos.prototype.toImmutable = function () {
            return this;
        };
        BlockPos.getAllInBoxMutable = function (from, to) {
            var blockpos = new BlockPos(Math.min(from.getX(), to.getX()), Math.min(from.getY(), to.getY()), Math.min(from.getZ(), to.getZ()));
            var blockpos1 = new BlockPos(Math.max(from.getX(), to.getX()), Math.max(from.getY(), to.getY()), Math.max(from.getZ(), to.getZ()));
            return new (/** @class */ (function (_super) {
                __extends(class_3, _super);
                function class_3() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_3.prototype.iterator = function () {
                    return new (/** @class */ (function (_super) {
                        __extends(class_4, _super);
                        function class_4() {
                            return _super.call(this) || this;
                        }
                        ;
                        class_4.prototype.computeNext = function () {
                            if (this.theBlockPos == null) {
                                this.theBlockPos = new BlockPos.MutableBlockPos(blockpos.getX(), blockpos.getY(), blockpos.getZ());
                                return this.theBlockPos;
                            }
                            else if (this.theBlockPos.equals(blockpos1))
                                return this.endOfData();
                            else {
                                var i = this.theBlockPos.getX();
                                var j = this.theBlockPos.getY();
                                var k = this.theBlockPos.getZ();
                                if (i < blockpos1.getX())
                                    ++i;
                                else if (j < blockpos1.getY()) {
                                    i = blockpos.getX();
                                    ++j;
                                }
                                else if (k < blockpos1.getZ()) {
                                    i = blockpos.getX();
                                    j = blockpos.getY();
                                    ++k;
                                }
                                ;
                                return new BlockPos(i, j, k);
                            }
                        };
                        return class_4;
                    }(AbstractIterator)));
                };
                return class_3;
            }(java.lang.Iterable)));
        };
        BlockPos.ORIGIN = new BlockPos(0, 0, 0);
        BlockPos.NUM_X_BITS = 1; //TODO
        BlockPos.NUM_Z_BITS = BlockPos.NUM_X_BITS;
        BlockPos.NUM_Y_BITS = 64 - BlockPos.NUM_X_BITS - BlockPos.NUM_Z_BITS;
        BlockPos.Y_SHIFT = 0 + BlockPos.NUM_Z_BITS;
        BlockPos.X_SHIFT = BlockPos.Y_SHIFT + BlockPos.NUM_Y_BITS;
        BlockPos.X_MASK = (1 << BlockPos.NUM_X_BITS) - 1;
        BlockPos.Y_MASK = (1 << BlockPos.NUM_Y_BITS) - 1;
        BlockPos.Z_MASK = (1 << BlockPos.NUM_Z_BITS) - 1;
        return BlockPos;
    }(Vec3i));
    MinecraftUtils.BlockPos = BlockPos;
    (function (BlockPos) {
        var MutableBlockPos = /** @class */ (function (_super) {
            __extends(MutableBlockPos, _super);
            function MutableBlockPos(x, y, z) {
                var _this = this;
                if (typeof x === "number") {
                    _this = _super.call(this, 0, 0, 0) || this;
                    _this.x = x, _this.y = y, _this.z = z;
                }
                else if (typeof x === "object" && x instanceof BlockPos) {
                    return new MutableBlockPos(x.getX(), x.getY(), x.getZ());
                }
                else
                    return new MutableBlockPos(0, 0, 0);
                return _this;
            }
            MutableBlockPos.prototype.getX = function () { return this.x; };
            ;
            MutableBlockPos.prototype.getY = function () { return this.y; };
            ;
            MutableBlockPos.prototype.getZ = function () { return this.z; };
            ;
            MutableBlockPos.prototype.setPos = function (x, y, z) {
                if (typeof x === "number") {
                    if (typeof y === "number" && typeof z === "number") {
                        this.x = Math.floor(x), this.y = Math.floor(y), this.z = Math.floor(z);
                        return this;
                    }
                    else {
                        var pos = Entity.getPosition(x);
                        return this.setPos(pos.x, pos.y, pos.z);
                    }
                }
                else if (typeof x === "object" && x instanceof Vec3i) {
                    return this.setPos(x.getX(), x.getY(), x.getZ());
                }
            };
            MutableBlockPos.prototype.move = function (facing, num) {
                if (typeof num === "number") {
                    return this.setPos(this.x + facing.getFrontOffsetX() * num, this.y + facing.getFrontOffsetY() * num, this.z + facing.getFrontOffsetZ() * num);
                }
                else
                    return this.move(facing, 1);
            };
            MutableBlockPos.prototype.setY = function (yIn) {
                this.y = yIn;
            };
            MutableBlockPos.prototype.toImmutable = function () {
                return new BlockPos(this.getX(), this.getY(), this.getZ());
            };
            return MutableBlockPos;
        }(BlockPos));
        BlockPos.MutableBlockPos = MutableBlockPos;
    })(BlockPos = MinecraftUtils.BlockPos || (MinecraftUtils.BlockPos = {}));
    var Direction;
    (function (Direction) {
        Direction.offsetX = [0, -1, 0, 1];
        Direction.offsetZ = [1, 0, -1, 0];
        Direction.directions = ["SOUTH", "WEST", "NORTH", "EAST"];
        /** Maps a Direction value (2D) to a Facing value (3D). */
        Direction.directionsToFacing = [3, 4, 2, 5];
        /**  Maps a Facing value (3D) to a Direction value (2D). */
        Direction.facingToDirection = [-1, -1, 2, 0, 1, 3];
        /** Maps a direction to that opposite of it. */
        Direction.rotateOpposite = [2, 3, 0, 1];
        /** Maps a direction to that to the right of it. */
        Direction.rotateRight = [1, 2, 3, 0];
        /** Maps a direction to that to the left of it. */
        Direction.rotateLeft = [3, 0, 1, 2];
        Direction.bedDirection = [[1, 0, 3, 2, 5, 4], [1, 0, 5, 4, 2, 3], [1, 0, 2, 3, 4, 5], [1, 0, 4, 5, 3, 2]];
        /**
         * Returns the movement direction from a velocity vector.
         */
        function getMovementDirection(pitch, yaw) {
            return Math.abs(pitch) > Math.abs(yaw) ? (pitch > 0 ? 1 : 3) : (yaw > 0 ? 2 : 0);
        }
        Direction.getMovementDirection = getMovementDirection;
    })(Direction = MinecraftUtils.Direction || (MinecraftUtils.Direction = {}));
    var EnumFacingAxisDirection = /** @class */ (function () {
        function EnumFacingAxisDirection(offset, description) {
            this.offset = offset;
            this.description = description;
        }
        EnumFacingAxisDirection.prototype.getOffset = function () {
            return this.offset;
        };
        EnumFacingAxisDirection.prototype.toString = function () {
            return this.description;
        };
        EnumFacingAxisDirection.POSITIVE = new EnumFacingAxisDirection(1, "Towards positive");
        EnumFacingAxisDirection.NEGATIVE = new EnumFacingAxisDirection(-1, "Towards negative");
        return EnumFacingAxisDirection;
    }());
    MinecraftUtils.EnumFacingAxisDirection = EnumFacingAxisDirection;
    var EnumFacingPlane = /** @class */ (function () {
        function EnumFacingPlane(num) {
            this.num = num;
        }
        EnumFacingPlane.prototype.facings = function () {
            switch (this) {
                case EnumFacingPlane.HORIZONTAL:
                    return [];
                case EnumFacingPlane.VERTICAL:
                    return [];
                default:
                    throw new java.lang.Error("Someone\'s been tampering with the universe!");
            }
        };
        EnumFacingPlane.prototype.random = function (rand) {
            var aenumfacing = this.facings();
            return aenumfacing[rand.nextInt(aenumfacing.length)];
        };
        EnumFacingPlane.prototype.apply = function (toApply) {
            return toApply != null; //todo
        };
        EnumFacingPlane.prototype.iterator = function () {
            return java.util.Arrays.asList(this.facings()).iterator();
        };
        EnumFacingPlane.HORIZONTAL = new EnumFacingPlane(0);
        EnumFacingPlane.VERTICAL = new EnumFacingPlane(1);
        return EnumFacingPlane;
    }());
    var EnumFacingAxis = /** @class */ (function () {
        function EnumFacingAxis(name, plane) {
            this.name = name;
            this.plane = plane;
        }
        EnumFacingAxis.byName = function (name) {
            return name == null ? null : EnumFacingAxis.NAME_LOOKUP.get(name.toLowerCase());
        };
        EnumFacingAxis.prototype.getName2 = function () {
            return this.name;
        };
        EnumFacingAxis.prototype.isVertical = function () {
            return this.plane == EnumFacingPlane.VERTICAL;
        };
        EnumFacingAxis.prototype.isHorizontal = function () {
            return this.plane == EnumFacingPlane.HORIZONTAL;
        };
        EnumFacingAxis.prototype.toString = function () {
            return this.name;
        };
        EnumFacingAxis.prototype.apply = function (toApply) {
            return toApply != null && toApply.getAxis() == this;
        };
        EnumFacingAxis.prototype.getPlane = function () {
            return this.plane;
        };
        EnumFacingAxis.prototype.getName = function () {
            return this.name;
        };
        EnumFacingAxis.X = new EnumFacingAxis("x", EnumFacingPlane.HORIZONTAL);
        EnumFacingAxis.Y = new EnumFacingAxis("y", EnumFacingPlane.VERTICAL);
        EnumFacingAxis.Z = new EnumFacingAxis("z", EnumFacingPlane.HORIZONTAL);
        EnumFacingAxis.NAME_LOOKUP = new java.util.HashMap();
        EnumFacingAxis.VALUES = [EnumFacingAxis.X, EnumFacingAxis.Y, EnumFacingAxis.Z];
        return EnumFacingAxis;
    }());
    MinecraftUtils.EnumFacingAxis = EnumFacingAxis;
    var EnumFacing = /** @class */ (function () {
        function EnumFacing(indexIn, oppositeIn, horizontalIndexIn, nameIn, axisDirectionIn, axisIn, directionVecIn) {
            this.index = indexIn;
            this.horizontalIndex = horizontalIndexIn;
            this.opposite = oppositeIn;
            this.name = nameIn;
            this.axis = axisIn;
            this.axisDirection = axisDirectionIn;
            this.directionVec = directionVecIn;
        }
        EnumFacing.prototype.getIndex = function () {
            return this.index;
        };
        EnumFacing.prototype.getHorizontalIndex = function () {
            return this.horizontalIndex;
        };
        EnumFacing.prototype.getAxisDirection = function () {
            return this.axisDirection;
        };
        EnumFacing.prototype.getOpposite = function () {
            return EnumFacing.VALUES[this.opposite];
        };
        EnumFacing.prototype.rotateAround = function (axis) {
            switch (axis) {
                case EnumFacingAxis.X:
                    if (this != EnumFacing.WEST && this != EnumFacing.EAST)
                        return this.rotateX();
                    return this;
                case EnumFacingAxis.Y:
                    if (this != EnumFacing.UP && this != EnumFacing.DOWN)
                        return this.rotateY();
                    return this;
                case EnumFacingAxis.Z:
                    if (this != EnumFacing.NORTH && this != EnumFacing.SOUTH)
                        return this.rotateZ();
                    return this;
                default:
                    throw new java.lang.IllegalStateException("Unable to get CW facing for axis " + axis);
            }
        };
        EnumFacing.prototype.rotateY = function () {
            switch (this) {
                case EnumFacing.NORTH: return EnumFacing.EAST;
                case EnumFacing.EAST: return EnumFacing.SOUTH;
                case EnumFacing.SOUTH: return EnumFacing.WEST;
                case EnumFacing.WEST: return EnumFacing.NORTH;
                default:
                    throw new java.lang.IllegalStateException("Unable to get Y-rotated facing of " + this.name);
            }
        };
        EnumFacing.prototype.rotateX = function () {
            switch (this) {
                case EnumFacing.NORTH: return EnumFacing.DOWN;
                case EnumFacing.EAST:
                case EnumFacing.WEST:
                default:
                    throw new java.lang.IllegalStateException("Unable to get X-rotated facing of " + this.name);
                case EnumFacing.SOUTH: return EnumFacing.UP;
                case EnumFacing.UP: return EnumFacing.NORTH;
                case EnumFacing.DOWN: return EnumFacing.SOUTH;
            }
        };
        EnumFacing.prototype.rotateZ = function () {
            switch (this) {
                case EnumFacing.EAST: return EnumFacing.DOWN;
                case EnumFacing.SOUTH:
                default:
                    throw new java.lang.IllegalStateException("Unable to get Z-rotated facing of " + this.name);
                case EnumFacing.WEST: return EnumFacing.UP;
                case EnumFacing.UP: return EnumFacing.EAST;
                case EnumFacing.DOWN: return EnumFacing.WEST;
            }
        };
        EnumFacing.prototype.rotateYCCW = function () {
            switch (this) {
                case EnumFacing.NORTH: return EnumFacing.WEST;
                case EnumFacing.EAST: return EnumFacing.NORTH;
                case EnumFacing.SOUTH: return EnumFacing.EAST;
                case EnumFacing.WEST: return EnumFacing.SOUTH;
                default:
                    throw new java.lang.IllegalStateException("Unable to get CCW facing of " + this.name);
            }
        };
        EnumFacing.prototype.getFrontOffsetX = function () {
            return this.axis == EnumFacing.Axis.X ? this.axisDirection.getOffset() : 0;
        };
        EnumFacing.prototype.getFrontOffsetY = function () {
            return this.axis == EnumFacing.Axis.Y ? this.axisDirection.getOffset() : 0;
        };
        EnumFacing.prototype.getFrontOffsetZ = function () {
            return this.axis == EnumFacing.Axis.Z ? this.axisDirection.getOffset() : 0;
        };
        EnumFacing.prototype.getName2 = function () {
            return this.name;
        };
        EnumFacing.prototype.getAxis = function () {
            return this.axis;
        };
        EnumFacing.byName = function (name) {
            return name == null ? null : this.NAME_LOOKUP.get(name.toLowerCase());
        };
        EnumFacing.getFront = function (index) {
            return this.VALUES[Math.abs(index % this.VALUES.length)];
        };
        EnumFacing.getHorizontal = function (index) {
            return this.HORIZONTALS[Math.abs(index % this.HORIZONTALS.length)];
        };
        EnumFacing.fromAngle = function (angle) {
            return this.getHorizontal(Math.floor(angle / 90 + 0.5) & 3);
        };
        EnumFacing.prototype.getHorizontalAngle = function () {
            return (this.horizontalIndex & 3) * 90;
        };
        EnumFacing.random = function (rand) {
            return this.VALUES[rand.nextInt(this.VALUES.length)];
        };
        EnumFacing.getFacingFromVector = function (x, y, z) {
            var enumfacing = EnumFacing.NORTH;
            var f = java.lang.Float.MIN_VALUE;
            for (var i in this.VALUES) {
                var enumfacing1 = this.VALUES[i];
                var f1 = x * enumfacing1.directionVec.getX() + y * enumfacing1.directionVec.getY() + z * enumfacing1.directionVec.getZ();
                if (f1 > f) {
                    f = f1, enumfacing = enumfacing1;
                }
            }
            return enumfacing;
        };
        EnumFacing.prototype.toString = function () {
            return this.name;
        };
        EnumFacing.getFacingFromAxis = function (axisDirectionIn, axisIn) {
            for (var i in this.VALUES) {
                var enumfacing = this.VALUES[i];
                if (enumfacing.getAxisDirection() == axisDirectionIn && enumfacing.getAxis() == axisIn)
                    return enumfacing;
            }
            throw new java.lang.IllegalArgumentException("No such direction: " + axisDirectionIn + " " + axisIn);
        };
        EnumFacing.prototype.getDirectionVec = function () {
            return this.directionVec;
        };
        EnumFacing.prototype.getName = function () {
            return this.name;
        };
        EnumFacing.DOWN = new EnumFacing(0, 1, -1, "down", EnumFacingAxisDirection.NEGATIVE, EnumFacingAxis.Y, new Vec3i(0, -1, 0));
        EnumFacing.UP = new EnumFacing(1, 0, -1, "up", EnumFacingAxisDirection.POSITIVE, EnumFacingAxis.Y, new Vec3i(0, 1, 0));
        EnumFacing.NORTH = new EnumFacing(2, 3, 2, "north", EnumFacingAxisDirection.NEGATIVE, EnumFacingAxis.Z, new Vec3i(0, 0, -1));
        EnumFacing.SOUTH = new EnumFacing(3, 2, 0, "south", EnumFacingAxisDirection.POSITIVE, EnumFacingAxis.Z, new Vec3i(0, 0, 1));
        EnumFacing.WEST = new EnumFacing(4, 5, 1, "west", EnumFacingAxisDirection.NEGATIVE, EnumFacingAxis.X, new Vec3i(-1, 0, 0));
        EnumFacing.EAST = new EnumFacing(5, 4, 3, "east", EnumFacingAxisDirection.POSITIVE, EnumFacingAxis.X, new Vec3i(1, 0, 0));
        EnumFacing.VALUES = [];
        EnumFacing.HORIZONTALS = [];
        EnumFacing.NAME_LOOKUP = new java.util.HashMap();
        EnumFacing.Axis = EnumFacingAxis;
        EnumFacing.Plane = EnumFacingPlane;
        EnumFacing.AxisDirection = EnumFacingAxisDirection;
        return EnumFacing;
    }());
    MinecraftUtils.EnumFacing = EnumFacing;
    var MathHelper;
    (function (MathHelper) {
        function clamp(num, min, max) {
            return num < min ? min : (num > max ? max : num);
        }
        MathHelper.clamp = clamp;
        function lerp(value1, value2, amount) {
            return value1 + (value2 - value1) * amount;
        }
        MathHelper.lerp = lerp;
        function intFloorDiv(f) {
            var f1 = 0.5 * f;
            var i = java.lang.Float.floatToIntBits(f);
            i = 1597463007 - (i >> 1);
            f = java.lang.Float.intBitsToFloat(i);
            f *= 1.5 - f1 * f * f;
            return f;
        }
        MathHelper.intFloorDiv = intFloorDiv;
    })(MathHelper = MinecraftUtils.MathHelper || (MinecraftUtils.MathHelper = {}));
})(MinecraftUtils || (MinecraftUtils = {}));
//static code
for (var i in MinecraftUtils.EnumFacing.VALUES) {
    var enumfacing = MinecraftUtils.EnumFacing[i];
    MinecraftUtils.EnumFacing.VALUES[enumfacing.getIndex()] = enumfacing;
    if (enumfacing.getAxis().isHorizontal()) {
        MinecraftUtils.EnumFacing.HORIZONTALS[enumfacing.getHorizontalIndex()] = enumfacing;
    }
    MinecraftUtils.EnumFacing.NAME_LOOKUP.put(enumfacing.getName2().toLowerCase(), enumfacing);
}
for (var i in MinecraftUtils.EnumFacing.Axis.VALUES) {
    var enumfacingaxis = MinecraftUtils.EnumFacing.Axis.VALUES[i];
    MinecraftUtils.EnumFacing.Axis.NAME_LOOKUP.put(enumfacingaxis.getName2().toLowerCase(), enumfacingaxis);
}
//----------
EXPORT("MinecraftUtils", MinecraftUtils);
