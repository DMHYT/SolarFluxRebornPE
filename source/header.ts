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
IMPORT("VanillaSlots");

declare interface BlockPos extends Vector {
    readonly dimension: number;
}
declare interface BlockPosFace extends BlockPos {
    readonly side: number;
    readonly rate: number;
}

const clamp = (num: number, min: number, max: number) => num < min ? min : (num > max ? max : num);

interface PanelStats {
    generation: number;
    transfer: number;
    capacity: number;
}

const getStatsFor = (id: string) => {
    return {
        generation: __config__.getNumber(`panel_stats.${id}.generation`).longValue(),
        transfer: __config__.getNumber(`panel_stats.${id}.transfer`).longValue(),
        capacity: __config__.getNumber(`panel_stats.${id}.capacity`).longValue()
    } as PanelStats;
}

EnergyTypeRegistry.assureEnergyType("FE", 0.25);

// Array of all items and blocks in the mod for the creative group
const SFR_STUFF: number[] = [];

const createItem = (id: string) => {
    IDRegistry.genItemID(`sfr_${id}`);
    Item.createItem(`sfr_${id}`, `item.solarflux:${id}.name`, {name: `${id}`, data: 0}, {stack: 64});
    SFR_STUFF.push(ItemID[`sfr_${id}`]);
}

const addShaped = (id: number, count: number, data: number, mask: string[], keys: (string | number)[]) => {
    Recipes.addShaped({id: id, count: count, data: data}, mask, keys);
}

const SUN_INTENSITY_UPDATE_INTERVAL = __config__.getNumber("sun_intensity_update_interval").intValue();
const PICKUP_ENERGY_LOSS = __config__.getNumber("pickup_energy_loss").intValue(); // TODO change to float when it is fixed in mod manager
const DIFFERENT_PANEL_HEIGHT = __config__.getBool("different_panel_height");
const RAIN_MULTIPLIER = clamp(__config__.getNumber("rain_multiplier").floatValue(), 0, 1);
const THUNDER_MULTIPLIER = clamp(__config__.getNumber("thunder_multiplier").floatValue(), 0, 1);
const CONTAINER_UPDATE_INTERVAL = __config__.getBool("specify_container_update_interval") ? clamp(__config__.getNumber("container_update_interval").intValue(), 2, 20) : 1;
const ENERGY_AUTO_BALANCING_INTERVAL = __config__.getBool("energy_auto_balancing") ? clamp(__config__.getNumber("energy_auto_balancing_interval").intValue(), 1, 100) : -1;

const Long = java.lang.Long;
const JavaString = java.lang.String;
const JavaInt = java.lang.Integer;
const IllegalArgumentException = java.lang.IllegalArgumentException;
const Color = android.graphics.Color;

const RF = EnergyTypeRegistry.assureEnergyType("RF", 0.25);