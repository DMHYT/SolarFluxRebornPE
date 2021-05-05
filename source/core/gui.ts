const createSolarGuiFor = (header: string) => {
    let offset: number = Math.floor((UI.getScreenHeight() - 440) / 2);
    return new UI.Window({
        location: { x: 0, y: 0, width: 1000, height: UI.getScreenHeight() },
        params: {},
        drawing: [
            {type: "background", color: android.graphics.Color.argb(90, 0, 0, 0)},
            {type: "bitmap", bitmap: "sfr.solarui", x: 275, y: offset, scale: 2.5},
            {type: "bitmap", bitmap: "sfr.bar_back", x: 660, y: offset + 100, scale: 2.5},
            {type: "bitmap", bitmap: "sfr.bar_back", x: 610, y: offset + 100, scale: 2.5}
        ],
        elements: (() => {
            let result: UI.ElementSet = {
                textHeader: {type: "text", x: 500, y: 10, font: {color: android.graphics.Color.WHITE, size: 25, alignment: UI.Font.ALIGN_CENTER}, text: header},
                energyBarScale: {type: "scale", x: 660, y: offset + 100, scale: 2.5, direction: 1, value: 0},
                sunBarScale: {type: "scale", x: 610, y: offset + 100, scale: 2.5, direction: 1, value: 0},
                textCharge: {type: "text", x: 290, y: offset + 20, width: 200, height: 25, font: {color: android.graphics.Color.BLACK, size: 25}, text: java.lang.String.format(Translation.translate("sfr.charge"), ["0"])},
                textCapacity: {type: "text", x: 290, y: offset + 45, width: 200, height: 25, font: {color: android.graphics.Color.BLACK, size: 25}, text: java.lang.String.format(Translation.translate("sfr.capacity"), ["0"])},
                textGeneration: {type: "text", x: 290, y: offset + 70, width: 200, height: 25, font: {color: android.graphics.Color.BLACK, size: 25}, text: java.lang.String.format(Translation.translate("sfr.generation"), ["0"])},
                textEfficiency: {type: "text", x: 290, y: offset + 95, width: 200, height: 25, font: {color: android.graphics.Color.BLACK, size: 25}, text: java.lang.String.format(Translation.translate("sfr.efficiency"), ["0"])},
                textInventory: {type: "text", x: 290, y: offset + 210, width: 200, height: 25, font: {color: android.graphics.Color.BLACK, size: 25}, text: Translation.translate("sfr.inventory")}
            }
            for(let i=0; i<5; i++) result["slotUpgrade"+i] = {type: "slot", x: 350 + 45 * i, y: offset + 130}

            return result;
        })()
    });
}