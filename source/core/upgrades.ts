namespace SolarUpgrades {

    export interface UpgradeParams {
        getMaxUpgrades(): number;
        update?(tile: SFRTile.PanelTile, amount: number, extra?: ItemExtraData): void;
        canStayInPanel?(tile: SFRTile.PanelTile, stack: ItemInstance, upgradeInv: ItemContainer): boolean;
        canInstall?(tile: SFRTile.PanelTile, stack: ItemInstance, upgradeInv: ItemContainer): boolean;
    }

    export const upgrades: {[key: number]: UpgradeParams} = {};
    
    export function registerUpgrade(id: number, params: UpgradeParams): void {
        params.update ??= () => void 0;
        params.canStayInPanel ??= () => true;
        params.canInstall ??= () => true;
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