ModAPI.registerAPI("SolarFlux", {
    Core: SolarRegistry,
    requireGlobal: function(command){
        return eval(command);
    }
});

Logger.Log("SolarFluxReborn API shared with name SolarFlux", "API");