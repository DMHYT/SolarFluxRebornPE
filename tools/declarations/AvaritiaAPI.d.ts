/// <reference path="core-engine.d.ts" />
/** Custom function which you can specify in shaped and shapeless recipes */
declare interface ExtremeCraftFunction {
    (container: ItemContainer): void;
}
/** Avaritia shared ModAPI object */
declare interface AvaritiaAPI {
    /**
     * Creates new shaped recipe in extreme crafting table.
     * Same params as in `Recipe.addShaped` InnerCore method, 
     * but with 9x9 possible grid.
     */
    addExtremeShapedRecipe(result: ItemInstance, mask: string[], keys: (string | number)[], func?: ExtremeCraftFunction): void;
    /**
     * Creates new shapeless recipe in extreme crafting table.
     * Almost same params as in `Recipe.addShapeless` InnerCore method, 
     * but with possible maximum of 81 ingredients.
     * @param items array of arrays, containing id and data respectively of each ingredient
     */
    addExtremeShapelessRecipe(result: ItemInstance, items: [number, number][], func?: ExtremeCraftFunction): void;
    /**
     * Creates new item that can be produced in neutronium compressor from given material count
     * @param outputId numeric id of the result item
     * @param inputId numeric id of the material
     * @param inputCount material item count to craft 1 result item
     * @param inputData material data or -1 to ignore data
     * @param specific if false, material count will be increased
     * when having some simplifying mods, like IC2 and TConstruct.
     * If true, material count will always be of the value you specified.
     */
    addCompressorRecipe(outputId: number, inputId: number, inputCount: number, inputData: number, specific: boolean): void;
    /** @returns some non-exported variable, module or function from the mod, if you need it */
    requireGlobal(something: string): any;
}
declare namespace ModAPI {
    /** Callback to use Avaritia shared ModAPI */
    function addAPICallback(apiName: "AvaritiaAPI", func: (api: AvaritiaAPI) => void): void;
}