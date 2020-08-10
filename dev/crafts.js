Callback.addCallback("PostLoaded", function(){
Recipes.addShaped({id: ItemID.mirror, count: 3, data: 0}, [
     "   ",
     "ggg",
     " i "
], ['g', 20, -1, 'i', 265, 0]);
Recipes.addShaped({id: ItemID.photo1, count: 1, data: 0}, [
     "ggg",
     "lll",
     "mmm"
], ['g', 20, -1, 'l', 351, 4, 'm', ItemID.mirror, 0]);
Recipes.addShaped({id: ItemID.photo2, count: 1, data: 0}, [
     "clc",
     "lcl",
     "mpm"
], ['c', 337, 0, 'l', 351, 4, 'm', ItemID.mirror, 0, 'p', ItemID.photo1, 0]);
Recipes.addShaped({id: ItemID.photo3, count: 1, data: 0}, [
     "ggg",
     "ddd",
     "opo"
], ['g', 20, -1, 'd', 348, 0, 'o', 49, 0, 'p', ItemID.photo2, 0]);
Recipes.addShaped({id: ItemID.photo4, count: 1, data: 0}, [
     "bbb",
     "gdg",
     "qpq"
], ['b', 377, 0, 'd', 264, 0, 'g', 348, 0, 'q', 155, -1, 'p', ItemID.photo3, 0]);
Recipes.addShaped({id: ItemID.photo5, count: 1, data: 0}, [
     "rrr",
     "gdg",
     "qpq"
], ['r', 369, 0, 'g', 89, 0, 'd', 264, 0, 'q', 155, -1, 'p', ItemID.photo4, 0]);
Recipes.addShaped({id: ItemID.photo6, count: 1, data: 0}, [
     "eee",
     "gdg",
     "qpq"
], ['e', 388, 0, 'g', 89, 0, 'd', 264, 0, 'q', 155, -1, 'p', ItemID.photo5, 0]);
Recipes.addShaped({id: BlockID.panel1, count: 1, data: 0}, [
     "mmm",
     "prp",
     "ppp"
], ['m', ItemID.mirror, 0, 'p', 5, -1, 'r', 331, 0]);
Recipes.addShaped({id: BlockID.panel2, count: 1, data: 0}, [
     "sss",
     "sps",
     "sss"
], ['s', BlockID.panel1, 0, 'p', 33, 0]);
Recipes.addShaped({id: BlockID.panel3, count: 2, data: 0}, [
     "ccc",
     "prp",
     "pip"
], ['c', ItemID.photo1, 0, 'p', BlockID.panel2, 0, 'r', 356, 0, 'i', 42, 0]);
Recipes.addShaped({id: BlockID.panel4, count: 2, data: 0}, [
     "ccc",
     "pwp",
     "pip"
], ['c', ItemID.photo2, 0, 'p', BlockID.panel3, 0, 'w', 347, 0, 'i', 42, 0]);
Recipes.addShaped({id: BlockID.panel5, count: 2, data: 0}, [
     "ccc",
     "pdp",
     "pgp"
], ['c', ItemID.photo3, 0, 'p', BlockID.panel4, 0, 'd', 348, 0, 'g', 41, 0]);
Recipes.addShaped({id: BlockID.panel6, count: 2, data: 0}, [
     "ccc",
     "plp",
     "pdp"
], ['c', ItemID.photo4, 0, 'p', BlockID.panel5, 0, 'l', 123, 0, 'd', 57, 0]);
Recipes.addShaped({id: BlockID.panel7, count: 2, data: 0}, [
     "ccc",
     "pbp",
     "pbp"
], ['c', ItemID.photo5, 0, 'p', BlockID.panel6, 0, 'b', 437, 0]);
Recipes.addShaped({id: BlockID.panel8, count: 2, data: 0}, [
     "ccc",
     "pep",
     "pep"
], ['c', ItemID.photo6, 0, 'p', BlockID.panel7, 0, 'e', 122, 0]);
Recipes.addShaped({id: ItemID.upgradeBlank, count: 1, data: 0}, [
     " c ",
     "cmc",
     " c "
], ['c', 4, 0, 'm', ItemID.mirror, 0]);
Recipes.addShaped({id: ItemID.upgradeEff, count: 1, data: 0}, [
     " m ",
     "mbm",
     " c "
], ['m', ItemID.mirror, 0, 'b', ItemID.upgradeBlank, 0, 'c', ItemID.photo1, 0]);
Recipes.addShaped({id: ItemID.upgradeTransf, count: 1, data: 0}, [
     "rrr",
     "gbg",
     "rrr"
], ['r', 331, 0, 'g', 266, 0, 'b', ItemID.upgradeBlank, 0]);
Recipes.addShaped({id: ItemID.upgradeCap, count: 1, data: 0}, [
     " r ",
     "rbr",
     "rdr"
], ['r', 331, 0, 'b', ItemID.upgradeBlank, 0, 'd', 57, 0]);
Recipes.addShaped({id: ItemID.upgradeFurn, count: 1, data: 0}, [
    "ccc",
    "cbc",
    "cfc"
], ['c', 263, -1, 'b', ItemID.upgradeBlank, 0, 'f', 61, 0]);
Recipes.addShaped({id: ItemID.upgradeTrav, count: 1, data: 0}, [
    "ipi",
    "rbr",
    "ipi"
], ['i', 265, 0, 'p', 33, 0, 'r', 331, 0, 'b', ItemID.upgradeBlank, 0]);
Recipes.addShaped({id: ItemID.upgradeTrav, count: 1, data: 0}, [
    "ipi",
    "rbr",
    "ipi"
], ['i', 265, 0, 'p', 29, 0, 'r', 331, 0, 'b', ItemID.upgradeBlank, 0]);
Recipes.addShaped({id: ItemID.upgradeDisp, count: 1, data: 0}, [
    "geg",
    "ebe",
    "geg"
], ['g', 348, 0, 'e', 381, 0, 'b', ItemID.upgradeBlank, 0]);
Recipes.addShaped({id: ItemID.upgradeBcharge, count: 1, data: 0}, [
    "ere",
    "rdr",
    "ere"
], ['e', 368, 0, 'r', 152, 0, 'd', ItemID.upgradeDisp, 0]);
});