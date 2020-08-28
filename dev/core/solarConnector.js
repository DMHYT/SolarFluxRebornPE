//Любезно советуем вам переместиться в какие-либо другие файлы этого мода)
//Тут просто говнокод, уходите не позорьте меня +_+

const SolarConnector = {
    list: {},
    baseCube: function(model, tex){
        model.addBox(0, 0, 0, 1, 6/16, 1, [[tex[1], 0], [tex[0], 0], [tex[1], 0]]);
    },
    quickModel: function(render, model, cubes, tex){
        this.baseCube(model, tex);
        for(let i in cubes){
            let k = cubes[i];
            model.addBox(k[0], k[1], k[2], k[3], k[4], k[5], tex[1], 0);
        }
        render.addEntry(model);
    },
    createModelsForPanel: function(ident, textureTop, textureBase){
        let tex = [textureTop, textureBase];
        let idd = this.list[ident] = {};
        idd.renders = [];
        idd.models = [];
        for(let i=0; i<=15; i++){
            idd.renders[i] = new ICRender.Model();
            idd.models[i] = new BlockRenderer.Model();
        }
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
        this.baseCube(idd.models[15], tex);
        idd.renders[15].addEntry(idd.models[15]);
    },
    setConnectablePanel: function(id, ident){
        Block.setShape(id, 0, 0, 0, 1, 13/32, 1);
        if(this.list[ident]){
            BlockRenderer.enableCoordMapping(id, -1, this.list[ident].renders[0]);
            Block.registerPlaceFunction(id, function(coords, item){
                World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, id, 0);
                World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z);
                SolarConnector.update(coords.relative, ident);
            });
            Block.registerNeighbourChangeFunction(id, function(coords, block, changedCoords){
                if(changedCoords.y<coords.y||changedCoords.y>coords.y){
                    if(World.getBlockID(changedCoords.x, changedCoords.x, changedCoords.z)==id){
                        SolarConnector.update(coords, ident);
                    }
                }
            });
        } else return Logger.Log("renders for panel not defined while calling 'SolarConnector.setConnectablePanel' method", "SolarFluxRebornAPI DEBUG ERROR");
    },
    update: function(c, ident){
        let val = '', panels = 0, iD = World.getBlockID(c.x, c.y, c.z);
        if(World.getBlockID(c.x, c.y, c.z-1)==iD){
            val += '1';
            if(debugEnabled){ Debug.m("panel found north"); }
            panels++;
        }
        if(World.getBlockID(c.x, c.y, c.z+1)==iD){
            val += '2';
            if(debugEnabled){ Debug.m("panel found south"); }
            panels++;
        }
        if(World.getBlockID(c.x-1, c.y, c.z)==iD){
            val += '3';
            if(debugEnabled){ Debug.m("panel found west"); }
            panels++;
        }
        if(World.getBlockID(c.x+1, c.y, c.z)==iD){
            val += '4';
            if(debugEnabled){ Debug.m("panel found east"); }
            panels++;
        }
        if(debugEnabled){
            switch(panels){
                case 1:
                case 2:
                case 3:
                case 4:
                    Debug.m("panel checking was done successfully, panels: "+panels);
                    break;
                default:
                    Debug.m("panels: "+panels);
            }
        }
        switch(val){
            case '':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[0]);
                break;
            case '1':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[2]);
                break;
            case '2':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[1]);
                break;
            case '3':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[4]);
                break;
            case '4':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[3]);
                break;
            case '14':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[7]);
                break;
            case '24':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[8]);
                break;
            case '23':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[5]);
                break;
            case '13':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[6]);
                break;
            case '12':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[9]);
                break;
            case '34':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[10]);
                break;
            case '124':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[13]);
                break;
            case '234':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[14]);
                break;
            case '123':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[11]);
                break;
            case '134':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[12]);
                break;
            case '1234':
                BlockRenderer.mapAtCoords(c.x, c.y, c.z, this.list[ident].renders[15]);
                break;
            default:
                if(debugEnabled){ 
                    Debug.m("error with connecting panels!"); 
                    Debug.m("val: "+val);
                }
        }
        if(debugEnabled) Debug.m("val: "+val);
    }
}