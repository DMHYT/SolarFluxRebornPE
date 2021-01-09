/**
 * Just a remake of TileEntity interface into a class
 * for more convenient work with other TE classes
 */
class TEClass implements TileEntity.TileEntityPrototype, TileEntity {
    useNetworkItemContainer?: boolean;
    defaultValues?: { [key: string]: any };
	created?: () => void;
    client?: {
        load?(): void,
        unload?(): void,
        tick?(): void,
        events?: {
            [packetName: string]: (packetData: any, packetExtra: any) => void;
        },
        containerEvents?: {
            [eventName: string]: 
            (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.TabbedWindow | null, 
             windowContent: UI.WindowContent | null, eventData: any) => void;
        }
    };
    events?: {
        [packetName: string]: (packetData: any, packetExtra: any, connectedClient: NetworkClient) => void;
    };
    containerEvents?: {
        [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.TabbedWindow | null, windowContent: UI.WindowContent | null, eventData: any) => void;
    }
    init?(): void;
    tick?(): void;
    click?(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData): boolean | void;
    destroyBlock?: (coords: Callback.ItemUseCoordinates, player: number) => void;
    redstone?: (params: { power: number, signal: number, onLoad: boolean }) => void;
    projectileHit?: (coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget) => void;
    destroy?(): boolean | void;
    getScreenName?: (player: number, coords: Vector) => string;
    getScreenByName?: (screenName?: string) => UI.Window | UI.StandartWindow | UI.TabbedWindow;
    requireMoreLiquid?: (liquid: string, amount: number) => void;
    [key: string]: any
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly dimension: number;
    data: {[key: string]: any};
    container: ItemContainer | UI.Container;
    liquidStorage: any;
    selfDestroy: () => void;
    sendPacket: (name: string, data: object) => void;
    blockSource: BlockSource;
    networkData: SyncedNetworkData;
    networkEntity: NetworkEntity;
    sendResponse: (packetName: string, someData: object) => void;
    /**Helping stuff */
    private readonly pos: MinecraftUtils.BlockPos;
    public getPos(): MinecraftUtils.BlockPos {return this.pos};
    constructor(){this.pos = new MinecraftUtils.BlockPos(this.x, this.y, this.z)};
}