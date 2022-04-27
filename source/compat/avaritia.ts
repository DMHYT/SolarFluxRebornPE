ModAPI.addAPICallback("AvaritiaAPI", Avaritia => {
    createPanel("neutronium");
    createPanel("infinity");
    Avaritia.addExtremeShapedRecipe("solar_panel_neutronium", { id: BlockID.sfr_neutronium, count: 2, data: 0 }, [
        "  NN NN  ",
        " NCCPCCN ",
        "NC  U  CN",
        "NC QQQ CN",
        " PUQIQUP ",
        "NC QQQ CN",
        "NC  U  CN",
        " NCCPCCN ",
        "  NN NN  "
    ], [
        'N', ItemID.neutronium_ingot, 0,
        'C', ItemID.crystal_matrix_ingot, 0,
        'P', BlockID.sfr_8, 0,
        'U', ItemID.neutron_nugget, 0,
        'Q', ItemID.neutron_pile, 0,
        'I', ItemID.infinity_catalyst, 0
    ]);
    Avaritia.addExtremeShapedRecipe("solar_panel_infinity", { id: BlockID.sfr_infinity, count: 3, data: 0 }, [
        "  NN NN  ",
        " NCCBCCN ",
        "NC  U  CN",
        "NC QIQ CN",
        " BUIPIUB ",
        "NC QIQ CN",
        "NC  U  CN",
        " NCCBCCN ",
        "  NN NN  "
    ], [
        'N', ItemID.neutronium_ingot, 0,
        'C', ItemID.crystal_matrix_ingot, 0,
        'B', BlockID.neutronium_block, 0,
        'U', ItemID.neutron_nugget, 0,
        'Q', ItemID.neutron_pile, 0,
        'I', ItemID.infinity_ingot, 0,
        'P', BlockID.sfr_neutronium, 0
    ]);
});