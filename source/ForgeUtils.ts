namespace ForgeUtils {
    export interface IItemHandler {
        getSlots(): number;
        getStackInSlot(slot: number): NonNullable<ItemInstance>;
        insertItem(slot: number, stack: NonNullable<ItemInstance>, simulate: boolean): NonNullable<ItemInstance>;
        extractItem(slot: number, amount: number, simulate: boolean): NonNullable<ItemInstance>;
        getSlotLimit(slot: number): number;
        isItemValid(slot: number, stack: NonNullable<ItemInstance>): boolean;
    }
    export interface IItemHandlerModifiable extends IItemHandler {
        setStackInSlot(slot: number, stack: NonNullable<ItemInstance>): void;
    }
}