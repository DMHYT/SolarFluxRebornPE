### **[ -> Russian <- ](README.ru.md)**
# **SolarFluxRebornPE**
## **Official port of the Solar Flux Reborn mod from Minecraft Forge 1.12.2 to InnerCore mod launcher**
***
### **Using shared ModAPI to create custom panels**
```js
// Create ModAPI callback
ModAPI.addAPICallback("SolarFluxAPI", function(api) {
    // declare variables for the API members,
    // to make the code a little bit shorter
    const panel = api.panel;
    const vanilla = api.vanilla;
    const item = api.item;
    const block = api.block;
    // Initialize new panel builder object.
    // You don't need any variables, because everything
    // will be made in a single sequential call.
    panel()
        // Set panel name to be used in block id,
        // texture and translation key
        // So, you have to prepare two textures:
        // `sfr_yourname_base_0.png` and `sfr_yourname_top_0.png`
        // Then, you can access to your panel's block id like this: `BlockID.sfr_yourname`
        .name("testing")
        // Panel block main cube height.
        // Default value is 6/16. This method is optional.
        .height(4 / 16)
        // Panel generation in FE/tick
        .generation(524_288)
        // Panel capacity in FE
        .capacity(524_288_000)
        // Panel transfer in FE/tick
        .transfer(4_194_304)
    // After calling this method, panel block itself
    // will have been registered. Now you can add
    // translations and shaped recipes directly in this call.
    .buildAndRegister()
        // Create new translation builder
        .langBuilder()
            // Add translations on different languages
            // by their `language_country` code.
            // en_us translation is REQUIRED
            .put("en_us", "Testing Solar Panel")
            .put("ru_ru", "Тестовая солнечная панель")
            .put("uk_ua", "Тестова сонячна панель")
        // After calling this method, 
        // all translations will be applied
        .build()
        // Create new shaped recipe builder.
        // You can create it as many times as you need,
        // directly in this call
        .recipeBuilder()
            // Shaped recipe mask.
            // It's a representation of crafting table grid,
            // then you have to define item id and data
            // for each character you used
            .shape("ccc", "8b8", "8b8")
            // Use api.item function to specify InnerCore ITEM
            .bind("c", item("sfr_photovoltaic_cell_6"))
            // Use api.block function to specify InnerCore BLOCK
            .bind("8", block("sfr_8"))
            // Use api.vanilla function to specify vanilla item or block
            .bind("b", vanilla(VanillaBlockID.bedrock))
        // Specify the count of the recipe result.
        // You can just call `build()`, this will automatically
        // set recipe result count as 1.
        // So, here we'll receive two panels for one recipe.
        .build(2);
        // Then you can create more recipe builders, if you want.
});
```
***
## **Credits**
### **Me (InnerCore mod developer)**
### **[YouTube - DMH (Russian)](https://www.youtube.com/channel/UCdQKuakM3rnuGV_1VA6XUKQ)**
### **[YouTube - vstannumdum (English)](https://www.youtube.com/channel/UCXHpQ_SQ8VPigIvbbzHWWdA)**
### **[My VK page](https://www.vk.com/vstannumdum)**
### **[Report bugs in my VK public](https://www.vk.com/dmhmods)**
### **Zeitheron (Original Forge mod developer)**
### **[SolarFluxReborn on CurseForge](https://www.curseforge.com/minecraft/mc-mods/solar-flux-reborn)**
### **[Zeitheron on CurseForge](https://www.curseforge.com/members/zeitheron/projects)**
### **[Zeitheron on YouTube](https://www.youtube.com/c/ZeitheronRowdan)**
### **[Zeitheron in Twitter](https://twitter.com/Zeitheron)**
### **[Zeitheron in VK](https://www.vk.com/zeitheron)**
### **[Zeitheron on Patreon](https://www.patreon.com/zeitheron)**