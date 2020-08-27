/*
                    _                             ___    _                                        _                                     ______   ______ 
                   | |                           /  _\  | |                                      | |                                   |  __  \ |  ____|
  _____    _____   | |    ___ _    _ ___       _|  /_   | |   _   _    _  _      _ ___    ____   | |___    _____    _ ___    _ ___     | |__)  ||  |___
 /  ___|  /  _  \  | |   /  _' |  | '___|     |_  ___|  | |  | | | |  \ \/ /    | '___|  / __ \  |  _  \  /  _  \  | '___|  | '_  \    |  ____/ |  ___|
 \___  \  | (_) |  | |  |  (_| |  | |           | |     | |  | |_| |   |  |     | |     |   __/  | (_) |  | (_) |  | |      | | | |    | |      | |____
 |_____/  \_____/  |_|   \___,_|  |_|           |_|     |_|   \_,_,|  /_/\_\    |_|      \____|  |_____/  \_____/  |_|      |_| |_|    |_|      |______|
 
 
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
const RF = EnergyTypeRegistry.assureEnergyType("energyRF", 1/4);
const FE = EnergyTypeRegistry.assureEnergyType("FE", 1/4);
const energyTypes = [EU, RF, FE];
const p = Player.get();

Callback.addCallback("LevelLoaded", function(){
    Game.message("§4Solar§eFlux§1Reborn§aPE §l§6by vstannumdum 2020");
});

var debugEnabled = __config__.getBool("debug");