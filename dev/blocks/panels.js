function createPanelBlocks(){
    IDRegistry.genBlockID("panel1");
    IDRegistry.genBlockID("panel2");
    IDRegistry.genBlockID("panel3");
    IDRegistry.genBlockID("panel4");
    IDRegistry.genBlockID("panel5");
    IDRegistry.genBlockID("panel6");
    IDRegistry.genBlockID("panel7");
    IDRegistry.genBlockID("panel8");
    Block.createBlock("panel1", [{name: "Solar panel I", texture: [["panel1_base", 0], ["panel1_top", 0], ["panel1_base", 0]], inCreative: true}]);
    Block.createBlock("panel2", [{name: "Solar panel II", texture: [["panel2_base", 0], ["panel2_top", 0], ["panel2_base", 0]], inCreative: true}]);
    Block.createBlock("panel3", [{name: "Solar panel III", texture: [["panel3_base", 0], ["panel3_top", 0], ["panel3_base", 0]], inCreative: true}]);
    Block.createBlock("panel4", [{name: "Solar panel IV", texture: [["panel4_base", 0], ["panel4_top", 0], ["panel4_base", 0]], inCreative: true}]);
    Block.createBlock("panel5", [{name: "Solar panel V", texture: [["panel5_base", 0], ["panel5_top", 0], ["panel5_base", 0]], inCreative: true}]);
    Block.createBlock("panel6", [{name: "Solar panel VI", texture: [["panel6_base", 0], ["panel6_top", 0], ["panel6_base", 0]], inCreative: true}]);
    Block.createBlock("panel7", [{name: "Solar panel VII", texture: [["panel7_base", 0], ["panel7_top", 0], ["panel7_base", 0]], inCreative: true}]);
    Block.createBlock("panel8", [{name: "Solar panel VIII", texture: [["panel8_base", 0], ["panel8_top", 0], ["panel8_base", 0]], inCreative: true}]);
    for(var i=1; i<=8; i++){
        Block.setBlockShape(BlockID["panel"+i], {x: 0, y: 0, z: 0}, {x: 1, y: 0.375, z: 1});
    }
}

createPanelBlocks();

SolarRegistry.registerPanel(BlockID.panel1, {gen: 1, output: 8, energy_storage: 2.5e4});
SolarRegistry.registerPanel(BlockID.panel2, {gen: 8, output: 64, energy_storage: 1.25e5});
SolarRegistry.registerPanel(BlockID.panel3, {gen: 32, output: 256, energy_storage: 4.25e5});
SolarRegistry.registerPanel(BlockID.panel4, {gen: 128, output: 1024, energy_storage: 2e6});
SolarRegistry.registerPanel(BlockID.panel5, {gen: 512, output: 4096, energy_storage: 8e6});
SolarRegistry.registerPanel(BlockID.panel6, {gen: 2048, output: 16384, energy_storage: 3.2e7});
SolarRegistry.registerPanel(BlockID.panel7, {gen: 8192, output: 6.4e4, energy_storage: 6.4e7});
SolarRegistry.registerPanel(BlockID.panel8, {gen: 32768, output: 2.56e5, energy_storage: 1.28e8});