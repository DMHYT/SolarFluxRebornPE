IDRegistry.genBlockID("panel1_RF");
IDRegistry.genBlockID("panel2_RF");
IDRegistry.genBlockID("panel3_RF");
IDRegistry.genBlockID("panel4_RF");
IDRegistry.genBlockID("panel5_RF");
IDRegistry.genBlockID("panel6_RF");
IDRegistry.genBlockID("panel7_RF");
IDRegistry.genBlockID("panel8_RF");
Block.createBlock("panel1_RF", [{name: "Solar panel I", texture: [["panel1_base", 0], ["panel1_top", 0], ["panel1_base", 0]], inCreative: true}]);
Block.createBlock("panel2_RF", [{name: "Solar panel II", texture: [["panel2_base", 0], ["panel2_top", 0], ["panel2_base", 0]], inCreative: true}]);
Block.createBlock("panel3_RF", [{name: "Solar panel III", texture: [["panel3_base", 0], ["panel3_top", 0], ["panel3_base", 0]], inCreative: true}]);
Block.createBlock("panel4_RF", [{name: "Solar panel IV", texture: [["panel4_base", 0], ["panel4_top", 0], ["panel4_base", 0]], inCreative: true}]);
Block.createBlock("panel5_RF", [{name: "Solar panel V", texture: [["panel5_base", 0], ["panel5_top", 0], ["panel5_base", 0]], inCreative: true}]);
Block.createBlock("panel6_RF", [{name: "Solar panel VI", texture: [["panel6_base", 0], ["panel6_top", 0], ["panel6_base", 0]], inCreative: true}]);
Block.createBlock("panel7_RF", [{name: "Solar panel VII", texture: [["panel7_base", 0], ["panel7_top", 0], ["panel7_base", 0]], inCreative: true}]);
Block.createBlock("panel8_RF", [{name: "Solar panel VIII", texture: [["panel8_base", 0], ["panel8_top", 0], ["panel8_base", 0]], inCreative: true}]);
SolarRegistry.registerPanel(BlockID.panel1_RF, "panel1_RF", {gen: 1, output: 8, energy_storage: 2.5e4}, Translation.translate("Solar panel I"), {top: "panel1_top", base: "panel1_base"}, false);
SolarRegistry.registerPanel(BlockID.panel2_RF, "panel2_RF", {gen: 8, output: 64, energy_storage: 1.25e5}, Translation.translate("Solar panel II"), {top: "panel2_top", base: "panel2_base"}, false);
SolarRegistry.registerPanel(BlockID.panel3_RF, "panel3_RF", {gen: 32, output: 256, energy_storage: 4.25e5}, Translation.translate("Solar panel III"), {top: "panel3_top", base: "panel3_base"}, false);
SolarRegistry.registerPanel(BlockID.panel4_RF, "panel4_RF", {gen: 128, output: 1024, energy_storage: 2e6}, Translation.translate("Solar panel IV"), {top: "panel4_top", base: "panel4_base"}, false);
SolarRegistry.registerPanel(BlockID.panel5_RF, "panel5_RF", {gen: 512, output: 4096, energy_storage: 8e6}, Translation.translate("Solar panel V"), {top: "panel5_top", base: "panel5_base"}, false);
SolarRegistry.registerPanel(BlockID.panel6_RF, "panel6_RF", {gen: 2048, output: 16384, energy_storage: 3.2e7}, Translation.translate("Solar panel VI"), {top: "panel6_top", base: "panel6_base"}, false);
SolarRegistry.registerPanel(BlockID.panel7_RF, "panel7_RF", {gen: 8192, output: 6.4e4, energy_storage: 6.4e7}, Translation.translate("Solar panel VII"), {top: "panel7_top", base: "panel7_base"}, false);
SolarRegistry.registerPanel(BlockID.panel8_RF, "panel8_RF", {gen: 32768, output: 2.56e5, energy_storage: 1.28e8}, Translation.translate("Solar panel VIII"), {top: "panel8_top", base: "panel8_base"}, false);

