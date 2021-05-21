namespace SFRModel {

    export type ALL_POSSIBLE = "LONE" | "N" | "S" | "E" | "W" | "NE" | "ES" | "SW" | "WN" | "NS" | "EW" | "NES" | "ESW" | "SWN" | "WNE" | "ALL"
    export const ALL_POSSIBLE_KEYS: ALL_POSSIBLE[] = ["LONE", "N", "S", "E", "W", "NE", "ES", "SW", "WN", "NS", "EW", "NES", "ESW", "SWN", "WNE", "ALL"];

    export function setPanelRender(id: number, baseTexture: string, topTexture: string): void {
        const group = ICRender.getGroup(`SFR${id}`);
        group.add(id, -1);
        const render = new ICRender.Model();
        const models = new PanelModel(baseTexture, topTexture);
        const conditions = new RenderCondition(group);
        for(let key of ALL_POSSIBLE_KEYS) render.addEntry(models[key]).setCondition(conditions[key]);
        BlockRenderer.setStaticICRender(id, -1, render);
        const shape = new ICRender.CollisionShape();
        shape.addEntry().addBox(0, 0, 0, 1, 6/16, 1);
        BlockRenderer.setCustomCollisionShape(id, -1, shape);
        BlockRenderer.setCustomRaycastShape(id, -1, shape);
        Block.setShape(id, 0, 0, 0, 1, 6/16, 1);
        ItemModel.getFor(id, 0).setModel(models.LONE);
    }

    export type IConnectionsTyped<T> = {
        [key in ALL_POSSIBLE]: T;
    }

    export class PanelModel implements IConnectionsTyped<BlockRenderer.Model> {

        public static createPanelModel(baseTexture: string, topTexture: string, connectionCubes: PanelModel.ConnectionCube[]): BlockRenderer.Model {
            const model = new BlockRenderer.Model();
            model.addBox(0, 0, 0, 1, 6/16, 1, [[baseTexture, 0], [topTexture, 0], [baseTexture, 0]]);
            for(let cube of connectionCubes) model.addBox(cube.minX, 6/16, cube.minZ, cube.maxX, 6.4/16, cube.maxZ, baseTexture, 0);
            return model;
        }

        public readonly LONE: BlockRenderer.Model;
        public readonly N: BlockRenderer.Model;
        public readonly S: BlockRenderer.Model;
        public readonly E: BlockRenderer.Model;
        public readonly W: BlockRenderer.Model;
        public readonly NE: BlockRenderer.Model;
        public readonly ES: BlockRenderer.Model;
        public readonly SW: BlockRenderer.Model;
        public readonly WN: BlockRenderer.Model;
        public readonly NS: BlockRenderer.Model;
        public readonly EW: BlockRenderer.Model;
        public readonly NES: BlockRenderer.Model;
        public readonly ESW: BlockRenderer.Model;
        public readonly SWN: BlockRenderer.Model;
        public readonly WNE: BlockRenderer.Model;
        public readonly ALL: BlockRenderer.Model;

        constructor(baseTexture: string, topTexture: string){
            for(let key of ALL_POSSIBLE_KEYS) this[key] = PanelModel.createPanelModel(baseTexture, topTexture, PanelModel.ConnectionCube[key]);
        }
        
    }

    export namespace PanelModel {

        export class ConnectionCube {

            public static readonly CENTER_SOUTH: ConnectionCube = new ConnectionCube(1/16, 15/16, 15/16, 1);
            public static readonly CENTER_NORTH: ConnectionCube = new ConnectionCube(1/16, 0, 15/16, 1/16);
            public static readonly CENTER_EAST: ConnectionCube = new ConnectionCube(0, 1/16, 1/16, 15/16);
            public static readonly CENTER_WEST: ConnectionCube = new ConnectionCube(15/16, 1/16, 1, 15/16);
            public static readonly CORNER_NE: ConnectionCube = new ConnectionCube(15/16, 0, 1, 1/16);
            public static readonly CORNER_NW: ConnectionCube = new ConnectionCube(0, 0, 1/16, 1/16);
            public static readonly CORNER_SE: ConnectionCube = new ConnectionCube(15/16, 15/16, 1, 1);
            public static readonly CORNER_SW: ConnectionCube = new ConnectionCube(0, 15/16, 1/16, 1);

            constructor(readonly minX: number, readonly minZ: number, readonly maxX: number, readonly maxZ: number){}

            public static readonly LONE: ConnectionCube[] = [ConnectionCube.CENTER_SOUTH, ConnectionCube.CENTER_NORTH, ConnectionCube.CENTER_EAST, ConnectionCube.CENTER_WEST, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly N: ConnectionCube[] = [ConnectionCube.CENTER_SOUTH, ConnectionCube.CENTER_EAST, ConnectionCube.CENTER_WEST, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly S: ConnectionCube[] = [ConnectionCube.CENTER_NORTH, ConnectionCube.CENTER_EAST, ConnectionCube.CENTER_WEST, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly E: ConnectionCube[] = [ConnectionCube.CENTER_SOUTH, ConnectionCube.CENTER_NORTH, ConnectionCube.CENTER_WEST, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly W: ConnectionCube[] = [ConnectionCube.CENTER_SOUTH, ConnectionCube.CENTER_NORTH, ConnectionCube.CENTER_EAST, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly ES: ConnectionCube[] = [ConnectionCube.CENTER_NORTH, ConnectionCube.CENTER_WEST, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly SW: ConnectionCube[] = [ConnectionCube.CENTER_NORTH, ConnectionCube.CENTER_EAST, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly WN: ConnectionCube[] = [ConnectionCube.CENTER_SOUTH, ConnectionCube.CENTER_EAST, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly NE: ConnectionCube[] = [ConnectionCube.CENTER_SOUTH, ConnectionCube.CENTER_WEST, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly NS: ConnectionCube[] = [ConnectionCube.CENTER_EAST, ConnectionCube.CENTER_WEST, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly EW: ConnectionCube[] = [ConnectionCube.CENTER_SOUTH, ConnectionCube.CENTER_NORTH, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly NES: ConnectionCube[] = [ConnectionCube.CENTER_WEST, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly ESW: ConnectionCube[] = [ConnectionCube.CENTER_NORTH, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly SWN: ConnectionCube[] = [ConnectionCube.CENTER_EAST, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly WNE: ConnectionCube[] = [ConnectionCube.CENTER_SOUTH, ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];
            public static readonly ALL: ConnectionCube[] = [ConnectionCube.CORNER_NE, ConnectionCube.CORNER_NW, ConnectionCube.CORNER_SE, ConnectionCube.CORNER_SW];

        }

    }
    
    export class RenderCondition implements IConnectionsTyped<ICRender.CONDITION> {

        public readonly BN: ICRender.CONDITION;
        public readonly BS: ICRender.CONDITION;
        public readonly BE: ICRender.CONDITION;
        public readonly BW: ICRender.CONDITION;
        
        constructor(group: ICRender.Group){
            this.BN = BLOCK(0, 0, -1, group, false);
            this.BS = BLOCK(0, 0, 1, group, false);
            this.BE = BLOCK(-1, 0, 0, group, false);
            this.BW = BLOCK(1, 0, 0, group, false);
            this.LONE = NOT(AND(this.BN, this.BS, this.BE, this.BW));
            this.N = AND(NOT(AND(this.BS, this.BE, this.BW)), this.BN);
            this.S = AND(NOT(AND(this.BN, this.BE, this.BW)), this.BS);
            this.E = AND(NOT(AND(this.BN, this.BS, this.BW)), this.BE);
            this.W = AND(NOT(AND(this.BN, this.BS, this.BE)), this.BW);
            this.ES = AND(NOT(AND(this.BN, this.BW)), this.BE, this.BS);
            this.SW = AND(NOT(AND(this.BN, this.BE)), this.BS, this.BW);
            this.WN = AND(NOT(AND(this.BE, this.BS)), this.BW, this.BN);
            this.NE = AND(NOT(AND(this.BS, this.BW)), this.BE, this.BN);
            this.NS = AND(NOT(AND(this.BE, this.BW)), this.BN, this.BS);
            this.EW = AND(NOT(AND(this.BN, this.BS)), this.BE, this.BW);
            this.NES = AND(NOT(this.BW), this.BN, this.BE, this.BS);
            this.ESW = AND(NOT(this.BN), this.BE, this.BS, this.BW);
            this.SWN = AND(NOT(this.BE), this.BS, this.BW, this.BN);
            this.WNE = AND(NOT(this.BS), this.BW, this.BN, this.BE);
            this.ALL = AND(this.BN, this.BS, this.BE, this.BW);
        }

        public readonly LONE: ICRender.CONDITION;
        public readonly N: ICRender.CONDITION;
        public readonly S: ICRender.CONDITION;
        public readonly E: ICRender.CONDITION;
        public readonly W: ICRender.CONDITION;
        public readonly ES: ICRender.CONDITION;
        public readonly SW: ICRender.CONDITION;
        public readonly WN: ICRender.CONDITION;
        public readonly NE: ICRender.CONDITION;
        public readonly NS: ICRender.CONDITION;
        public readonly EW: ICRender.CONDITION;
        public readonly NES: ICRender.CONDITION;
        public readonly ESW: ICRender.CONDITION;
        public readonly SWN: ICRender.CONDITION;
        public readonly WNE: ICRender.CONDITION;
        public readonly ALL: ICRender.CONDITION;

    }

}