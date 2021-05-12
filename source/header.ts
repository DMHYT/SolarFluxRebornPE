/*
 ██████╗ █████╗ ██╗      █████╗ ██████╗   ███████╗██╗     ██╗   ██╗██╗  ██╗  ██████╗ ███████╗██████╗  █████╗ ██████╗ ███╗  ██╗  ██████╗ ███████╗
██╔════╝██╔══██╗██║     ██╔══██╗██╔══██╗  ██╔════╝██║     ██║   ██║╚██╗██╔╝  ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔══██╗████╗ ██║  ██╔══██╗██╔════╝
╚█████╗ ██║  ██║██║     ███████║██████╔╝  █████╗  ██║     ██║   ██║ ╚███╔╝   ██████╔╝█████╗  ██████╦╝██║  ██║██████╔╝██╔██╗██║  ██████╔╝█████╗  
 ╚═══██╗██║  ██║██║     ██╔══██║██╔══██╗  ██╔══╝  ██║     ██║   ██║ ██╔██╗   ██╔══██╗██╔══╝  ██╔══██╗██║  ██║██╔══██╗██║╚████║  ██╔═══╝ ██╔══╝  
██████╔╝╚█████╔╝███████╗██║  ██║██║  ██║  ██║     ███████╗╚██████╔╝██╔╝╚██╗  ██║  ██║███████╗██████╦╝╚█████╔╝██║  ██║██║ ╚███║  ██║     ███████╗
╚═════╝  ╚════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝  ╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝  ╚═╝  ╚═╝╚══════╝╚═════╝  ╚════╝ ╚═╝  ╚═╝╚═╝  ╚══╝  ╚═╝     ╚══════╝
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