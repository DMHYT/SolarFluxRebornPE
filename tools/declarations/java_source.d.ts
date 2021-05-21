/// <reference path="./core-engine.d.ts" />

declare interface BlockPos extends Vector {
    readonly dimension: number;
}

declare interface BlockPosFace extends BlockPos {
    readonly side: number;
    readonly rate: number;
}

/**
 * DO NOT USE, ONLY VIA WRAP_JAVA
 */
declare class SFRPEMainJavaClass {

    public toLong(x: number, y: number, z: number): number;
    
    public fromLong(serialized: number, blockposobj: BlockPos): void;

}

declare function WRAP_JAVA(name: "ua.vsdum.sfrpe.Main"): typeof SFRPEMainJavaClass;