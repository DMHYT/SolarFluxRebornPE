function PanelNet(energyType, blockID){
    this.energyType = energyType;
    this.energyName = energyType.name;
    this.netId = GLOBAL_PANELNET_ID++;
    this.blockID = blockID;
    this.storage = 0;
    this.connectedNets = {};
    this.panelsCount = 0;
    this.map = {};
    this.addConnection = function(net) {
		if(!this.connectedNets[net.netId]) {
			this.connectedNets[net.netId] = net;
			this.panelsCount++;
		}
	}
	this.removeConnection = function(net) {
		delete this.connectedNets[net.netId];
		this.panelsCount--;
	}
	this.tileEntities = [];
	this.addTileEntity = function(tileEntity) {
		if (!tileEntity.__connectedPanelNets[this.netId]) {
			this.tileEntities.push(tileEntity);
			tileEntity.__connectedPanelNets[this.netId] = this;
		}
	}
	this.removeTileEntity = function(tileEntity) {
		for(let i in this.tileEntities) {
			if(this.tileEntities[i] == tileEntity) {
				this.tileEntities.splice(i, 1);
				break;
			}
		}
    }
    this.updateEnergyStorage = function(){
        this.storage = 0;
        for(let i in this.tileEntities){
            this.storage += this.tileEntities[i].data.energy;
        }
        return this.storage;
    }
    this.addFromNetToPanel = function(tile, amount){
        for(let i in this.tileEntities){
            let t = this.tileEntities[i];
            if(t.data.energy >= amount){
                t.data.energy -= tile.data.energy += amount;
                return amount;
            } else continue;
        }
        this.updateEnergyStorage();
        return 0;
    }
}

const PanelNetBuilder = {
    nets: [],
    removeNet: function(net){
        for(let i in net.tileEntities){
            delete net.tileEntities[i].__connectedPanelNets[net.netId];
        }
        for(let i in net.connectedNets){
            net.connectedNets[i].removeConnection(net);
        }
        net.removed = true;
        for(let i in this.nets){
            if(this.nets[i] == net){
                this.nets.splice(i, 1);
                break;
            }
        }
    },
    removeNetOnCoords: function(x, y, z) {
		let net = this.getNetOnCoords(x, y, z);
		if(net) this.removeNet(net);
	},
	removeNetByBlock: function(x, y, z, wireId) {
		if(World.getBlockID(x, y, z) == wireId){
			this.removeNetOnCoords(x, y, z);
		}
    },
    mergeNets: function(net1, net2) {
		for(let key in net2.map){
			net1.map[key] = true;
		}
		for(let i in net2.tileEntities){
			net1.addTileEntity(net2.tileEntities[i]);
		}
		for(let i in net2.connectedNets){
			let otherNet = net2.connectedNets[i];
			net1.addConnection(otherNet);
			otherNet.addConnection(net1);
		}
		this.removeNet(net2);
    },
    getNetOnCoords: function(x, y, z) {
		for (let i in this.nets) {
			let net = this.nets[i];
			let key = x + ":" + y + ":" + z;
			if (net.map[key]) return net;
		}
		return null;
    },
    createNet: function(energyType, blockID){
        let net = new PanelNet(energyType, blockID);
        this.nets.push(net);
        return net;
    }
}

Callback.addCallback("LevelLoaded", function(){
    PanelNetBuilder.nets = [];
});