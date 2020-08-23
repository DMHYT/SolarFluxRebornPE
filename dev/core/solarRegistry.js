const SolarRegistry = {
    panelIDs: {},
    panelGUIs: {},
    panelStats: {},
    isPanel: function(id){
        return this.panelIDs[id];
    },
    registerPrototype: function(id, Prototype){
        this.panelIDs[id] = true;
        Prototype.onItemClick = Prototype.onItemClick || function(id, count, data, coords){
            if (id == ItemID.debugItem || id == ItemID.EUMeter) return false;
            if (this.click(id, count, data, coords)) return true;
            if (Entity.getSneaking(p)) return false;
            var gui = this.getGuiScreen();
            if (gui){
                this.container.openAs(gui);
                return true;
            }
        };
        if(Prototype.defaultValues){
            Prototype.defaultValues.canSeeSky = false;
            Prototype.defaultValues.energy = 0;
        } else Prototype.defaultValues = {canSeeSky: false, energy: 0};
        Prototype.upgrades = ["eff", "transf", "cap", "furn", "trav", "disp", "bcharge"];
        Prototype.init = function(){
            Prototype.data.canSeeSky = GenerationUtils.canSeeSky(Prototype.x, Prototype.y + 1, Prototype.z);
        },
        Prototype.getTransportSlots = function(){
            return {input: []};
        },
        Prototype.getTier = Prototype.getTier || function(){
            return 1;
        }
        if(!Prototype.getEnergyStorage){
            Prototype.getEnergyStorage = function(){
                return 0;
            };
        }
        Prototype.canReceiveEnergy = function(){
            return false;
        },
        Prototype.isEnergySource = function(){
            return true;
        };
        Prototype.isTeleporterCompatible = true;
        for(let e in energyTypes){
            EnergyTileRegistry.addEnergyTypeForId(id, energyTypes[e]);
        }
        ToolAPI.registerBlockMaterial(id, "stone", 1, true);
        Block.setDestroyTime(id, 20);
        TileEntity.registerPrototype(id, Prototype);
    },
    registerPanel: function(id, stats, header){
        this.panelStats[id] = {
            gen: stats.gen,
            output: stats.output,
            energy_storage: stats.energy_storage
        }
        this.panelGUIs[id] = new UI.StandartWindow({
            standart: {
                header: {text: {text: header}},
                inventory: {standart: true},
                background: {standart: true}
            },
            drawing: [{type: "bitmap", x: 720, y: 100, bitmap: "energy_bar_background", scale: GUI_SCALE}],
            elements: {
                "energyBarScale": {type: "scale", x: 800, y: 100, direction: 1, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
                "textStored": {type: "text", x: 350, y: 100, width: 300, height: 30, text: Translation.translate("Stored")+": 0 FE"},   
                "textCap": {type: "text", x: 350, y: 130, width: 300, height: 30, text: Translation.translate("Capacity")+": "+Math.round(this.panelStats[id].energy_storage)+" FE"},
                "textGen": {type: "text", x: 350, y: 160, width: 300, height: 30, text: Translation.translate("Generation")+": 0 FE/"+Translation.translate("tick")},
                "slotUpgrade1": {type: "slot", x: 350, y: 270, isValid: UpgradeAPI.isValidUpgrade},
                "slotUpgrade2": {type: "slot", x: 414, y: 270, isValid: UpgradeAPI.isValidUpgrade},
                "slotUpgrade3": {type: "slot", x: 480, y: 270, isValid: UpgradeAPI.isValidUpgrade},
                "slotUpgrade4": {type: "slot", x: 544, y: 270, isValid: UpgradeAPI.isValidUpgrade}, 
                "slotUpgrade5": {type: "slot", x: 610, y: 270, isValid: UpgradeAPI.isValidUpgrade},
                "slotCharge1": {type: "slot", x: 820, y: 100, bitmap: "charge_slot", isValid: function(id){return ChargeItemRegistry.getItemData(id)}},
            }
        });
        Callback.addCallback("LevelLoaded", function(){
            this.updateGuiHeader(this.panelGUIs[id], header);
        });
        this.registerPrototype(id, {
            defaultValues: {
                gen: SolarRegistry.panelStats[id].gen,
                output: SolarRegistry.panelStats[id].output,
                energy_storage: SolarRegistry.panelStats[id].energy_storage,
            },
            upgrades: ["eff", "transf", "cap", "trav", "disp", "bcharge", "furn"],
            getEnergyStorage: function(){
                return Math.round(this.data.energy_storage)
            },
            getGuiScreen: function(){
                return guiPanel[id]
            },
            resetValues: function(){
                this.data.gen = this.defaultValues.gen;
                this.data.output = this.defaultValues.output;
                this.data.energy_storage = this.defaultValues.energy_storage;
            },
            getItemEnergyType: function(){
                return ChargeItemRegistry.chargeData[this.container.getSlot("slotCharge1").id].energy;
            },
            tick: function(){
                this.resetValues();
                UpgradeAPI.executeUpgrades(this);
                var energyStorage = this.getEnergyStorage();
                if(World.getThreadTime()%100 == 0){
                    this.data.canSeeSky = GenerationUtils.canSeeSky(this.x, this.y + 1, this.z);
                }
                if(this.data.canSeeSky){
                    var time = World.getWorldTime()%24000;
                    if((time >= 23500 || time < 12550) && (!World.getWeather().rain || World.getLightLevel(this.x, this.y+1, this.z) > 14)){
                        this.data.energy = Math.min(this.data.energy + Math.round(this.data.gen), this.getEnergyStorage());
                        this.container.setText("textGen", Translation.translate("Generation")+": "+Math.round(this.data.gen)+" FE/"+Translation.translate("tick"));
                    }
                } else {
                    this.container.setText("textGen", Translation.translate("Generation")+" FE/"+Translation.translate("tick"));
                }
                let chSlot = this.container.getSlot("slotCharge1");
                switch(this.getItemEnergyType()){
                    case "Eu":
                        this.data.energy -= ChargeItemRegistry.addEnergyTo(chSlot, "Eu", this.data.energy, Math.min(Math.round(this.data.output, (ChargeItemRegistry.getItemData(chSlot.id).maxCharge - ChargeItemRegistry.getEnergyStored(chSlot)), this.data.energy)))*4;
                        break;
                    case "energyRF":
                        this.data.energy -= ChargeItemRegistry.addEnergyTo(chSlot, "energyRF", this.data.energy, Math.min(Math.round(this.data.output, (ChargeItemRegistry.getItemData(chSlot.id).maxCharge - ChargeItemRegistry.getEnergyStored(chSlot)), this.data.energy)));
                        break;
                    case "FE":
                        this.data.energy -= ChargeItemRegistry.addEnergyTo(chSlot, "FE", this.data.energy, Math.min(Math.round(this.data.output, (ChargeItemRegistry.getItemData(chSlot.id).maxCharge - ChargeItemRegistry.getEnergyStored(chSlot)), this.data.energy)));
                        break;
                }
                this.container.setScale("energyBarScale", this.data.energy / energyStorage);
                this.container.setText("textStored", Translation.translate("Stored")+": "+this.data.energy+" FE");
            },
            energyTick: function(){
                var output = Math.min(this.data.output, this.data.energy);
                switch(EnergyNetBuilder.getNetOnCoords(this.x, this.y, this.z).energyType){
                    case "Eu":
                        src.add(Math.floor(Math.min(output/4, 8192)));
                        break;
                    case "energyRF":
                    case "FE":
                        src.add(output);
                        break;
                }
            }
        });
        StorageInterface.createInterface(id, {
            slots: {
                "slotCharge1": {input: true}  
            },
            isValidInput: function(id){
                return ChargeItemRegistry.getItemData(id);
            }
        });
    },
    updateGuiHeader: function(gui, text){
        var header = gui.getWindow("header");
        header.contentProvider.drawing[1].text = Translation.translate(text);
    },
}