var ItemChargeHelper;
(function (ItemChargeHelper) {
    var CHARGE_HANDLERS = new java.util.HashMap();
    var CHARGE_HANDLERS_BY_ID = new java.util.HashMap();
    ItemChargeHelper.playerInvListers = new java.util.ArrayList();
    function handle(chargeType, handler) {
        CHARGE_HANDLERS.put(chargeType, handler);
        CHARGE_HANDLERS_BY_ID.put(handler.getID(), handler);
    }
    ItemChargeHelper.handle = handle;
    function getHandler(id) {
        if (typeof id === "string") {
            return CHARGE_HANDLERS_BY_ID.get(id);
        }
        else
            return CHARGE_HANDLERS.get(id.getClass());
    }
    ItemChargeHelper.getHandler = getHandler;
    function charge(stack, charge, simulate) {
        var h = getHandler(charge);
        if (h == null)
            return charge;
        return h.charge(stack, charge, simulate);
    }
    ItemChargeHelper.charge = charge;
    var I_TRUE = function (i) { return true; };
    function chargeInventory(inv, charge, simulate, sim) {
        if (typeof sim === "boolean") {
            var h = getHandler(charge);
            if (h == null)
                return charge;
            for (var i = 0; i < inv.getSizeInventory() && charge.containsCharge(); ++i) {
                if (charge.test(i) && h.canCharge(inv.getStackInSlot(i), charge)) {
                    charge = h.charge(inv.getStackInSlot(i), charge, sim);
                }
            }
            return charge;
        }
        else
            return chargeInventory(inv, I_TRUE, charge, simulate);
    }
    ItemChargeHelper.chargeInventory = chargeInventory;
    function chargePlayer(player, charge, simulate) {
        var h = getHandler(charge);
        if (h == null)
            return charge;
        var handlers = new java.util.ArrayList();
        ItemChargeHelper.playerInvListers.forEach(function (pil) { return pil.listItemHandlers(player, handlers); });
        var _loop_1 = function (j) {
            var handler = handlers.get(j);
            var _loop_2 = function (i) {
                if (h.canCharge(handler.getStackInSlot(i), charge)) {
                    var stack_1;
                    (function () {
                        var st = handler.getStackInSlot(i);
                        stack_1 = { id: st.id, count: st.count, data: st.data, extra: st.extra };
                    })();
                    charge = h.charge(stack_1, charge, simulate);
                    handler.setStackInSlot(i, stack_1);
                }
            };
            for (var i = 0; i < handler.getSlots() && charge.containsCharge(); ++i) {
                _loop_2(i);
            }
        };
        for (var j = 0; j < handlers.size() && charge.containsCharge(); ++j) {
            _loop_1(j);
        }
        return charge;
    }
    ItemChargeHelper.chargePlayer = chargePlayer;
})(ItemChargeHelper || (ItemChargeHelper = {}));
