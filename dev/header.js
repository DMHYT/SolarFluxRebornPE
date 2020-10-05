/*

█▀▀ █▀▀█ █   █▀▀█ █▀▀█   █▀▀ █   █  █ █ █   █▀▀█ █▀▀ █▀▀▄ █▀▀█ █▀▀█ █▀▀▄   █▀▀█ █▀▀
▀▀█ █  █ █   █▄▄█ █▄▄▀   █▀▀ █   █  █ ▄▀▄   █▄▄▀ █▀▀ █▀▀▄ █  █ █▄▄▀ █  █   █  █ █▀▀
▀▀▀ ▀▀▀▀ ▀▀▀ ▀  ▀ ▀ ▀▀   ▀   ▀▀▀  ▀▀▀ ▀ ▀   ▀ ▀▀ ▀▀▀ ▀▀▀  ▀▀▀▀ ▀ ▀▀ ▀  ▀   █▀▀▀ ▀▀▀

*/

//© vstannumdum 2020
//YouTube DMH (Russian)
//YouTube vstannumdum (English)
//My VK - https://www.vk.com/vstannumdum
//Report bugs in VK Public - https://www.vk.com/dmhmods

IMPORT("EnergyNet");
IMPORT("ChargeItem");
IMPORT("StorageInterface");

const GUI_SCALE = 3.2;
const EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);
const RF = EnergyTypeRegistry.assureEnergyType("RF", 1 / 4);
const p = Player.get();
const PANELS_ARRAY = [];

Callback.addCallback("LevelLoaded", function(){
    Game.message("§4Solar§eFlux§1Reborn§aPE §l§6by vstannumdum 2020");
});

const debugEnabled = __config__.getBool("debug");
const EUP = __config__.getBool("EU_panels");

var GLOBAL_PANELNET_ID = 0;

function getNeighbours(coords){
    return [
        {x: coords.x+1, y: coords.y, z: coords.z},
        {x: coords.x-1, y: coords.y, z: coords.z},
        {x: coords.x, y: coords.y, z: coords.z+1},
        {x: coords.x, y: coords.y, z: coords.z-1}
    ];
}

//from https://github.com/DMHYT/different-codes/

function FANCYNUM(str){
    if(typeof str != "string") str = str.toString();
    let a = str.split("").reverse(), nw = [], o = 0;
    for(let i in a){
        nw.push(a[i]);
        o++;
        if(o == 3){
            o = 0;
            nw.push(",");
        }
    }
    nw = nw.reverse();
    if(nw[0] == ".") delete nw[0];
    return nw.join("");
}