const createSolarGuiFor = (header: string) => {
    const offset: number = Math.floor((UI.getScreenHeight() - 440) / 2);
    const win: UI.Window = new UI.Window({
        location: { x: 0, y: 0, width: 1000, height: UI.getScreenHeight() },
        params: {},
        drawing: [
            {type: "background", color: Color.argb(90, 0, 0, 0)},
            {type: "bitmap", bitmap: "sfr.solarui", x: 275, y: offset, scale: 2.5},
            {type: "bitmap", bitmap: "sfr.bar_back", x: 640, y: offset + 100, scale: 2.5},
            {type: "bitmap", bitmap: "sfr.bar_back", x: 590, y: offset + 100, scale: 2.5},
            {type: "bitmap", bitmap: "classic_frame_tab_right", x: 710, y: offset, scale: 2.5}
        ],
        elements: (() => {
            const result: UI.ElementSet = {
                textHeader: {type: "text", x: 500, y: -3, font: {color: Color.WHITE, size: 20, alignment: UI.Font.ALIGN_CENTER}, text: header},
                energyBarScale: {type: "scale", x: 590, y: offset + 100, scale: 2.5, direction: 1, value: 0, bitmap: "sfr.energy_bar_scale"},
                sunBarScale: {type: "scale", x: 640, y: offset + 100, scale: 2.5, direction: 1, value: 0, bitmap: "sfr.sun_bar_scale"},
                textCharge: {type: "text", x: 290, y: offset + 20, width: 200, height: 25, font: {color: Color.BLACK, size: 20}, text: JavaString.format(Translation.translate("info.solarflux.energy.stored1"), [Long.valueOf(0)])},
                textCapacity: {type: "text", x: 290, y: offset + 42, width: 200, height: 25, font: {color: Color.BLACK, size: 20}, text: JavaString.format(Translation.translate("info.solarflux.energy.capacity"), [Long.valueOf(0)])},
                textGeneration: {type: "text", x: 290, y: offset + 70, width: 200, height: 25, font: {color: Color.BLACK, size: 20}, text: JavaString.format(Translation.translate("info.solarflux.energy.generation"), [Long.valueOf(0)])},
                textEfficiency: {type: "text", x: 290, y: offset + 95, width: 200, height: 25, font: {color: Color.BLACK, size: 20}, text: JavaString.format(Translation.translate("info.solarflux.energy.efficiency"), [JavaInt.valueOf(0)])},
                textInventory: {type: "text", x: 290, y: offset + 210, width: 200, height: 25, font: {color: Color.BLACK, size: 20}, text: Translation.translate("sfr.inventory")},
                slotCharge: {type: "slot", x: 640, y: offset + 20, bitmap: "sfr.charge_slot", size: 45, isValid: (id) => ChargeItemRegistry.isValidItem(id, "RF", 1), visual: false},
                closeButton: {type: "closeButton", bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 3, x: 710, y: offset}
            }
            for(let i=0; i<5; i++) result[`slotUpgrade${i}`] = {type: "slot", x: 320 + 45 * i, y: offset + 140, size: 45, isValid: (id, count, data, container, item) => SolarUpgrades.isUpgrade(id) && SolarUpgrades.getUpgrade(id).canInstall(container.getParent(), item, new ItemContainer(container)), visual: false};
            for(let i=0; i<9; i++) result[`invSlot${i}`] = {type: "invSlot", x: 293 + 45 * i, y: offset + 386, size: 45, index: i};
            for(let i=9; i<36; i++) result[`invSlot${i}`] = {type: "invSlot", x: 293 + 45 * (i % 9), y: offset + 196 + Math.floor(i / 9) * 45, size: 45, index: i};
            return result;
        })()
    });
    win.setInventoryNeeded(true);
    win.setCloseOnBackPressed(true);
    return win;
}