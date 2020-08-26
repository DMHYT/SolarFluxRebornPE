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
        if(cont){
            if(block==61){
                let srcSlot = cont.getSlot(0);
                let fuelSlot = cont.getSlot(1);
                if(srcSlot.id!=0&&fuelSlot.id==0){
                    if(data.energy>=100){
                        cont.setSlot(1, 5, 1, 0);
                        data.energy -= 100;
                    }
                }
            }
        }
    }
});

UpgradeAPI.registerUpgrade(ItemID.upgradeTrav, "trav", function(item, machine, container, data){
    if(data.gen){
        machine.energyTick = function(){
            let tiles = [];
            let val = Math.min(data.output, data.energy);
            let nett = EnergyNetBuilder.getNetOnCoords(machine.x, machine.y, machine.z);
            if(nett){
                let ratio = EnergyTypeRegistry.getValueRatio(nett.energyType, "FE");
                let add = Math.floor(val / tiles.length / ratio);
                for(let key in nett.tileEntities){
                    if(tiles.length<5){
                        if(nett.tileEntities[key].canReceiveEnergy){
                            tiles.push(nett.tileEntities[key]);
                        }
                    }
                }
                for(let t in tiles){
                    tiles[t].energyReceive(nett.energyType, add, add);
                    data.energy -= Math.floor(add * ratio);
                }
            }
        }
    }
});

UpgradeAPI.registerUpgrade(ItemID.upgradeDisp, "disp", function(item, machine, container, data){
    if(data.gen){
        let pos = Player.getPosition();
        let distance = Entity.getDistanceToCoords(pos, this);
        if(distance<=5){
            for(let s=0; s<=35; s++){
                let it = Player.getInventorySlot(s);
                let dat = ChargeItemRegistry.getItemData(it.id);
                if(dat){
                    let ratio = EnergyTypeRegistry.getValueRatio(dat.energy, "FE");
                    data.energy -= ChargeItemRegistry.addEnergyTo(it, dat.energy, Math.floor(data.energy / ratio)) * ratio;
                }
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

Callback.addCallback("ItemUse", function(coords, item, block){
    if(item.id==ItemID.upgradeBcharge&&Entity.getSneaking(p)){
        if(World.getTileEntity(coords.x, coords.y, coords.z).data.energy_storage){
            var extra = item.extra;
            if(!extra) extra = new ItemExtraData();
            extra.putInt("x", coords.x);
            extra.putInt("y", coords.y);
            extra.putInt("z", coords.z);
            Player.decreaseCarriedItem(1);
            Player.addItemToInventory(ItemID.upgradeBchargeBound, 1, 0, extra);
        } else return;
    }
});
    
Item.registerNameOverrideFunction(ItemID.upgradeBchargeBound, function(item, name){
    if(item.extra){
        name += "\n" + "X: " + item.extra.getInt("x") + ", Y: " + item.extra.getInt("y") + ", Z: " + item.extra.getInt("z");
    } else name += "This shit does not work!"
});

UpgradeAPI.registerUpgrade(ItemID.upgradeBchargeBound, "bcharge", function(item, machine, container, data){
    if(item.extra&&data.gen){
        let x = item.extra.getInt("x");
        let y = item.extra.getInt("y");
        let z = item.extra.getInt("z");
        let te = World.getTileEntity(x, y, z);
        let blockIsInRange = false;
        for(var xx=machine.x-16; xx<=machine.x+16; xx++){
            for(var yy=machine.y-16; yy<=machine.y+16; yy++){
                for(var zz=machine.z-16; zz<=machine.z+16; zz++){
                    if(xx==x&&yy==y&&zz==z){
                        blockIsInRange = true;
                        break;
                    } else blockIsInRange = false;
                }
            }
        }
        if(blockIsInRange==true){
            if(te && te.canReceiveEnergy){
                let val = Math.min(data.output, data.energy), 
                type = Object.keys(te.__energyTypes)[0],
                ratio = EnergyTypeRegistry.getValueRatio(type, "FE");
                te.energyReceive(type, Math.floor(val / ratio), Math.floor(val / ratio));
                data.energy -= val;
            }
        }
    }
});