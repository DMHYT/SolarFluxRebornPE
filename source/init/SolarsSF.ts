namespace SolarsSF {
    export const CORE_PANELS: SolarInfo[] = [];
    export var LOOSE_ENERGY: number;
    export function getGeneratingSolars(gen: number): Ingredient {
        // return Ingredient.fromStacks(
            
        // )
        return
    }
    export const modSolars: java.util.List<SolarInfo> = new java.util.ArrayList();
    export function preInit(): void {
        let generations: number[] = [1, 8, 32, 128, 512, 2048, 8192, 32768];
        let transfers: number[] = [8, 64, 256, 1024, 4096, 16384, 65536, 262144];
        let capacities: number[] = [25000, 125000, 425000, 2e6, 8e6, 32e6, 64e6, 128e6];
        
    }
}