ModAPI.registerAPI("SolarFlux", {
    Registry: SolarRegistry,
    Connector: SolarConnector,
    requireGlobal: function(command){
        return eval(command);
    }
});

Logger.Log("SolarFluxReborn API shared with name SolarFlux", "API");