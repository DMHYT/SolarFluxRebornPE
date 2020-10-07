function returnPanelElements(header, isEU, energyStorage){
    let elems = {
        "textHeader": {type: "text", x: 500, y: 30, font: {color: android.graphics.Color.WHITE, size: 25, alignment: UI.Font.ALIGN_CENTER}, text: header},
        "energyBarScale": {type: "scale", x: 648, y: 118, z: 1, scale: 3, direction: 1, value: 0.5, bitmap: "energy_bar_scale"},
        "textStored": {type: "text", x: 300, y: 65, z: 1, width: 300, height: 35, font: {color: android.graphics.Color.WHITE, size: 20}, text: Translation.translate("Stored")+": 0 "+(isEU ? "EU" : "FE")},
        "textCap": {type: "text", x: 300, y: 105, z: 1, width: 300, height: 35, font: {color: android.graphics.Color.WHITE, size: 20}, text: Translation.translate("Capacity")+": "+FANCYNUM(energyStorage)+" "+(isEU ? "EU" : "FE")},
        "textGen": {type: "text", x: 300, y: 145, z: 1, width: 300, height: 35, font: {color: android.graphics.Color.WHITE, size: 20}, text: Translation.translate("Generation")+": 0 "+(isEU ? "EU" : "FE")+"/"+Translation.translate("tick")},
        "slotCharge1": {type: "slot", x: 652, y: 65, z: 1, size: 45, isValid: function(id){
            return isEU ? ChargeItemRegistry.isValidItem(id, "Eu", 1) : ChargeItemRegistry.isValidItem(id, "RF", 1);
        }},
    };
    //upgrade slots
    for(let i=1; i<=5; i++){
        elems["slotUpgrade"+i] = {type: "slot", x: 299 + --i * 45, y: 228, z: 1, size: 45, isValid: UpgradeAPI.isValidUpgrade}
    }
    //inventory
    for(let i=0; i<9; i++){
        elems["invSlot"+i] = {type: "invSlot", x: 299 + i * 45, y: 433, z: 1, size: 45, index: i}
    }
    for(let i=9; i<36; i++){
        elems["invSlot"+i] = {type: "invSlot", x: 299 + (i % 9) * 45, y: 433 + Math.floor(i / 9) * 45, z: 1, index: i}
    }
    return elems;
}

