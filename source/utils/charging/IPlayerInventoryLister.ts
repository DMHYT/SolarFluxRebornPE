interface IPlayerInventoryLister {
    listItemHandlers(player: number, handlers: java.util.List<ForgeUtils.IItemHandlerModifiable>): void;
}