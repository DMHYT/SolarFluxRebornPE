//Любезно советуем вам переместиться в какие-либо другие файлы этого мода)
//Тут просто говнокод, уходите не позорьте меня +_+

const SolarConnector = {
    list: {},
    getRelCoords: function(c){
        return [
            [c.x, c.y, c.z-1],//north
            [c.x, c.y, c.z+1],//south
            [c.x-1, c.y, c.z],//west
            [c.x+1, c.y, c.z]//east
        ];
    },
    baseCube: function(model, tex){
        model.addBox(0, 0, 0, 1, 6/16, 1, [[tex[1], 0], [tex[0], 0], [tex[1], 0]]);
    },
    quickModel: function(render, model, cubes, tex){
        render = new ICRender.Model();
        model = new BlockRenderer.Model();
        this.baseCube(model, tex);
        for(let i in cubes){
            let k = cubes[i];
            model.addBox(k[0], k[1], k[2], k[3], k[4], k[5], tex[1], 0);
        }
        render.addEntry(model);
    },
    createModelsForPanel: function(id, textureTop, textureBase){
        let tex = [textureTop, textureBase];
        let idd = this.list[id] = {};
        idd.renders = [];
        idd.models = [];
        //no connects
        this.quickModel(idd.renders[0], idd.models[0], [
            [0, 6/16, 0, 1, 6.4/16, 1/16], [0, 6/16, 15/16, 1, 6.4/16, 1], [0, 6/16, 1/16, 1/16, 6.4/16, 15/16], [15/16, 6/16, 1/16, 1, 6.4/16, 15/16]
        ], tex);
        //------------------------------
        //connect north (z-1)
        this.quickModel(idd.renders[1], idd.models[1], [
            [0, 6/16, 15/16, 1, 6.4/16, 1], [0, 6/16, 0, 1/16, 6.4/16, 15/16], [15/16, 6/16, 0, 1, 6.4/16, 15/16]
        ], tex);
        //connect south (z+1)
        this.quickModel(idd.renders[2], idd.models[2], [
            [0, 6/16, 0, 1, 6.4/16, 1/16], [0, 6/16, 1/16, 1/16, 6.4/16, 1], [15/16, 6/16, 1/16, 1, 6.4/16, 1]
        ], tex);
        //connect east (x+1)
        this.quickModel(idd.renders[3], idd.models[3], [
            [0, 6/16, 0, 1, 6.4/16, 1/16], [0, 6/16, 15/16, 1, 6.4/16, 1], [0, 6/16, 1/16, 1/16, 6.4/16, 15/16]
        ], tex);
        //connect west (x-1)
        this.quickModel(idd.renders[4], idd.models[4], [
            [0, 6/16, 0, 1, 6.4/16, 1/16], [0, 6/16, 15/16, 1, 6.4/16, 1], [15/16, 6/16, 1/16, 1, 6.4/16, 15/16]
        ], tex);
        //------------------------------
        //connect north-east (x+1, z-1)
        this.quickModel(idd.renders[5], idd.models[5], [
            [0, 6/16, 15/16, 1, 6.4/16, 1], [0, 6/16, 0, 1/16, 6.4/16, 15/16]
        ], tex);
        //connect east-south (x+1, z+1)
        this.quickModel(idd.renders[6], idd.models[6], [
            [0, 6/16, 0, 1, 6.4/16, 1/16], [0, 6/16, 1/16, 1/16, 6.4/16, 1]
        ], tex);
        //connect south-west (x-1, z+1)
        this.quickModel(idd.renders[7], idd.models[7], [
            [0, 6/16, 0, 1, 6.4/16, 1/16], [15/16, 6/16, 1/16, 1, 6.4/16, 1]
        ], tex);
        //connect west-north (x-1, z-1)
        this.quickModel(idd.renders[8], idd.models[8], [
            [0, 6/16, 15/16, 1, 6.4/16, 1], [15/16, 6/16, 0, 1, 6.4/16, 15/16]
        ], tex);
        //------------------------------
        //connect north-south (z+1, z-1)
        this.quickModel(idd.renders[9], idd.models[9], [
            [0, 6/16, 0, 1/16, 6.4/16, 1], [15/16, 6/16, 0, 1, 6.4/16, 1]
        ], tex);
        //connect west-east (x+1, x-1)
        this.quickModel(idd.renders[10], idd.models[10], [
            [0, 6/16, 0, 1, 6.4/16, 1/16], [0, 6/16, 15/16, 1, 6.4/16, 1]
        ], tex);
        //------------------------------
        //connect north-east-south (z-1, x+1, z+1)
        this.quickModel(idd.renders[11], idd.models[11], [
            [0, 6/16, 0, 1/16, 6.4/16, 1]
        ], tex);
        //connect east-south-west (x+1, x-1, z+1)
        this.quickModel(idd.renders[12], idd.models[12], [
            [0, 6/16, 0, 1, 6.4/16, 1/16]
        ], tex);
        //connect south-west-north (z+1, z-1, x-1)
        this.quickModel(idd.renders[13], idd.models[13], [
            [15/16, 6/16, 0, 1, 6.4/16, 1]
        ], tex);
        //connect west-north-east (x+1, x-1, z-1)
        this.quickModel(idd.renders[14], idd.models[14], [
            [0, 6/16, 15/16, 1, 6.4/16, 1]
        ], tex);
        //------------------------------
        //connect ALL (x+1, x-1, z+1, z-1)
        idd.renders[15] = new ICRender.Model();
        idd.models[15] = new BlockRenderer.Model();
        this.baseCube(idd.models[15], tex);
    },
    setConnectablePanel: function(id){
        Block.setShape(id, 0, 0, 0, 1, 13/32, 1);
        BlockRenderer.enableCoordMapping(id, -1, this.list[id].renders[0]);
        Block.registerNeighbourChangeFunction(id, function(coords, block, changedCoords){
            if(World.getBlockID(changedCoords.x, changedCoords.x, changedCoords.z)==id){
                SolarConnector.update(coords);
            }
        });
    },
    update: function(c){ //coords
        let val = 0, panels = 0, id = World.getBlockID(c.x, c.y, c.z), rel = this.getRelCoords(c);
        for(let i in rel){
            if(World.getBlockID(rel[i][0], rel[i][1], rel[i][2])==id){
                switch(i){
                    case 0:
                        val += 1;
                        break;
                    case 1:
                        val += 4;
                        break;
                    case 2:
                        val += 9;
                        break;
                    case 3:
                        val += 16;
                        break;
                }
                panels++;
            }
        }
        switch(panels){
            case 0:
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[0]);
                break;
            case 1:
                switch(val){
                    case 1:
                        BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[1]);
                        break;
                    case 4:
                        BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[2]);
                        break;
                    case 9:
                        BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[4]);
                        break;
                    case 16:
                        BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[3]);
                        break;
                }
                break;
            case 2:
                switch(val){
                    case 17:
                        BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[5]);
                        break;
                    case 20:
                        BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[6]);
                        break;
                    case 13:
                        BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[7]);
                        break;
                    case 10:
                        BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[8]);
                        break;
                    case 5:
                        BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[9]);
                        break;
                    case 25:
                        BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[10]);
                        break;
                }
                break;
            case 3:
                switch(val){
                    case 21:
                        BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[11]);
                        break;
                    case 29:
                        BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[12]);
                        break;
                    case 14:
                        BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[13]);
                        break;
                    case 26:
                        BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[14]);
                        break;
                }
                break;
            case 4:
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[id].renders[15]);
                break;
        }
    }
}