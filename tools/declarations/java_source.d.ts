/// <reference path="core-engine.d.ts" />
declare interface BlockPos extends Vector {
    readonly dimension: number;
}
declare interface BlockPosFace extends BlockPos {
    readonly side: number;
    readonly rate: number;
}
/** USE ONLY VIA WRAP_JAVA */
declare class SFRPEMainJavaClass extends java.lang.Object {
    public toLong(x: number, y: number, z: number): number;
    public fromLong(serialized: number, blockposobj: BlockPos): void;
}
declare function WRAP_JAVA(name: "ua.vsdum.sfrpe.Main"): typeof SFRPEMainJavaClass;