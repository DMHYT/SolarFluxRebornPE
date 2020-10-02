Item.addCreativeGroup("sfr_details", Translation.translate("Panel Details"), [
    ItemID.mirror,
    ItemID.photo1,
    ItemID.photo2,
    ItemID.photo3,
    ItemID.photo4,
    ItemID.photo5,
    ItemID.photo6
]);

for(let i=1; i<=8; i++){
    PANELS_ARRAY.push(BlockID["panel"+i+"_RF"]);
    if(EUP) PANELS_ARRAY.push(BlockID["panel"+i+"_EU"]);
}

Item.addCreativeGroup("sfr_panels", Translation.translate("Panels"), PANELS_ARRAY);

Item.addCreativeGroup("sfr_upgrades", Translation.translate("Panel Upgrades"), [
    ItemID.upgradeBlank,
    ItemID.upgradeEff,
    ItemID.upgradeTransf,
    ItemID.upgradeCap,
    ItemID.upgradeFurn,
    ItemID.upgradeTrav,
    ItemID.upgradeDisp,
    ItemID.upgradeBcharge
]);