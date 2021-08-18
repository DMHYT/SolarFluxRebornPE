namespace SolarPanel {

    const NOT = ICRender.NOT;
    const AND = ICRender.AND;
    const OR = ICRender.OR;
    const BLOCK = ICRender.BLOCK;

    export function setupModelFor(name: string, height: number): void {
        ICRender.getGroup("rf-wire").add(BlockID[`sfr_${name}`], -1);
        const render = new ICRender.Model();
        const main_cube = new BlockRenderer.Model();
        const group = ICRender.getGroup(`sfr_${name}`);
        group.add(BlockID[`sfr_${name}`], -1);
        main_cube.addBox(0, 0, 0, 1, height, 1, [[`sfr_${name}_base`, 0], [`sfr_${name}_top`, 0], [`sfr_${name}_base`, 0]]);
        render.addEntry(main_cube);
        const shape = new ICRender.CollisionShape();
        shape.addEntry().addBox(0, 0, 0, 1, height, 1);
        const N = BLOCK(0, 0, -1, group, false);
        const S = BLOCK(0, 0, 1, group, false);
        const E = BLOCK(1, 0, 0, group, false);
        const W = BLOCK(-1, 0, 0, group, false);
        const boxes: {box: [number, number, number, number], condition: ICRender.CONDITION}[] = [
      /*N*/ {box: [1/16, 0, 15/16, 1/16], condition: NOT(N)},
      /*S*/ {box: [1/16, 15/16, 15/16, 1], condition: NOT(S)},
      /*E*/ {box: [15/16, 1/16, 1, 15/16], condition: NOT(E)},
      /*W*/ {box: [0, 1/16, 1/16, 15/16], condition: NOT(W)},
     /*NE*/ {box: [15/16, 0, 1, 1/16], condition: OR(AND(NOT(N), NOT(E)), AND(NOT(N), E), AND(N, NOT(E)))},
     /*NW*/ {box: [0, 0, 1/16, 1/16], condition: OR(AND(NOT(N), NOT(W)), AND(NOT(N), W), AND(N, NOT(W)))},
     /*SE*/ {box: [15/16, 15/16, 1, 1], condition: OR(AND(NOT(S), NOT(E)), AND(NOT(S), E), AND(S, NOT(E)))},
     /*SW*/ {box: [0, 15/16, 1/16, 1], condition: OR(AND(NOT(S), NOT(W)), AND(NOT(S), W), AND(S, NOT(W)))}
        ]
        for(let i in boxes) {
            const box = boxes[i];
            const part = new BlockRenderer.Model();
            part.addBox(box.box[0], height, box.box[1], box.box[2], height + 0.4 / 16, box.box[3], [[`sfr_${name}_base`, 0]]);
            render.addEntry(part).setCondition(box.condition);
            shape.addEntry().addBox(box.box[0], height, box.box[1], box.box[2], height + 0.4 / 16, box.box[3]).setCondition(box.condition);
        }
        Block.setShape(BlockID[`sfr_${name}`], 0, 0, 0, 1, height, 1);
        BlockRenderer.setStaticICRender(BlockID[`sfr_${name}`], -1, render);
        BlockRenderer.setCustomCollisionAndRaycastShape(BlockID[`sfr_${name}`], -1, shape);
        ItemModel.getFor(BlockID[`sfr_${name}`], -1).setModel(render);
    }

    export function createPanelFromStats(name: string, height: number, generation: number, capacity: number, transfer: number): void {
        IDRegistry.genBlockID(`sfr_${name}`);
        Block.createBlock(`sfr_${name}`, [{name: `tile.solarflux:solar_panel_${name}.name`, texture: [[`sfr_${name}_base`, 0], [`sfr_${name}_top`, 0], [`sfr_${name}_base`, 0]], inCreative: true}], {base: 1, destroytime: 5, solid: true, sound: "stone", translucency: 1});
        ToolAPI.registerBlockMaterial(BlockID[`sfr_${name}`], "stone", 1, false);
        setupModelFor(name, height);
        SFRTile.createPanelTileFor(`sfr_${name}`, height, generation, capacity, transfer);
        Block.registerDropFunction(BlockID[`sfr_${name}`], (coords, blockID, blockData, level, enchant, item, region) => {
            const toStore = SFRTile.TEMPORARY_TILES[`${coords.x}:${coords.y}:${coords.z}:${region.getDimension()}`];
            const extra = new ItemExtraData();
            if(toStore) {
                extra.putLong("SFREnergy", toStore ?? 0);
                delete SFRTile.TEMPORARY_TILES[`${coords.x}:${coords.y}:${coords.z}:${region.getDimension()}`];
            } else Logger.Log("Energy to be saved into itemstack from broken panel was not found!", "SolarFluxReborn DEBUG");
            return [[blockID, 1, blockData, toStore ? extra : null]];
        }, 1);
        Block.registerPlaceFunction(BlockID[`sfr_${name}`], (coords, item, block, player, region) => {
            const r = coords.relative;
            region.setBlock(r.x, r.y, r.z, BlockID[`sfr_${name}`], 0);
            TileEntity.addTileEntity(r.x, r.y, r.z, region);
            if(item.extra != null && item.extra.getLong("SFREnergy", -1) != -1){
                const panel = TileEntity.getTileEntity(r.x, r.y, r.z) as SFRTile.PanelTile;
                panel.data.energy = Math.min(panel.data.energy + item.extra.getInt("SFREnergy", panel.data.capacity));
            }
        });
        Item.registerNameOverrideFunction(BlockID[`sfr_${name}`], (item, name) => {
            if(item.extra == null) return name;
            if(item.extra.getLong("SFREnergy", -1) == -1) return name;
            const translated = Translation.translate("info.solarflux.energy.stored2");
            const energyInItem = item.extra.getLong("SFREnergy");
            const formatted = JavaString.format(translated, [new JavaString(formatNumber(energyInItem)), new JavaString(formatNumber(capacity))]);
            return `${name}\n§7${formatted}`;
        });
        SFR_STUFF.push(BlockID[`sfr_${name}`]);
    }

}

const createStandardPanel = (name: string) => {
    const stats = getStatsFor(`sfr_${name}`);
    SolarPanel.createPanelFromStats(name, DIFFERENT_PANEL_HEIGHT ? parseInt(name) / 16 : 6/16, stats.generation, stats.capacity, stats.transfer);
}