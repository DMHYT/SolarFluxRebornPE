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