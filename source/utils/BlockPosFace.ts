class BlockPosFace extends java.lang.Object {
    public readonly pos: MinecraftUtils.BlockPos;
    public readonly face: MinecraftUtils.EnumFacing;
    public readonly rate: number;
    constructor(pos: MinecraftUtils.BlockPos, face: MinecraftUtils.EnumFacing);
    constructor(pos: MinecraftUtils.BlockPos, face: MinecraftUtils.EnumFacing, rate: number);
    constructor(pos: MinecraftUtils.BlockPos, face: MinecraftUtils.EnumFacing, rate?: number){
        super();
        if(typeof rate === "number"){
            this.pos = pos, this.face = face, this.rate = rate;
        } else return new BlockPosFace(pos, face, 1);
    }
    public equals(obj: java.lang.Object): boolean {
        if(obj instanceof BlockPosFace){
            let bpf = obj as BlockPosFace;
            return java.util.Objects.equals(this.pos, bpf.pos) &&
                java.util.Objects.equals(this.face, bpf.face) && this.rate == bpf.rate;
        }; return false;
    }
}