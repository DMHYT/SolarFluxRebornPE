interface IDData { id: number, data: number }

const vanilla = (id: number, data?: number) => {
    return { id: id, data: data ?? -1 } as IDData;
}

const mod_item = (id: string, data?: number) => {
    return { id: ItemID[id] ?? 0, data: data ?? -1 } as IDData;
}

const mod_block = (id: string, data?: number) => {
    return {id: BlockID[id] ?? 0, data: typeof data !== "undefined" ? data > 16 ? 0 : data < -1 ? -1 : data : -1} as IDData;
}

class PanelLanguageBuilder {

    public localizations: {[key: string]: string} = {};
    public default: string = null;

    constructor(readonly panel: PanelData) {};

    public put(lang: string, localization: string): PanelLanguageBuilder {
        lang = lang.toLowerCase();
        if(lang == "en_us") this.default = localization;
        this.localizations[lang] = localization;
        return this;
    }

    public build() {
        if(this.default == null) throw new TypeError("Unable to apply languages: no \'en_us\' value found!");
        this.localizations[Translation.getLanguage()] ??= this.localizations.en_us;
        Translation.addTranslation(`tile.solarflux:solar_panel_${this.panel.name}.name`, this.localizations);
        return this.panel;
    }
    
}

class PanelRecipeBuilder {

    private _shape: [string, string?, string?] = null;
    private _keys: {[key: string]: IDData} = {};
    private _func: Recipes.CraftingFunction = null;

    constructor(readonly panel: PanelData) {};

    public shape(...args: [string, string?, string?]): PanelRecipeBuilder {
        if(arguments.length > 3 || args[0].length > 3 || args[1].length > 3 || args[2].length > 3) throw new Error("Recipe shape must be min 1x1 and max 3x3");
        this._shape = args;
        return this;
    }

    public bind(ch: string, def: IDData): PanelRecipeBuilder {
        if(ch.length > 1) throw new Error(`${ch} is not a single character!`);
        this._keys[ch] = def;
        return this;
    }

    public func(func: Recipes.CraftingFunction): PanelRecipeBuilder {
        this._func = func;
        return this;
    }

    public build(): PanelRecipeBuilder;
    public build(amount: number): PanelRecipeBuilder;
    public build(amount?: number): PanelRecipeBuilder {
        const keys: (string | number)[] = [];
        for(let k in this._keys) keys.push(k, this._keys[k].id, this._keys[k].data);
        Recipes.addShaped({id: BlockID[`sfr_${this.panel.name}`], count: amount ?? 1, data: 0}, this._shape, keys, this._func ?? (() => {}));
        return this;
    }

}

class PanelData {

    constructor(readonly name: string) {};

    public langBuilder(): PanelLanguageBuilder {
        return new PanelLanguageBuilder(this);
    }

    public recipeBuilder(): PanelRecipeBuilder {
        return new PanelRecipeBuilder(this);
    }

}

class PanelBuilder {

    private _name: string = null;
    private _height: number = 6/16;
    private _generation: number = null;
    private _capacity: number = null;
    private _transfer: number = null;

    constructor() {};

    public name(n: string): PanelBuilder {
        this._name = n;
        return this;
    }

    public height(h: number): PanelBuilder {
        this._height = h;
        return this;
    }

    public generation(g: number | string): PanelBuilder {
        this._generation = typeof g === "number" ? g : parseInt(g);
        return this;
    }

    public capacity(c: number | string): PanelBuilder {
        this._capacity = typeof c === "number" ? c : parseInt(c);
        return this;
    }

    public transfer(t: number | string): PanelBuilder {
        this._transfer = typeof t === "number" ? t : parseInt(t);
        return this;
    }

    public buildAndRegister(): PanelData {
        if(this._name == null) throw new TypeError("name == null");
        if(this._generation == null) throw new TypeError("generation == null");
        if(this._capacity == null) throw new TypeError("capacity == null");
        if(this._transfer == null) throw new TypeError("transfer == null");
        createPanelFromStats(this._name, this._height, this._generation, this._capacity, this._transfer);
        return new PanelData(this._name);
    }

}

ModAPI.registerAPI("SolarFluxAPI", {
    vanilla: vanilla,
    item: mod_item,
    block: mod_block,
    panel: () => new PanelBuilder(),
    requireGlobal(command: string) {
        return eval(command);
    }
});
Logger.Log("Solar Flux Reborn API has been shared with name SolarFluxAPI", "SolarFluxReborn DEBUG");