class TileBaseSolar extends TEClass {
    public energy: number;
    public currentGeneration: number;
    public sunIntensity: number;
    public instance: SolarInstance;
    public renderConnectedTextures: boolean = true;
    public crafters: java.util.List<number> = new java.util.ArrayList();
    public readonly generation;
}