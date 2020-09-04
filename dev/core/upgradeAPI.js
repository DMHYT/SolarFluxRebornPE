var UpgradeAPI = {
    data: {},
    
    getUpgradeData: function(id){
        return this.data[id];
    },
    
    isUpgrade: function(id){
        return UpgradeAPI.data[id]? true : false;
    },
    
    isValidUpgrade: function(id, count, data, container){
        var upgrades = container.tileEntity.upgrades;
        var upgradeData = UpgradeAPI.getUpgradeData(id);
        if(upgradeData && (!upgrades || upgrades.indexOf(upgradeData.type) != -1)){
            return true;
        }
        return false;
    },

    registerUpgrade: function(id, type, func){
        this.data[id] = {type: type, func: func};
    },

    callUpgrade: function(item, machine, container, data){
        var upgrades = machine.upgrades;
        var upgrade = this.getUpgradeData(item.id);
        if(upgrade && (!upgrades || upgrades.indexOf(upgrade.type) != -1)){
            upgrade.func(item, machine, container, data);
        }
    },
    
    getUpgrades: function(machine, container){
        var upgrades = [];
        for(var i=1; i<6; i++){   
            var slot = container.getSlot("slotUpgrade"+i);
            if(slot.id > 0){
                var find = false;
                for(var i in upgrades){
                    var item = upgrades[i];
                    if(item.id == slot.id && item.data == slot.data){
                        item.count += slot.count;
                        find = true;
                        break;
                    }
                }
                if(!find){
                    item = {id: slot.id, count: slot.count, data: slot.data};
                    upgrades.push(item);
                }
            }
            
        }
        return upgrades;
    },

    executeUpgrades: function(machine){
        var container = machine.container;
        var data = machine.data;
        var upgrades = this.getUpgrades(machine, container);
        for(var i in upgrades){
            this.callUpgrade(upgrades[i], machine, container, data);
        }
        StorageInterface.checkHoppers(machine);
    },

    //my func
    findUpgrade: function(container, id){
        for(let i in container.slots){
            let slot = container.slots[i];
            if(slot.startsWith("slotUpgrade")){
                if(slot.id==id){
                    return true;
                }
            }
        }
        return false;
    }
}