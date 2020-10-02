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
        this.panelGUIs[ident] = new UI.StandartWindow({
            standart: {
                header: {text: {text: header}},
                inventory: {standart: true},
                background: {standart: true}
            },
            drawing: [{type: "bitmap", x: 720, y: 100, bitmap: "energy_bar_background", scale: GUI_SCALE}],
            elements: {
                "energyBarScale": {type: "scale", x: 720, y: 100, direction: 1, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
                "textStored": {type: "text", x: 350, y: 100, width: 300, height: 30, text: Translation.translate("Stored")+": 0 "+(isEU ? "EU" : "FE")},   
                "textCap": {type: "text", x: 350, y: 130, width: 300, height: 30, text: Translation.translate("Capacity")+": "+FANCYNUM(this.panelStats[ident].energy_storage)+" "+(isEU ? "EU" : "FE")},
                "textGen": {type: "text", x: 350, y: 160, width: 300, height: 30, text: Translation.translate("Generation")+": 0 "+(isEU ? "EU" : "FE")+"/"+Translation.translate("tick")},
                "slotUpgrade1": {type: "slot", x: 350, y: 270, isValid: UpgradeAPI.isValidUpgrade},
                "slotUpgrade2": {type: "slot", x: 414, y: 270, isValid: UpgradeAPI.isValidUpgrade},
                "slotUpgrade3": {type: "slot", x: 480, y: 270, isValid: UpgradeAPI.isValidUpgrade},
                "slotUpgrade4": {type: "slot", x: 544, y: 270, isValid: UpgradeAPI.isValidUpgrade}, 
                "slotUpgrade5": {type: "slot", x: 610, y: 270, isValid: UpgradeAPI.isValidUpgrade},
                "slotCharge1": {type: "slot", x: 820, y: 100, bitmap: "charge_slot", isValid: (
                    isEU ? function(id){ return ChargeItemRegistry.isValidItem(id, "Eu", 1); } :
                        function(id){ return ChargeItemRegistry.isValidItem(id, "RF", 1); }
                )}
            }
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
            isValidInput: isEU ? 
                function(id){ return ChargeItemRegistry.isValidItem(id, "Eu", 1); } :
                function(id){ return ChargeItemRegistry.isValidItem(id, "RF", 1) },
        });
    }
};