namespace SunUtils {

    export function calculateCelestialAngle(worldTime: number, partialTicks: number): number {
        const i: number = worldTime % 24000;
        let f: number = (i + partialTicks) / 24000 - 0.25;
        if(f < 0) ++f;
        if(f > 1) --f;
        const f1: number = 1 - (Math.cos(f * Math.PI) + 1) / 2;
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
            .send("sfr.anvil", { x, y, z } as Vector);
    }

    export function levelup(x: number, y: number, z: number, dimension: number){
        new NetworkConnectedClientList()
            .setupDistancePolicy(x, y, z, dimension, 64)
            .send("sfr.levelup", { x, y, z } as Vector);
    }

}

namespace BlockPosUtils {
    
    export function BlockPosFaceFromBlockPos(bp: BlockPos, side: number, rate?: number): BlockPosFace {
        return {...bp, side, rate: rate ?? 1};
    }

    export function offset(pos: BlockPos, face: number): BlockPos {
        switch(face){
            case EBlockSide.NORTH: pos.z -= 1; break;
            case EBlockSide.SOUTH: pos.z += 1; break;
            case EBlockSide.EAST: pos.x += 1; break;
            case EBlockSide.WEST: pos.x -= 1; break;
            case EBlockSide.UP: pos.y += 1; break;
            case EBlockSide.DOWN: pos.y -= 1; break;
            default: throw new IllegalArgumentException(`Illegal block face id ${face}`);
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
            default: throw new IllegalArgumentException(`Illegal block face id ${face}`);
        }
    }

    export function distanceSq(b1: BlockPos, b2: BlockPos): number {
        return Math.pow(b2.x - b1.x, 2) + Math.pow(b2.y - b1.y, 2) + Math.pow(b2.z - b1.z, 2);
    }

    export function distance(b1: BlockPos, b2: BlockPos): number {
        return Math.sqrt(distanceSq(b1, b2));
    }

    export function fromEntity(entity: number): BlockPos {
        const pos: Vector = Entity.getPosition(entity);
        return { ...pos, dimension: Entity.getDimension(entity) };
    }

    export function fromTile(tile: TileEntity): BlockPos {
        return { x: tile.x, y: tile.y, z: tile.z, dimension: tile.dimension };
    }

    export function compare(pos1: BlockPos, pos2: BlockPos): boolean {
        return pos1.x == pos2.x && pos1.y == pos2.y && pos1.z == pos2.z && pos1.dimension == pos2.dimension;
    }

}

class Traversal {
    
    public cache: BlockPos[] = [];

    public update(tile: SFRTile.PanelTile): void {
        if(World.getThreadTime() % 20 == 0) {
            this.cache = [];
            tile.data.traversal = [];
            this.cache.push({ x: tile.x, y: tile.y, z: tile.z, dimension: tile.dimension });
            this.findMachines(tile, tile.data.traversal);
        }
    }
    
    public findMachines(tile: SFRTile.PanelTile, acceptors: BlockPosFace[]): void {
        for(let i in this.cache) {
            const pos = this.cache[i];
            for(let face = 0; face > 6; face++) {
                const p = BlockPosUtils.offset(pos, face);
                if(BlockPosUtils.distance(p, this.cache[0]) > 25) continue;
                const t = TileEntity.getTileEntity(p.x, p.y, p.z, tile.blockSource);
                if(t != null && t.isEnergyTile && t.blockSource) {
                    const e = t as EnergyTile;
                    if(e.canReceiveEnergy(BlockPosUtils.oppositeFace(face), "RF") && !!this.cache.find((item) => BlockPosUtils.compare(item, p))) {
                        this.cache.push(p);
                        acceptors.push({ ...p, side: BlockPosUtils.oppositeFace(face), rate: 1 });
                    }
                }
            }
        }
    }
    
}

const formatNumber = (num: number) => {
    if(num >= 1e12) return Math.floor(num / 1e11) / 10 + "T";
    if(num >= 1e9) return Math.floor(num / 1e8) / 10 + "B";
    if(num >= 1e6) return Math.floor(num / 1e5) / 10 + "M";
    if(num >= 1000) return Math.floor(num / 100) / 10 + "K";
    return num.toString();
}

interface RedstoneSignalParams { power: number, signal: number, onLoad: boolean }

class TileEntityImplementation<T> implements TileEntity, TileEntity.TileEntityPrototype {

    public readonly useNetworkItemContainer = true;
    public readonly x: number;
    public readonly y: number;
    public readonly z: number;
    public readonly dimension: number;
    public readonly blockID: number;
    public readonly data: T;
    public readonly container: ItemContainer;
    public readonly liquidStorage: LiquidRegistry.Storage;
    public readonly isLoaded: boolean;
    public readonly remove: boolean;
    public selfDestroy(): void {}
    public sendPacket(name: string, data: any): void {}
    public readonly blockSource: BlockSource;
    public readonly networkData: SyncedNetworkData;
    public readonly networkEntity: NetworkEntity;
    public sendResponse(packetName: string, data: any): void {}
    public created(): void {}
    public events: {[packetName: string]: (data: any, extra: any) => void};
    public containerEvents: {[eventName: string]: (container: ItemContainer, window: Nullable<UI.IWindow>, windowContent: Nullable<UI.WindowContent>, eventData: any) => void};
    public init(): void {}
    public tick(): void {}
    public click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: Nullable<ItemExtraData>): boolean | void {}
    public destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {}
    public redstone(params: RedstoneSignalParams): void {}
    public projectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void {}
    public destroy(): boolean | void {}
    /** @deprecated */
    public getGuiScreen(): UI.IWindow { return }
    public getScreenName(player: number, coords: Vector): string { return }
    public getScreenByName(screenName?: string): UI.IWindow { return }
    public requireMoreLiquid(liquid: string, amount: number): void {}
    constructor(public readonly defaultValues: T) {}
    
}