/// <reference path="core-engine.d.ts" />
/** Interface used in SolarFluxReborn custom panel recipe builder */
declare interface IDData { id: number, data: number }
/** Interface used to create translations for custom SolarFluxReborn panel name */
declare interface PanelLanguageBuilder {
    /** `PanelData` object, from which this language builder object was created */
    readonly panel: PanelData;
    /** Adds new language by given two-letter code to panel name localization object */
    put(lang: string, localization: string): PanelLanguageBuilder;
    /** Creates translation and @returns panel data object to keep working in sequential call */
    build(): PanelData;
}
/** Interface used to create shaped workbench recipes for custom SolarFluxReborn panel */
declare interface PanelRecipeBuilder {
    /** `PanelData` object, from which this recipe builder object was created */
    readonly panel: PanelData;
    /** Adds craft mask to the panel recipe, like in default `Recipes.addShaped` method */
    shape(line1: string, line2?: string, line3?: string): PanelRecipeBuilder;
    shape(mask?: [string, string?, string?]): PanelRecipeBuilder;
    /** Binds given character in craft mask to given item's or block's id and data */
    bind(ch: string, def: IDData): PanelRecipeBuilder;
    /** Adds custom crafting function to be called when the panel is crafted */
    func(func: Recipes.CraftingFunction): PanelRecipeBuilder;
    /**
     * Registers shaped recipe with result count 1
     * @returns panel data object to keep working in sequential call
     */
    build(): PanelData;
    /**
     * Registers shaped recipe with given result count
     * @returns panel data object to keep working in sequential call
     */
    build(amount: number): PanelData;
}
/** Interface to create translation and shaped recipes for the following custom panel */
declare interface PanelData {
    /** @returns following panel's translation builder object */
    langBuilder(): PanelLanguageBuilder;
    /**
     * @returns following panel's shaped recipe builder object
     * (can be created multiple times to register different recipes for single panel)
     */
    recipeBuilder(): PanelRecipeBuilder;
}
/** Interface to register new custom solar panel block, and then add name translation and shaped recipes */
declare interface PanelBuilder {
    /** 
     * Sets panel name to use in id, texture and translation key.
     * 
     * Textures must be `sfr_yourname_base_0.png` and `sfr_yourname_top_0.png`
     * 
     * Then you can access to your panel's block id like this: `BlockID.sfr_yourname`
     */
    name(n: string): PanelBuilder;
    /** Set panel block cube height (default is 6/16) */
    height(h: number): PanelBuilder;
    /** Set panel generation in FE/tick */
    generation(g: number): PanelBuilder;
    generation(g: string): PanelBuilder;
    /** Set panel capacity in FE */
    capacity(c: number): PanelBuilder;
    capacity(c: string): PanelBuilder;
    /** Set panel transfer in FE/tick */
    transfer(t: number): PanelBuilder;
    transfer(t: string): PanelBuilder;
    /** 
     * Creates new solar panel from previously given params 
     * @returns panel data object to be used 
     * to create name translation and shaped recipes for the following panel
     */
    buildAndRegister(): PanelData;
}
/** Interface to be used to specify params for custom solar panel upgrades */
declare interface SolarFluxUpgradeParams {
    /** @returns how many upgrades can maximum be in panel at the same time (required) */
    getMaxUpgrades(): number;
    /** Function that will be called every tick, when the upgrade item is inside of the solar panel (optional) */
    update?(tile: TileEntity, amount: number, extra?: ItemExtraData): void;
    /** @returns whether the given upgrade item can stay in the given solar panel */
    canStayInPanel?(tile: TileEntity, stack: ItemInstance, upgradeInv: ItemContainer): boolean;
    /** @returns whether the given upgrade item can be installed into the given solar panel */
    canInstall?(tile: TileEntity, stack: ItemInstance, upgradeInv: ItemContainer): boolean;
}
/** Small module to register custom solar panel upgrades */
declare interface SolarFluxUpgradeRegistry {
    /** Object containing all registered solar panel upgrades */
    readonly upgrades: {[key: number]: SolarFluxUpgradeParams};
    /** Registers the item of given id as solar panel upgrades with given params */
    registerUpgrade(id: number, params: SolarFluxUpgradeParams): void;
    /** @returns whether the item of given numeric id is registered as solar panel upgrade */
    isUpgrade(id: number): boolean;
    /** @returns solar panel upgrade params for the item of given id, or null, if it is not registered as an upgrade */
    getUpgrade(id: number): Nullable<SolarFluxUpgradeParams>;
    /** Removes solar panel upgrade params for the item of given id */
    removeUpgrade(id: number): void;
}
/** Solar Flux Reborn shared ModAPI object */
declare interface SolarFluxAPI {
    /** @returns vanilla item's id and data object from given numeric id and optional data */
    vanilla(id: number, data?: number): IDData;
    /** @returns InnerCore item's id and data object from given string id and optional data */
    item(id: string, data?: number): IDData;
    /** @returns InnerCore block's id and data object from given string id and optional data */
    block(id: string, data?: number): IDData;
    /** @returns `PanelBuilder` object to register new custom solar panel */
    panel(): PanelBuilder;
    readonly UpgradeRegistry: SolarFluxUpgradeRegistry;
}
declare namespace ModAPI {
    /** Callback to use Solar Flux Reborn shared ModAPI */
    function registerAPI(apiName: "SolarFluxAPI", func: (api: SolarFluxAPI) => void): void;
}