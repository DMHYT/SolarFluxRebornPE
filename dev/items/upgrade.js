IDRegistry.genItemID("upgradeBlank");
IDRegistry.genItemID("upgradeEff");
IDRegistry.genItemID("upgradeTransf");
IDRegistry.genItemID("upgradeCap");
IDRegistry.genItemID("upgradeFurn");
IDRegistry.genItemID("upgradeTrav");
IDRegistry.genItemID("upgradeDisp");

Item.createItem("upgradeBlank", "Upgrade Blank", {name: "blank", meta: 0}, {stack: 64});
Item.createItem("upgradeEff", "Efficiency Upgrade", {name: "eff", meta: 0}, {stack: 20});
Item.createItem("upgradeTransf", "Transfer Rate Upgrade", {name: "transf", meta: 0}, {stack: 10});
Item.createItem("upgradeCap", "Capacity Upgrade", {name: "cap", meta: 0}, {stack: 10});
Item.createItem("upgradeFurn", "Furnace Upgrade", {name: "furn", meta: 0}, {stack: 1});
Item.createItem("upgradeTrav", "Traversal Upgrade", {name: "trav", meta: 0}, {stack: 1});
Item.createItem("upgradeDisp", "Dispersive Upgrade", {name: "disp", meta: 0}, {stack: 1});

UpgradeAPI.registerUpgrade(ItemID.upgradeEff, "eff", function(item, machine, container, data){
    if(data.gen) data.gen = Math.round(data.gen+(data.gen*0.05*item.count));
});

UpgradeAPI.registerUpgrade(ItemID.upgradeTransf, "transf", function(item, machine, container, data){
    if(data.gen) data.output = Math.round(data.output+(data.output*0.25*item.count));
});

UpgradeAPI.registerUpgrade(ItemID.upgradeCap, "cap", function(item, machine, container, data){
    if(data.gen) data.energy_storage = Math.round(data.energy_storage+(data.energy_storage*0.1*item.count));
});

UpgradeAPI.registerUpgrade(ItemID.upgradeFurn, "furn", function(item, machine, container, data){
    if(data.gen){
        let block = World.getBlockID(machine.x, machine.y-1, machine.z);
        let cont = World.getContainer(machine.x, machine.y-1, machine.z);
        let consume = EnergyNetBuilder.getNetOnCoords(machine.x, machine.y, machine.z).energyName == "Eu" ? 25 : 100;
        if(cont){
            if(block==61){
                let srcSlot = cont.getSlot(0);
                let fuelSlot = cont.getSlot(1);
                if(srcSlot.id!=0&&fuelSlot.id==0){
                    if(data.energy>=100){
                        cont.setSlot(1, 5, 1, 0);
                        data.energy -= consume;
                    }
                }
            }
        }
    }
});

UpgradeAPI.registerUpgrade(ItemID.upgradeTrav, "trav", function(item, machine, container, data){
    if(data.gen){
        machine.energyTick = function(){
            let tiles = [], 
                val = Math.min(data.output * data.updateTimer, data.energy),
                net = EnergyNetBuilder.getNetOnCoords(machine.x, machine.y, machine.z),
                type = net.energyName;
            if(net){
                for(let key in net.tileEntities){
                    if(tiles.length < 5){
                        if(nett.tileEntities[key].canReceiveEnergy()){
                            tiles.push(net.tileEntities[key]);
                        }
                    }
                }
                let add = type == "Eu" ? Math.min(Math.floor(val / tiles.length), 8192) : Math.floor(val / tiles.length);
                for(let t in tiles){
                    tiles[t].energyReceive(type, add, add);
                    data.energy -= add;
                }
            }
        }
        data.traversal = true;
    }
});

UpgradeAPI.registerUpgrade(ItemID.upgradeDisp, "disp", function(item, machine, container, data){
    if(data.gen){
        let playersNear = {}, type = EnergyNetBuilder.getNetOnCoords(machine.x, machine.y, machine.z).energyName;
        for(let i in Network.getConnectedPlayers()){
            let pl = Network.getConnectedPlayers()[i],
                dist = Entity.getDistanceBetweenCoords(Entity.getPosition(pl), machine);
            if(dist <= 5){
                playersNear[dist] = pl;
            }
        }
        let nearest = playersNear[Math.min.apply(Math, Object.keys(playersNear))];
        for(let s = 0; s <= 35; s++){
            let slot = nearest.getInventorySlot(s);
            if(ChargeItemRegistry.isValidItem(slot.id, type, 1)){
                data.energy -= ChargeItemRegistry.addEnergyTo(it, type, data.energy);
            }
        }
    }
});


//block charging upgrade

IDRegistry.genItemID("upgradeBcharge");
Item.createItem("upgradeBcharge", "Block Charging Upgrade", {name: "bcharge", meta: 0}, {stack: 1});

IDRegistry.genItemID("upgradeBchargeBound");
Item.createItem("upgradeBchargeBound", "Block Charging Upgrade", {name: "bcharge", meta: 0}, {stack: 1, isTech: true});
Item.setGlint(ItemID.upgradeBchargeBound, true);

Callback.addCallback("ItemUse", function(coords, item, block, player){
    if(item.id==ItemID.upgradeBcharge&&Entity.getSneaking(player)){
        if(World.getTileEntity(coords.x, coords.y, coords.z).canReceiveEnergy){
            var extra = item.extra;
            if(!extra) extra = new ItemExtraData();
            extra.putInt("x", coords.x);
            extra.putInt("y", coords.y);
            extra.putInt("z", coords.z);
            extra.putInt("dim", World.getTileEntity(coords.x, coords.y, coords.z).dimension);
            Player.decreaseCarriedItem(1);
            Player.addItemToInventory(ItemID.upgradeBchargeBound, 1, 0, extra);
        } else return;
    }
});

Item.registerNameOverrideFunction(ItemID.upgradeBchargeBound, function(item, name){
    if(item.extra){
        name += "\n" + "X: " + item.extra.getInt("x") + ", Y: " + item.extra.getInt("y") + ", Z: " + item.extra.getInt("z") + "\n" + Translation.translate("in dimension") + item.extra.getInt("dim") + ".";
    } else name += "This shit does not work!";
    return name;
});

UpgradeAPI.registerUpgrade(ItemID.upgradeBchargeBound, "bcharge", function(item, machine, container, data){
    if(item.extra && data.gen){
        if(item.extra.getInt("dim") == machine.dimension){
            let x = item.extra.getInt("x"), y = item.extra.getInt("y"), z = item.extra.getInt("z"), 
                mx = machine.x, my = machine.y, mz = machine.z,
                te = World.getTileEntity(x, y, z), blockIsInRange = false;
            let blockIsInRange = false;
            if(Math.abs(mx - x) <= 16 && Math.abs(my - y) <= 16 && Math.abs(mz - z) <= 16){ blockIsInRange = true; };
            if(blockIsInRange){
                if(te && te.canReceiveEnergy()){
                    let val = Math.min(data.output * data.updateTimer, data.energy);
                    if(EnergyNetBuilder.getNetOnCoords(mx, my, mz).energyName == EnergyNetBuilder.getNetOnCoords(x, y, z)){
                        te.energyReceive(EnergyNetBuilder.getNetOnCoords(x, y, z).energyName, val, val);
                        data.energy -= val;
                    }
                }
            }
        }
    }
});