if(EUP){//if EU panels in config are activated
    IDRegistry.genBlockID("panel1_EU");
    IDRegistry.genBlockID("panel2_EU");
    IDRegistry.genBlockID("panel3_EU");
    IDRegistry.genBlockID("panel4_EU");
    IDRegistry.genBlockID("panel5_EU");
    IDRegistry.genBlockID("panel6_EU");
    IDRegistry.genBlockID("panel7_EU");
    IDRegistry.genBlockID("panel8_EU");
    Block.createBlock("panel1_EU", [{name: "Solar panel I", texture: [["panel1_base", 0], ["panel1_top", 0], ["panel1_base", 0]], inCreative: true}]);
    Block.createBlock("panel2_EU", [{name: "Solar panel II", texture: [["panel2_base", 0], ["panel2_top", 0], ["panel2_base", 0]], inCreative: true}]);
    Block.createBlock("panel3_EU", [{name: "Solar panel III", texture: [["panel3_base", 0], ["panel3_top", 0], ["panel3_base", 0]], inCreative: true}]);
    Block.createBlock("panel4_EU", [{name: "Solar panel IV", texture: [["panel4_base", 0], ["panel4_top", 0], ["panel4_base", 0]], inCreative: true}]);
    Block.createBlock("panel5_EU", [{name: "Solar panel V", texture: [["panel5_base", 0], ["panel5_top", 0], ["panel5_base", 0]], inCreative: true}]);
    Block.createBlock("panel6_EU", [{name: "Solar panel VI", texture: [["panel6_base", 0], ["panel6_top", 0], ["panel6_base", 0]], inCreative: true}]);
    Block.createBlock("panel7_EU", [{name: "Solar panel VII", texture: [["panel7_base", 0], ["panel7_top", 0], ["panel7_base", 0]], inCreative: true}]);
    Block.createBlock("panel8_EU", [{name: "Solar panel VIII", texture: [["panel8_base", 0], ["panel8_top", 0], ["panel8_base", 0]], inCreative: true}]);
    SolarRegistry.registerPanel(BlockID.panel1_EU, "panel1_EU", {gen: 1, output: 2, energy_storage: 6500}, Translation.translate("Solar panel I"), {top: "panel1_top", base: "panel1_base"}, true);
    SolarRegistry.registerPanel(BlockID.panel2_EU, "panel2_EU", {gen: 2, output: 16, energy_storage: 32000}, Translation.translate("Solar panel II"), {top: "panel2_top", base: "panel2_base"}, true);
    SolarRegistry.registerPanel(BlockID.panel3_EU, "panel3_EU", {gen: 8, output: 64, energy_storage: 100000}, Translation.translate("Solar panel III"), {top: "panel3_top", base: "panel3_base"}, true);
    SolarRegistry.registerPanel(BlockID.panel4_EU, "panel4_EU", {gen: 32, output: 256, energy_storage: 500000}, Translation.translate("Solar panel IV"), {top: "panel4_top", base: "panel4_base"}, true);
    SolarRegistry.registerPanel(BlockID.panel5_EU, "panel5_EU", {gen: 128, output: 1024, energy_storage: 2000000}, Translation.translate("Solar panel V"), {top: "panel5_top", base: "panel5_base"}, true);
    SolarRegistry.registerPanel(BlockID.panel6_EU, "panel6_EU", {gen: 512, output: 4096, energy_storage: 8000000}, Translation.translate("Solar panel VI"), {top: "panel6_top", base: "panel6_base"}, true);
    SolarRegistry.registerPanel(BlockID.panel7_EU, "panel7_EU", {gen: 2048, output: 8192, energy_storage: 16000000}, Translation.translate("Solar panel VII"), {top: "panel7_top", base: "panel7_base"}, true);
    SolarRegistry.registerPanel(BlockID.panel8_EU, "panel8_EU", {gen: 8192, output: 8192,/*output is 8192 max, because of IC2 voltage */ energy_storage: 32000000}, Translation.translate("Solar panel VIII"), {top: "panel8_top", base: "panel8_base"}, true);
    
    //Different overrides for the panels with different energy types
    for(let i=1; i<=9; i++){
        for(let a=0; a<2; a++){
            Item.registerNameOverrideFunction(BlockID["panel" + i + (a == 0 ? "_RF" : "_EU")], function(item, name){
                name += " " + (a == 0 ? "§c(RF)" : "§a(EU)");
                return name;
            });
        }
    }
}

//Panels with different energy types are crafted from each others.

function craftPanelsFromEachOthers(id){
    Recipes.addShapeless({id: BlockID[id+"_EU"], count: 1, data: 0}, [{id: BlockID[id+"_RF"], data: 0}]);
    Recipes.addShapeless({id: BlockID[id+"_RF"], count: 1, data: 0}, [{id: BlockID[id+"_EU"], data: 0}]);
}

for(let i=1; i<=9; i++){
    craftPanelsFromEachOthers("panel"+i);
}