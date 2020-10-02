//Source was from IC2PE, but it's reworked to make limits for each upgrade
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
    registerUpgrade: function(id, type, func, limit){
        this.data[id] = {type: type, func: func, limit: limit};
    },
    callUpgrade: function(item, machine, container, data){
        var upgrades = machine.upgrades;
        var upgrade = this.getUpgradeData(item.id);
        if(upgrade && (!upgrades || upgrades.indexOf(upgrade.type) != -1)){
            upgrade.func(item, machine, container, data);
        }
    },
    executeUpgrades: function(machine){
        let used = {};
        let container = machine.container;
        let data = machine.data;
        for(let i=1; i<=5; i++){
            let slot = container.getSlot("slotUpgrade"+i);
            if(!used[slot.id]){
                used[slot.id] = true;
                let item = {id: slot.id, count: slot.count, data: slot.data};
                this.callUpgrade(item, machine, container, data);
            }
        }
        StorageInterface.checkHoppers(machine);
    }
}