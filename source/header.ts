/*
 ██████╗ █████╗ ██╗      █████╗ ██████╗     ███████╗██╗     ██╗   ██╗██╗  ██╗
██╔════╝██╔══██╗██║     ██╔══██╗██╔══██╗    ██╔════╝██║     ██║   ██║╚██╗██╔╝
╚█████╗ ██║  ██║██║     ███████║██████╔╝    █████╗  ██║     ██║   ██║ ╚███╔╝ 
 ╚═══██╗██║  ██║██║     ██╔══██║██╔══██╗    ██╔══╝  ██║     ██║   ██║ ██╔██╗ 
██████╔╝╚█████╔╝███████╗██║  ██║██║  ██║    ██║     ███████╗╚██████╔╝██╔╝╚██╗
╚═════╝  ╚════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝
    ██████╗ ███████╗██████╗  █████╗ ██████╗ ███╗  ██╗    ██████╗ ███████╗
    ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔══██╗████╗ ██║    ██╔══██╗██╔════╝
    ██████╔╝█████╗  ██████╦╝██║  ██║██████╔╝██╔██╗██║    ██████╦╝█████╗  
    ██╔══██╗██╔══╝  ██╔══██╗██║  ██║██╔══██╗██║╚████║    ██╔══██╗██╔══╝  
    ██║  ██║███████╗██████╦╝╚█████╔╝██║  ██║██║ ╚███║    ██████╦╝███████╗
    ╚═╝  ╚═╝╚══════╝╚═════╝  ╚════╝ ╚═╝  ╚═╝╚═╝  ╚══╝    ╚═════╝ ╚══════╝
*/

// OFFICIAL PORT OF THE SOLAR FLUX REBORN MOD
// FROM MINECRAFT FORGE TO INNER CORE MOD LAUNCHER

// © vsdum 2021
// YouTube DMH (Russian) - https://www.youtube.com/channel/UCdQKuakM3rnuGV_1VA6XUKQ
// YouTube vstannumdum (English) - https://www.youtube.com/channel/UCXHpQ_SQ8VPigIvbbzHWWdA
// My VK - https://www.vk.com/vstannumdum
// Report bugs in VK Public - https://www.vk.com/dmhmods

// Original Forge mod by Zeitheron
// https://www.curseforge.com/minecraft/mc-mods/solar-flux-reborn
// https://www.curseforge.com/members/zeitheron/projects
// https://www.youtube.com/c/ZeitheronRowdan
// https://twitter.com/Zeitheron
// https://www.vk.com/zeitheron
// https://www.patreon.com/zeitheron

IMPORT("EnergyNet");
IMPORT("StorageInterface");
IMPORT("ChargeItem");

const JavaMath = new (WRAP_JAVA("ua.vsdum.sfrpe.Main"))();

const clamp = (num: number, min: number, max: number) => num < min ? min : (num > max ? max : num);

const BLOCK = ICRender.BLOCK;
const AND = ICRender.AND;
const NOT = ICRender.NOT;

interface PanelStats {
    generation: number;
    transfer: number;
    capacity: number;
}

const getStatsFor = (id: string) => {
    return {
        generation: __config__.getNumber(`panel_stats.${id}.generation`).longValue(),
        transfer: __config__.getNumber(`panel_stats.${id}.capacity`).longValue(),
        capacity: __config__.getNumber(`panel_stats.${id}.capacity`).longValue()
    } as PanelStats;
}

EnergyTypeRegistry.assureEnergyType("FE", 0.25);

// Array of all items and blocks in the mod for the creative group
const SFR_STUFF: number[] = [];

const createItem = (id: string) => {
    IDRegistry.genItemID(`sfr_${id}`);
    Item.createItem(`sfr_${id}`, `sfr_${id}`, {name: `sfr_${id}`, data: 0}, {stack: 64});
    SFR_STUFF.push(ItemID[`sfr_${id}`]);
}

const addShaped = (id: number, count: number, data: number, mask: string[], keys: (string | number)[]) => {
    Recipes.addShaped({id: id, count: count, data: data}, mask, keys);
}

const HORIZONTAL_FACES: number[] = [2, 3, 4, 5];
const ALL_FACES: number[] = [0, 1, 2, 3, 4, 5];

// var _inventory_open = false;
// Callback.addCallback("NativeGuiChanged", (screenName) => {
//     if(screenName == "inventory_screen" || screenName == "inventory_screen_pocket") _inventory_open = true;
//     else _inventory_open = false;
// });

// const panel_tip = (id: number) => {
//     Callback.addCallback("PostLoaded", () => {
//         Item.registerNameOverrideFunction(id, (item, name) => {
//             if(_inventory_open){

//             }
//             if(item.extra != null && item.extra.getLong("SFREnergy", -1) != -1){
//                 name += "\n" + EColor.YELLOW + java.lang.String.format(Translation.translate(""))
//             }
//             return name;
//         });
//     });
// }