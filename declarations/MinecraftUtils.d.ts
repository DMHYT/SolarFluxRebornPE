declare namespace MinecraftUtils {
    enum RayTraceResultType {
        MISS = 0,
        BLOCK = 1,
        ENTITY = 2
    }
    export class RayTraceResult extends java.lang.Object {
        private blockPos;
        typeOfHit: RayTraceResultType;
        sideHit: EnumFacing;
        hitVec: Vec3d;
        entityHit: number;
        constructor(hitVecIn: Vec3d, sideHitIn: EnumFacing, blockPosIn: BlockPos);
        constructor(hitVecIn: Vec3d, sideHitIn: EnumFacing);
        constructor(entityIn: number);
        constructor(typeIn: RayTraceResultType, hitVecIn: Vec3d, sideHitIn: EnumFacing, blockPosIn: BlockPos);
        constructor(entityHitIn: number, hitVecIn: Vec3d);
        getBlockPos(): BlockPos;
        toString(): string;
        static Type: typeof RayTraceResultType;
    }
    export class AxisAlignedBB extends java.lang.Object {
        readonly minX: number;
        readonly minY: number;
        readonly minZ: number;
        readonly maxX: number;
        readonly maxY: number;
        readonly maxZ: number;
        constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number);
        constructor(pos: BlockPos);
        constructor(pos1: BlockPos, pos2: BlockPos);
        constructor(min: Vec3d, max: Vec3d);
        setMaxY(y2: number): AxisAlignedBB;
        equals(obj: java.lang.Object): boolean;
        hashCode(): number;
        addCoord(x: number, y: number, z: number): AxisAlignedBB;
        expand(x: number, y: number, z: number): AxisAlignedBB;
        expandXyz(value: number): AxisAlignedBB;
        union(other: AxisAlignedBB): AxisAlignedBB;
        offset(x: number, y: number, z: number): AxisAlignedBB;
        offset(pos: BlockPos): AxisAlignedBB;
        calculateXOffset(other: AxisAlignedBB, offsetX: number): number;
        calculateYOffset(other: AxisAlignedBB, offsetY: number): number;
        calculateZOffset(other: AxisAlignedBB, offsetZ: number): number;
        intersectsWith(other: AxisAlignedBB): boolean;
        intersects(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): boolean;
        intersects(min: Vec3d, max: Vec3d): boolean;
        isVecInside(vec: Vec3d): boolean;
        getAverageEdgeLength(): number;
        contract(value: number): AxisAlignedBB;
        calculateIntercept(vecA: Vec3d, vecB: Vec3d): Nullable<RayTraceResult>;
        private isClosest;
        private collideWithXPlane;
        private collideWithYPlane;
        private collideWithZPlane;
        intersectsWithYZ(vec: Vec3d): boolean;
        intersectsWithXZ(vec: Vec3d): boolean;
        intersectsWithXY(vec: Vec3d): boolean;
        toString(): string;
        hasNaN(): boolean;
        getCenter(): Vec3d;
    }
    export class Vec2f extends java.lang.Object {
        static readonly ZERO: Vec2f;
        static readonly ONE: Vec2f;
        static readonly UNIT_X: Vec2f;
        static readonly NEGATIVE_UNIT_X: Vec2f;
        static readonly UNIT_Y: Vec2f;
        static readonly NEGATIVE_UNIT_Y: Vec2f;
        static readonly MAX: Vec2f;
        static readonly MIN: Vec2f;
        readonly x: number;
        readonly y: number;
        constructor(xIn: number, yIn: number);
    }
    export class Vec3i extends java.lang.Object implements java.lang.Comparable<Vec3i> {
        static readonly NULL_VECTOR: Vec3i;
        protected readonly x: number;
        protected readonly y: number;
        protected readonly z: number;
        constructor(xIn: number, yIn: number, zIn: number);
        equals(obj: java.lang.Object): boolean;
        hashCode(): number;
        compareTo(toCompare: Vec3i): number;
        getX(): number;
        getY(): number;
        getZ(): number;
        crossProduct(vec: Vec3i): Vec3i;
        getDistance(xIn: number, yIn: number, zIn: number): number;
        distanceSq(toX: number, toY: number, toZ: number): number;
        distanceSq(to: Vec3i): any;
        distanceSqToCenter(xIn: number, yIn: number, zIn: number): number;
        toString(): string;
    }
    export class Vec3d extends java.lang.Object {
        static readonly ZERO: Vec3d;
        readonly xCoord: number;
        readonly yCoord: number;
        readonly zCoord: number;
        constructor(x: number, y: number, z: number);
        constructor(vec: Vec3i);
        subtractReverse(vec: Vec3d): Vec3d;
        normalize(): Vec3d;
        dotProduct(vec: Vec3d): number;
        crossProduct(vec: Vec3d): Vec3d;
        subtract(vec: Vec3d): Vec3d;
        subtract(x: number, y: number, z: number): Vec3d;
        add(vec: Vec3d): Vec3d;
        addVector(x: number, y: number, z: number): Vec3d;
        mul(factorX: number, factorY: number, factorZ: number): Vec3d;
        distanceTo(vec: Vec3d): number;
        squareDistanceTo(vec: Vec3d): number;
        squareDistanceTo(x: number, y: number, z: number): number;
        scale(scale: number): Vec3d;
        lengthVector(): number;
        lengthSquared(): number;
        getIntermediateWithXValue(vec: Vec3d, x: number): Nullable<Vec3d>;
        getIntermediateWithYValue(vec: Vec3d, y: number): Nullable<Vec3d>;
        getIntermediateWithZValue(vec: Vec3d, z: number): Nullable<Vec3d>;
        equals(obj: java.lang.Object): boolean;
        hashCode(): number;
        toString(): string;
        rotatePitch(pitch: number): Vec3d;
        rotateYaw(yaw: number): Vec3d;
        static fromPitchYawVector(vec: Vec2f): Vec3d;
        static fromPitchYaw(pitch: number, yaw: number): Vec3d;
    }
    export class BlockPos extends Vec3i {
        static readonly ORIGIN: BlockPos;
        private static readonly NUM_X_BITS;
        private static readonly NUM_Z_BITS;
        private static readonly NUM_Y_BITS;
        private static readonly Y_SHIFT;
        private static readonly X_SHIFT;
        private static readonly X_MASK;
        private static readonly Y_MASK;
        private static readonly Z_MASK;
        protected readonly x: number;
        protected readonly y: number;
        protected readonly z: number;
        constructor(x: number, y: number, z: number);
        constructor(source: number);
        constructor(vec: Vec3d);
        constructor(source: Vec3i);
        add(x: number, y: number, z: number): BlockPos;
        add(vec: Vec3i): BlockPos;
        subtract(vec: Vec3i): BlockPos;
        up(): BlockPos;
        up(n: number): BlockPos;
        down(): BlockPos;
        down(n: number): BlockPos;
        north(): BlockPos;
        north(n: number): BlockPos;
        south(): BlockPos;
        south(n: number): BlockPos;
        west(): BlockPos;
        west(n: number): BlockPos;
        east(): BlockPos;
        east(n: number): BlockPos;
        offset(facing: EnumFacing): BlockPos;
        offset(facing: EnumFacing, n: number): BlockPos;
        crossProduct(vec: Vec3i): BlockPos;
        toLong(): number;
        fromLong(serialized: number): BlockPos;
        static getAllInBox(from: BlockPos, to: BlockPos): java.lang.Iterable<BlockPos>;
        toImmutable(): BlockPos;
        static getAllInBoxMutable(from: BlockPos, to: BlockPos): java.lang.Iterable<BlockPos>;
    }
    export namespace BlockPos {
        class MutableBlockPos extends BlockPos {
            protected x: number;
            protected y: number;
            protected z: number;
            constructor();
            constructor(pos: BlockPos);
            constructor(x: number, y: number, z: number);
            getX(): number;
            getY(): number;
            getZ(): number;
            setPos(xIn: number, yIn: number, zIn: number): MutableBlockPos;
            setPos(entityIn: number): MutableBlockPos;
            setPos(vec: Vec3i): MutableBlockPos;
            move(facing: EnumFacing): MutableBlockPos;
            move(facing: EnumFacing, num: number): MutableBlockPos;
            setY(yIn: number): void;
            toImmutable(): BlockPos;
        }
    }
    export namespace Direction {
        const offsetX: number[];
        const offsetZ: number[];
        const directions: string[];
        /** Maps a Direction value (2D) to a Facing value (3D). */
        const directionsToFacing: number[];
        /**  Maps a Facing value (3D) to a Direction value (2D). */
        const facingToDirection: number[];
        /** Maps a direction to that opposite of it. */
        const rotateOpposite: number[];
        /** Maps a direction to that to the right of it. */
        const rotateRight: number[];
        /** Maps a direction to that to the left of it. */
        const rotateLeft: number[];
        const bedDirection: number[][];
        /**
         * Returns the movement direction from a velocity vector.
         */
        function getMovementDirection(pitch: number, yaw: number): number;
    }
    export interface IStringSerializable {
        getName(): string;
    }
    export class EnumFacingAxisDirection {
        static readonly POSITIVE: EnumFacingAxisDirection;
        static readonly NEGATIVE: EnumFacingAxisDirection;
        private readonly offset;
        private readonly description;
        private constructor();
        getOffset(): number;
        toString(): string;
    }
    class EnumFacingPlane {
        static readonly HORIZONTAL: EnumFacingPlane;
        static readonly VERTICAL: EnumFacingPlane;
        private readonly num;
        private constructor();
        facings(): EnumFacing[];
        random(rand: java.util.Random): EnumFacing;
        apply(toApply: Nullable<EnumFacing>): boolean;
        iterator(): java.util.Iterator<EnumFacing>;
    }
    export class EnumFacingAxis implements IStringSerializable {
        static readonly X: EnumFacingAxis;
        static readonly Y: EnumFacingAxis;
        static readonly Z: EnumFacingAxis;
        static readonly NAME_LOOKUP: java.util.Map<string, EnumFacingAxis>;
        static readonly VALUES: EnumFacingAxis[];
        private readonly name;
        private readonly plane;
        private constructor();
        static byName(name: string): EnumFacingAxis;
        getName2(): string;
        isVertical(): boolean;
        isHorizontal(): boolean;
        toString(): string;
        apply(toApply: Nullable<EnumFacing>): boolean;
        getPlane(): EnumFacingPlane;
        getName(): string;
    }
    export class EnumFacing implements IStringSerializable {
        static readonly DOWN: EnumFacing;
        static readonly UP: EnumFacing;
        static readonly NORTH: EnumFacing;
        static readonly SOUTH: EnumFacing;
        static readonly WEST: EnumFacing;
        static readonly EAST: EnumFacing;
        private readonly index;
        private readonly opposite;
        private readonly horizontalIndex;
        private readonly name;
        private readonly axis;
        private readonly axisDirection;
        private readonly directionVec;
        static readonly VALUES: EnumFacing[];
        static readonly HORIZONTALS: EnumFacing[];
        static readonly NAME_LOOKUP: java.util.Map<string, EnumFacing>;
        private constructor();
        getIndex(): number;
        getHorizontalIndex(): number;
        getAxisDirection(): EnumFacingAxisDirection;
        getOpposite(): EnumFacing;
        rotateAround(axis: EnumFacingAxis): EnumFacing;
        rotateY(): EnumFacing;
        private rotateX;
        private rotateZ;
        rotateYCCW(): EnumFacing;
        getFrontOffsetX(): number;
        getFrontOffsetY(): number;
        getFrontOffsetZ(): number;
        getName2(): string;
        getAxis(): EnumFacingAxis;
        static byName(name: string): EnumFacing;
        static getFront(index: number): EnumFacing;
        static getHorizontal(index: number): EnumFacing;
        static fromAngle(angle: number): EnumFacing;
        getHorizontalAngle(): number;
        static random(rand: java.util.Random): EnumFacing;
        static getFacingFromVector(x: number, y: number, z: number): EnumFacing;
        toString(): string;
        static getFacingFromAxis(axisDirectionIn: EnumFacingAxisDirection, axisIn: EnumFacingAxis): EnumFacing;
        getDirectionVec(): Vec3i;
        getName(): string;
        static readonly Axis: typeof EnumFacingAxis;
        static readonly Plane: typeof EnumFacingPlane;
        static readonly AxisDirection: typeof EnumFacingAxisDirection;
    }
    export namespace MathHelper {
        function clamp(num: number, min: number, max: number): number;
        function lerp(value1: number, value2: number, amount: number): number;
        function intFloorDiv(f: number): number;
    }
    export {};
}
