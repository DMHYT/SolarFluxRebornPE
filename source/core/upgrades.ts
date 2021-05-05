namespace SolarUpgrades {

    export interface UpgradeParams {
        getMaxUpgrades(): number;
        update(tile: TileEntity, stack: ItemInstance, amount: number): void;
        canStayInPanel(tile: TileEntity, stack: ItemInstance, upgradeInv: ItemContainer): boolean;
        canInstall(tile: TileEntity, stack: ItemInstance, upgradeInv: ItemContainer): boolean;
    }

    export const upgrades: {[key: number]: Nullable<UpgradeParams>} = {};
    
    export function registerUpgrade(id: number, params: UpgradeParams): void {
        upgrades[id] = params
    }

    export function isUpgrade(id: number): boolean {
        return !!~upgrades[id]
    }

    export function removeUpgrade(id: number): void {
        delete upgrades[id]
    }

}