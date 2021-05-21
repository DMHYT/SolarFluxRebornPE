/*

 ██████╗ █████╗ ██╗      █████╗ ██████╗     ███████╗██╗     ██╗   ██╗██╗  ██╗
██╔════╝██╔══██╗██║     ██╔══██╗██╔══██╗    ██╔════╝██║     ██║   ██║╚██╗██╔╝
╚█████╗ ██║  ██║██║     ███████║██████╔╝    █████╗  ██║     ██║   ██║ ╚███╔╝ 
 ╚═══██╗██║  ██║██║     ██╔══██║██╔══██╗    ██╔══╝  ██║     ██║   ██║ ██╔██╗ 
██████╔╝╚█████╔╝███████╗██║  ██║██║  ██║    ██║     ███████╗╚██████╔╝██╔╝╚██╗
╚═════╝  ╚════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝
   ██████╗ ███████╗██████╗  █████╗ ██████╗ ███╗  ██╗     ██████╗ ███████╗
   ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔══██╗████╗ ██║     ██╔══██╗██╔════╝
   ██████╔╝█████╗  ██████╦╝██║  ██║██████╔╝██╔██╗██║     ██████╔╝█████╗  
   ██╔══██╗██╔══╝  ██╔══██╗██║  ██║██╔══██╗██║╚████║     ██╔═══╝ ██╔══╝  
   ██║  ██║███████╗██████╦╝╚█████╔╝██║  ██║██║ ╚███║     ██║     ███████╗
   ╚═╝  ╚═╝╚══════╝╚═════╝  ╚════╝ ╚═╝  ╚═╝╚═╝  ╚══╝     ╚═╝     ╚══════╝

*/

// © vstannumdum 2021
// YouTube DMH (Russian)
// YouTube vstannumdum (English)
// My VK - https://www.vk.com/vstannumdum
// Report bugs in VK Public - https://www.vk.com/dmhmods
// Original Forge mod by Zeitheron and DragonForgeMC

IMPORT("EnergyNet");
IMPORT("StorageInterface");
IMPORT("ChargeItem");

const JavaMath = new (WRAP_JAVA("ua.vsdum.sfrpe.Main"))();

const clamp = (num: number, min: number, max: number) => num < min ? min : (num > max ? max : num);
const numberWithCommas = (x: number) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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
    } as PanelStats
}

const FE: EnergyType = EnergyTypeRegistry.assureEnergyType("FE", 0.25);
const EU: EnergyType = EnergyTypeRegistry.assureEnergyType("Eu", 1);
const RF: EnergyType = EnergyTypeRegistry.assureEnergyType("RF", 0.25);

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