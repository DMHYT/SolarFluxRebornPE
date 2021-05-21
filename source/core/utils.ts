namespace SunUtils {

    export function calculateCelestialAngle(worldTime: number, partialTicks: number): number {
        let i: number = worldTime % 24000;
        let f: number = (i + partialTicks) / 24000 - 0.25;
        if(f < 0) ++f;
        if(f > 1) --f;
        let f1: number = 1 - (Math.cos(f * Math.PI) + 1) / 2;
        f += (f1 - f) / 3;
        return f;
    }

    export function getCelestialAngle(partialTicks: number): number {
        return calculateCelestialAngle(World.getWorldTime(), partialTicks);
    }

    export function getCelestialAngleRadians(partialTicks: number): number {
        return getCelestialAngle(partialTicks) * Math.PI * 2;
    }
    
}

Network.addClientPacket("sfr.anvil", (packetData: Vector) => {
    World.playSound(packetData.x, packetData.y, packetData.z, "random.anvil_land", .1, 1);
});
Network.addClientPacket("sfr.levelup", (packetData: Vector) => {
    World.playSound(packetData.x, packetData.y, packetData.z, "random.levelup", .25, 1.8);
});

namespace Sounds {

    export function anvil(x: number, y: number, z: number, dimension: number){
        new NetworkConnectedClientList()
            .setupDistancePolicy(x, y, z, dimension, 64)
            .send("sfr.anvil", {x: x, y: y, z: z} as Vector);
    }

    export function levelup(x: number, y: number, z: number, dimension: number){
        new NetworkConnectedClientList()
            .setupDistancePolicy(x, y, z, dimension, 64)
            .send("sfr.levelup", {x: x, y: y, z: z} as Vector);
    }

}

namespace BlockPosUtils {
    
    export function BlockPosFaceFromBlockPos(bp: BlockPos, side: number, rate?: number): BlockPosFace {
        return {x: bp.x, y: bp.y, z: bp.z, dimension: bp.dimension, side: side, rate: rate ?? 1};
    }

    export function offset(pos: BlockPos, face: number): BlockPos {
        switch(face){
            case EBlockSide.NORTH: pos.z -= 1; break;
            case EBlockSide.SOUTH: pos.z += 1; break;
            case EBlockSide.EAST: pos.x += 1; break;
            case EBlockSide.WEST: pos.x -= 1; break;
            case EBlockSide.UP: pos.y += 1; break;
            case EBlockSide.DOWN: pos.y -= 1; break;
            default: throw new java.lang.IllegalArgumentException(`Illegal block face id ${face}`);
        }
        return pos;
    }

    export function oppositeFace(face: number): number {
        switch(face){
            case EBlockSide.NORTH: return EBlockSide.SOUTH;
            case EBlockSide.SOUTH: return EBlockSide.NORTH;
            case EBlockSide.EAST: return EBlockSide.WEST;
            case EBlockSide.WEST: return EBlockSide.EAST;
            case EBlockSide.UP: return EBlockSide.DOWN;
            case EBlockSide.DOWN: return EBlockSide.UP;
            default: throw new java.lang.IllegalArgumentException(`Illegal block face id ${face}`);
        }
    }

    export function distanceSq(b1: BlockPos, b2: BlockPos): number {
        return Math.pow(b2.x - b1.x, 2) + Math.pow(b2.y - b1.y, 2) + Math.pow(b2.z - b1.z, 2);
    }

    export function distance(b1: BlockPos, b2: BlockPos): number {
        return Math.sqrt(distanceSq(b1, b2));
    }

    export function fromLong(serialized: number): BlockPos {
        let pos = {} as BlockPos;
        JavaMath.fromLong(serialized, pos);
        return pos;
    }

    export function fromEntity(entity: number): BlockPos {
        let pos: Vector = Entity.getPosition(entity);
        return {x: pos.x, y: pos.y, z: pos.z, dimension: Entity.getDimension(entity)};
    }

    export function fromTile(tile: TileEntity): BlockPos {
        return {x: tile.x, y: tile.y, z: tile.z, dimension: tile.dimension};
    }

}

namespace Traversal {

    export const cache: java.util.List<BlockPos> = new java.util.ArrayList<BlockPos>();

    export function update(tile: SFRTile.PanelTile): void {
        if(World.getWorldTime() % 20 == 0){
            cache.clear();
            tile.data.traversal.clear();
            cache.add({x: tile.x, y: tile.y, z: tile.z});
            findMachines(tile, cache, tile.data.traversal);
        }
    }

    export function findMachines(tile: SFRTile.PanelTile, cache: java.util.List<BlockPos>, acceptors: java.util.List<BlockPosFace>): void {
        for(let i=0; i<cache.size(); i++){
            let pos: BlockPos = cache.get(i);
            for(let face of [0, 1, 2, 3, 4, 5]){
                let p: BlockPos = BlockPosUtils.offset(pos, face);
                if(BlockPosUtils.distance(p, cache.get(0)) > 25) continue;
                let t: TileEntity = TileEntity.getTileEntity(p.x, p.y, p.z, tile.blockSource);
                if(t != null && t.isMachine){
                    let e: EnergyTile = t as EnergyTile;
                    if(e.canReceiveEnergy(BlockPosUtils.oppositeFace(face), "Eu") || e.canReceiveEnergy(BlockPosUtils.oppositeFace(face), "RF") || e.canReceiveEnergy(BlockPosUtils.oppositeFace(face), "FE")){
                        if(!cache.contains(p)){
                            cache.add(p);
                            acceptors.add({x: p.x, y: p.y, z: p.z, dimension: p.dimension, side: BlockPosUtils.oppositeFace(face), rate: 1} as BlockPosFace);
                        }
                    }
                }
            }
        }
    }

}