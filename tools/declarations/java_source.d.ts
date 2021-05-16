/// <reference path="./core-engine.d.ts" />

/**
 * DO NOT USE, ONLY VIA WRAP_JAVA
 */
declare class SFRPEMainJavaClass {

    public toLong(x: number, y: number, z: number): number;
    
    public fromLong(serialized: number, blockposobj: object): void;

}

declare function WRAP_JAVA(name: "ua.vsdum.sfrpe.Main"): typeof SFRPEMainJavaClass;