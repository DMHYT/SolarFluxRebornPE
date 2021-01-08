namespace ItemChargeHelper {
    const CHARGE_HANDLERS: java.util.Map<java.lang.Class<AbstractCharge>, IChargeHandler<any>> = new java.util.HashMap();
    const CHARGE_HANDLERS_BY_ID: java.util.Map<string, IChargeHandler<any>> = new java.util.HashMap();
    export const playerInvListers: java.util.List<IPlayerInventoryLister> = new java.util.ArrayList();
    export function handle<T extends AbstractCharge>(chargeType: java.lang.Class<T>, handler: IChargeHandler<T>): void {
        CHARGE_HANDLERS.put(chargeType, handler);
        CHARGE_HANDLERS_BY_ID.put(handler.getID(), handler);
    }
    export function getHandler<T extends AbstractCharge>(id: string): IChargeHandler<T>;
    export function getHandler<T extends AbstractCharge>(charge: T): IChargeHandler<T>;
    export function getHandler<T extends AbstractCharge>(id: string | T): IChargeHandler<T> {
        if(typeof id === "string"){
            return CHARGE_HANDLERS_BY_ID.get(id);
        } else return CHARGE_HANDLERS.get((id as T).getClass());
    }
    export function charge<T extends AbstractCharge>(stack: ItemInstance, charge: T, simulate: boolean): T {
        let h: IChargeHandler<T> = getHandler(charge);
        if(h == null) return charge;
        return h.charge(stack, charge, simulate);
    }
    const I_TRUE: (i: number) => boolean = (i: number) => true;
    export function chargeInventory<T extends AbstractCharge>(inv: any, charge: T, simulate: boolean): T;
    export function chargeInventory<T extends AbstractCharge>(inv: any, chargeSlot: any, charge: T, simulate: boolean): T;
    export function chargeInventory<T extends AbstractCharge>(inv: any, charge: T | any, simulate: boolean | T, sim?: boolean): T {
        if(typeof sim === "boolean"){
            let h: IChargeHandler<T> = getHandler(charge);
            if(h == null) return charge;
            for(let i=0; i<inv.getSizeInventory() && (charge as T).containsCharge(); ++i){
                if(charge.test(i) && h.canCharge(inv.getStackInSlot(i), charge)){
                    charge = h.charge(inv.getStackInSlot(i), charge, sim);
                }
            }
            return charge;
        } else return chargeInventory(inv, I_TRUE, charge, simulate as boolean);
    }
    export function chargePlayer<T extends AbstractCharge>(player: number, charge: T, simulate: boolean): T {
        let h: IChargeHandler<T> = getHandler(charge);
        if(h == null) return charge;
        let handlers: java.util.List<ForgeUtils.IItemHandlerModifiable> = new java.util.ArrayList();
        playerInvListers.forEach((pil: IPlayerInventoryLister) => pil.listItemHandlers(player, handlers));
        for(let j=0; j<handlers.size() && charge.containsCharge(); ++j){
            let handler: ForgeUtils.IItemHandlerModifiable = handlers.get(j);
            for(let i=0; i<handler.getSlots() && charge.containsCharge(); ++i){
                if(h.canCharge(handler.getStackInSlot(i), charge)){
                    let stack: ItemInstance;
                    (function(){
                        let st: ItemInstance = handler.getStackInSlot(i);
                        stack = {id: st.id, count: st.count, data: st.data, extra: st.extra};
                    })();
                    charge = h.charge(stack, charge, simulate);
                    handler.setStackInSlot(i, stack);
                }
            }
        }
        return charge;
    }
}