const SolarRegistry = {
    panelIDs: {},
    panelGUIs: {},
    panelStats: {},
    isPanel: function(id){
        return this.panelIDs[id] && this.panelIDs[id].exists;
    },
    getIdentifierByPanel: function(id){
        if(this.isPanel(id)) return this.panelIDs[id].ident;
    },
    registerPanel: function(id, ident, stats, header, textures, isEU){
        this.panelIDs[id] = {};
        this.panelIDs[id].exists = true;
        this.panelIDs[id].ident = ident;
        let div = isEU ? 4 : 1;
        ToolAPI.registerBlockMaterial(id, "stone", 1, true);
        Block.setDestroyTime(id, 20);
        SolarConnector.createModelsForPanel(ident, textures.top, textures.base);
        SolarConnector.setConnectablePanel(id, ident);
        this.panelStats[ident] = {
            gen: Math.round(stats.gen / div),
            output: Math.round(stats.gen / div),
            energy_storage: Math.round(stats.gen / div)
        }
        this.panelGUIs[ident] = new UI.Window({
            location: { x: 0, y: 0, width: 1000, height: 520 },
            params: {},
            drawing: [
                {type: "background", color: android.graphics.Color.argb(90, 0, 0, 0)},
                {type: "bitmap", x: 282, y: 50, bitmap: "solarui", scale: 2.5},
                {type: "bitmap", x: 648, y: 118, z: 1, scale: 3, bitmap: "energy_bar_background"}
            ],
            elements: returnPanelElements(header, isEU, this.panelStats[ident].energy_storage)
        });
        TileEntity.registerPrototype(id, {
            useNetworkItemContainer: true,
            defaultValues: {
                gen: SolarRegistry.panelStats[ident].gen,
                output: SolarRegistry.panelStats[ident].output,
                energy_storage: SolarRegistry.panelStats[ident].energy_storage,
                canSeeSky: false,
                energy: 0,
                isActive: false,
                traversal: false,
                timer: 0,
                updateTimer: __config__.getNumber("panel_update_interval")
            },
            getScreenName: function(player, coords){
                return "main";
            },
            getScreenByName: function(screenName){
                return screenName == "main" ? SolarRegistry.panelGUIs[ident] : null;
            },
            upgrades: ["eff", "transf", "cap", "furn", "trav", "disp", "bcharge"],
            getEnergyStorage: function(){ return this.data.energy_storage },
            getTransportSlots: function(){ return {input: []}; },
            getTier: function(){ return 1; },
            canReceiveEnergy: function(){ return false; },
            isEnergySource: function(){ return true; },
            onItemClick: function(id, count, data, coords){
                if (id == ItemID.debugItem || id == ItemID.EUMeter) return false;
                if (PANEL_UPS.indexOf(id) !== -1) return false;
                if (this.click(id, count, data, coords)) return true;
                if (Entity.getSneaking(p)) return false;
                var gui = this.getGuiScreen();
                if (gui){
                    this.container.openAs(gui);
                    return true;
                }
            },
            setActive: function(isActive){
                if(this.data.isActive != isActive){
                    this.data.isActive = isActive;
                }
            },
            activate: function(){ this.setActive(true); },
            deactivate: function(){ this.setActive(false); },
            destroy: function(){ BlockRenderer.unmapAtCoords(this.x, this.y, this.z); },
            init: function(){
                this.data.canSeeSky = GenerationUtils.canSeeSky(this.x, this.y + 1, this.z);
                SolarConnector.update(this, ident);
            },
            resetValues: function(){
                this.data.gen = this.defaultValues.gen;
                this.data.output = this.defaultValues.output;
                this.data.energy_storage = this.defaultValues.energy_storage;
                this.data.traversal = this.defaultValues.traversal;
            },
            client: {
                tick: function(){
                    if(this.data.updateTimer > 1){
                        if (this.data.timer >= this.data.updateTimer){
                            this.data.timer = 0;
                        } else this.data.timer++;
                    }
                    if(this.data.timer == 0){
                        this.resetValues();
                        UpgradeAPI.executeUpgrades(this);
                        let chSlot = this.container.getSlot("slotCharge1");
                        if(World.getThreadTime()%100 == 0){
                            this.data.canSeeSky = GenerationUtils.canSeeSky(this.x, this.y + 1, this.z);
                        }
                        if(this.data.canSeeSky){
                            var time = World.getWorldTime()%24000;
                            if((time >= 23500 || time < 12550) && (!World.getWeather().rain || World.getLightLevel(this.x, this.y+1, this.z) > 14)){
                                this.data.energy = Math.min(this.data.energy + this.data.gen * this.data.updateTimer, this.getEnergyStorage());
                                this.container.setText("textGen", Translation.translate("Generation")+": "+FANCYNUM(Math.round(this.data.gen))+(isEU ? "EU" : "FE")+"/"+Translation.translate("tick"));
                            }
                        } else {
                            this.container.setText("textGen", Translation.translate("Generation")+(isEU ? "EU" : "FE")+"/"+Translation.translate("tick"));
                        }
                        this.data.energy -= ChargeItemRegistry.addEnergyTo(chSlot, (isEU ? "EU" : "RF"), Math.floor(this.data.energy));
                        this.container.setScale("energyBarScale", this.data.energy / this.getEnergyStorage());
                        this.container.setText("textStored", Translation.translate("Stored")+": "+FANCYNUM(this.data.energy)+" "+(isEU ? "EU" : "FE"));
                        this.container.setText("textCap", Translation.translate("Capacity")+": "+FANCYNUM(Math.round(this.data.energy_storage))+" "+(isEU ? "EU" : "FE"));
                        if(this.data.traversal) this.energyTick = this.defaultEnergyTick;
                    }
                    this.container.sendChanges();
                },
            },
            defaultEnergyTick: function(type, src){
                if(this.data.timer == 0){
                    let output = Math.min(this.data.output * this.data.updateTimer, this.data.energy, isEU ? 8192 : Infinity);
                    this.data.energy += src.add(output) - output;
                }
            },
            energyTick: this.defaultEnergyTick
        });
        isEU ?
        (function(){
            ICRender.getGroup("ic-wire").add(id, -1);
            EnergyTileRegistry.addEnergyTypeForId(id, EU);
        })() : (function(){
            ICRender.getGroup("rf-wire").add(id, -1);
            EnergyTileRegistry.addEnergyTypeForId(id, RF);
        })();
        StorageInterface.createInterface(id, {
            slots: {
                "slotCharge1": {input: true}  
            },
            isValidInput: function(id){
                return isEU ? ChargeItemRegistry.isValidItem(id, "Eu", 1) : ChargeItemRegistry.isValidItem(id, "RF", 1);
            }
        });
    }
};