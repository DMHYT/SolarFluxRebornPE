namespace SolarUpgrades {

    export interface UpgradeParams {
        getMaxUpgrades(): number;
        update(tile: TileEntity, amount: number, extra?: ItemExtraData): void;
        canStayInPanel(tile: TileEntity, stack: ItemInstance, upgradeInv: ItemContainer): boolean;
        canInstall(tile: TileEntity, stack: ItemInstance, upgradeInv: ItemContainer): boolean;
        [key: string]: any;
    }

    export const upgrades: {[key: number]: UpgradeParams} = {};
    
    export function registerUpgrade(id: number, params: UpgradeParams): void {
        upgrades[id] = params;
    }

    export function isUpgrade(id: number): boolean {
        return !!upgrades[id];
    }
    
    export function getUpgrade(id: number): Nullable<UpgradeParams> {
        return isUpgrade(id) ? upgrades[id] : null;
    }

    export function removeUpgrade(id: number): void {
        delete upgrades[id];
    }

}