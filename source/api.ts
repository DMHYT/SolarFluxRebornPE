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

    private _localizations: {[key: string]: string} = {};
    private _default: string = null;

    constructor(readonly panel: PanelData) {};

    public put(lang: string, localization: string): PanelLanguageBuilder {
        lang = lang.toLowerCase();
        if(lang == "en_us") this._default = localization;
        this._localizations[lang] = localization;
        return this;
    }

    public build() {
        if(this._default == null) throw new TypeError("Unable to apply languages: no \'en_us\' value found!");
        this._localizations[Translation.getLanguage()] ??= this._localizations.en_us;
        Translation.addTranslation(`tile.solarflux:solar_panel_${this.panel.name}.name`, this._localizations);
        return this.panel;
    }
    
}

class PanelRecipeBuilder {

    private _shape: [string, string?, string?] = null;
    private _keys: {[key: string]: IDData} = {};
    private _func: Recipes.CraftingFunction = null;

    constructor(readonly panel: PanelData) {};

    public shape(s1: string, s2?: string, s3?: string): PanelRecipeBuilder;
    public shape(mask: [string, string, string]): PanelRecipeBuilder;
    public shape(par1: string | [string, string, string], par2?: string, par3?: string): PanelRecipeBuilder {
        if(typeof par1 === "string") {
            this._shape = [par1];
            typeof par2 === "string" && this._shape.push(par2);
            typeof par3 === "string" && this._shape.push(par3);
        } else if(Array.isArray(par1)) {
            if(par1.length > 3 || par1[0].length > 3 || par1[1].length > 3 || par1[2].length > 3) throw new Error("Recipe shape must be min 1x1 and max 3x3");
            this._shape = par1;
        }
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

    public build(): PanelData;
    public build(amount: number): PanelData;
    public build(amount?: number): PanelData {
        const keys: (string | number)[] = [];
        for(let k in this._keys) keys.push(k, this._keys[k].id, this._keys[k].data);
        Recipes.addShaped({id: BlockID[`sfr_${this.panel.name}`], count: amount ?? 1, data: 0}, this._shape, keys, this._func ?? (() => {}));
        return this.panel;
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
        SolarPanel.createPanelFromStats(this._name, this._height, this._generation, this._capacity, this._transfer);
        return new PanelData(this._name);
    }

}

ModAPI.registerAPI("SolarFluxAPI", {
    vanilla: vanilla,
    item: mod_item,
    block: mod_block,
    panel: () => new PanelBuilder(),
    requireGlobal: (command: string) => eval(command)
});
Logger.Log("Solar Flux Reborn API has been shared with name SolarFluxAPI", "SolarFluxReborn DEBUG");