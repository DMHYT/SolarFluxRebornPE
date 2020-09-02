const panelProto = {
    upgrades: ["eff", "transf", "cap", "furn", "trav", "disp", "bcharge"],
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
    resetValues: function(){
        this.data.gen = this.defaultValues.gen;
        this.data.output = this.defaultValues.output;
        this.data.energy_storage = this.defaultValues.energy_storage;
        this.energyTick = this.defaultEnergyTick;
    },
    getItemEnergyType: function(){
        return ChargeItemRegistry.chargeData[this.container.getSlot("slotCharge1").id].energy;
    },
    tick: function(){
        this.resetValues();
        UpgradeAPI.executeUpgrades(this);
        if(World.getThreadTime()%100 == 0){
            this.data.canSeeSky = GenerationUtils.canSeeSky(this.x, this.y + 1, this.z);
        }
        if(this.data.canSeeSky){
            var time = World.getWorldTime()%24000;
            if((time >= 23500 || time < 12550) && (!World.getWeather().rain || World.getLightLevel(this.x, this.y+1, this.z) > 14)){
                this.data.energy = Math.min(this.data.energy + this.data.gen, this.getEnergyStorage());
                this.container.setText("textGen", Translation.translate("Generation")+": "+Math.round(this.data.gen)+" FE/"+Translation.translate("tick"));
            }
        } else {
            this.container.setText("textGen", Translation.translate("Generation")+" FE/"+Translation.translate("tick"));
        }
        if(chSlot.id!==0){
            let ratio = EnergyTypeRegistry.getValueRatio(this.getItemEnergyType(), "FE");
            this.data.energy -= ChargeItemRegistry.addEnergyTo(chSlot, this.getItemEnergyType(), Math.floor(this.data.energy / ratio)) * ratio;
        }
        this.container.setScale("energyBarScale", this.data.energy / this.getEnergyStorage());
        this.container.setText("textStored", Translation.translate("Stored")+": "+this.data.energy+" FE");
        this.container.setText("textCap", Translation.translate("Capacity")+": "+Math.round(this.data.energy_storage)+" FE");
    },
    defaultEnergyTick: function(){
        var output = Math.min(this.data.output, this.data.energy);
        let ratio = EnergyTypeRegistry.getValueRatio(EnergyNetBuilder.getNetOnCoords(this.x, this.y, this.z), "FE");
        this.data.energy += src.add(output * ratio) - (output * ratio);
    },
    energyTick: function(){
        var output = Math.min(this.data.output, this.data.energy);
        let ratio = EnergyTypeRegistry.getValueRatio(EnergyNetBuilder.getNetOnCoords(this.x, this.y, this.z), "FE");
        this.data.energy += src.add(output * ratio) - (output * ratio);
    }
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
    registerPanel: function(id, ident, stats, header, textures){
        this.panelIDs[id] = {};
        this.panelIDs[id].exists = true;
        this.panelIDs[id].ident = ident;
        ToolAPI.registerBlockMaterial(id, "stone", 1, true);
        Block.setDestroyTime(id, 20);
        SolarConnector.createModelsForPanel(ident, textures.top, textures.base);
        SolarConnector.setConnectablePanel(id, ident);
        this.panelStats[ident] = {
            gen: stats.gen,
            output: stats.output,
            energy_storage: stats.energy_storage
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
                "textStored": {type: "text", x: 350, y: 100, width: 300, height: 30, text: Translation.translate("Stored")+": 0 FE"},   
                "textCap": {type: "text", x: 350, y: 130, width: 300, height: 30, text: Translation.translate("Capacity")+": "+Math.round(this.panelStats[ident].energy_storage)+" FE"},
                "textGen": {type: "text", x: 350, y: 160, width: 300, height: 30, text: Translation.translate("Generation")+": 0 FE/"+Translation.translate("tick")},
                "slotUpgrade1": {type: "slot", x: 350, y: 270, isValid: UpgradeAPI.isValidUpgrade},
                "slotUpgrade2": {type: "slot", x: 414, y: 270, isValid: UpgradeAPI.isValidUpgrade},
                "slotUpgrade3": {type: "slot", x: 480, y: 270, isValid: UpgradeAPI.isValidUpgrade},
                "slotUpgrade4": {type: "slot", x: 544, y: 270, isValid: UpgradeAPI.isValidUpgrade}, 
                "slotUpgrade5": {type: "slot", x: 610, y: 270, isValid: UpgradeAPI.isValidUpgrade},
                "slotCharge1": {type: "slot", x: 820, y: 100, bitmap: "charge_slot", isValid: validChargeItem},
            }
        });
        Callback.addCallback("LevelLoaded", function(){
            SolarRegistry.updateGuiHeader(SolarRegistry.panelGUIs[ident], header);
        });
        TileEntity.registerPrototype(id, {
            defaultValues: {
                gen: SolarRegistry.panelStats[ident].gen,
                output: SolarRegistry.panelStats[ident].output,
                energy_storage: SolarRegistry.panelStats[ident].energy_storage,
                canSeeSky: false,
                energy: 0,
                isActive: false
            },
            getGuiScreen: function(){ return SolarRegistry.panelGUIs[ident]; },
            upgrades: panelProto.upgrades,
            getEnergyStorage: function(){ return this.data.energy_storage },
            getTransportSlots: panelProto.getTransportSlots,
            getTier: panelProto.getTier,
            canReceiveEnergy: panelProto.canReceiveEnergy,
            isEnergySource: panelProto.isEnergySource,
            onItemClick: panelProto.onItemClick,
            setActive: panelProto.setActive,
            activate: panelProto.activate,
            deactivate: panelProto.deactivate,
            destroy: panelProto.destroy,
            connect: panelProto.connect,
            init: function(){
                this.data.canSeeSky = GenerationUtils.canSeeSky(this.x, this.y + 1, this.z);
                SolarConnector.update(this, ident);
                this.connect();
            },
            resetValues: panelProto.resetValues,
            getItemEnergyType: panelProto.getItemEnergyType,
            tick: panelProto.tick,
            defaultEnergyTick: panelProto.defaultEnergyTick,
            energyTick: panelProto.energyTick
        });
        EnergyTileRegistry.addEnergyTypeForId(id, FE);
        EnergyTileRegistry.addEnergyTypeForId(id, EU);
        EnergyTileRegistry.addEnergyTypeForId(id, RF);
        EnergyTileRegistry.addEnergyTypeForId(id, BT);
        EnergyTileRegistry.addEnergyTypeForId(id, QE);
        StorageInterface.createInterface(id, {
            slots: {
                "slotCharge1": {input: true}  
            },
            isValidInput: validChargeItem
        });
    },
    setActive: function(isActive){
		if(this.data.isActive != isActive){
			this.data.isActive = isActive;
		}
	},
    updateGuiHeader: function(gui, text){
        var header = gui.getWindow("header");
        header.contentProvider.drawing[1].text = Translation.translate(text);
    }
};