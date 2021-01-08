interface IChargeHandler<T extends AbstractCharge> {
    getID(): string;
    canCharge(stack: ItemInstance, charge: T): boolean;
    charge(stack: ItemInstance, charge: T, simulate: boolean): T;
}