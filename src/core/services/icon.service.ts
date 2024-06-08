import type { StringWithAutocomplete } from '@models/string-with-autocomplete.modek'

const generateIcon = (name: string) =>
    `/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/${name}.icns` as const

const ICONS = {
    info: generateIcon('ToolbarInfo'),
    warning: generateIcon('AlertCautionBadgeIcon'),
    error: generateIcon('AlertStopIcon'),
    note: generateIcon('AlertNoteIcon'),
    alert: generateIcon('Actions'),
    like: generateIcon('ToolbarFavoritesIcon'),
    delete: generateIcon('ToolbarDeleteIcon'),

    /**
     *Special icons
     */
    accounts: generateIcon('Accounts'),
    actions: generateIcon('Actions'),
    airDrop: generateIcon('AirDrop'),
    locked: generateIcon('LockedIcon'),
    unlock: generateIcon('UnlockedIcon'),
    sync: generateIcon('Sync'),
    general: generateIcon('General'),
    usersFolder: generateIcon('UsersFolderIcon'),
    unknownUser: generateIcon('UserUnknownIcon'),
    genericFolder: generateIcon('GenericFolderIcon'),
    utilitiesFolder: generateIcon('UtilitiesFolder'),
    systemFolderIcor: generateIcon('SystemFolderIcor'),
    genericDocument: generateIcon('GenericDocumentIcon'),
    genericApplicationIcon: generateIcon('GenericApplicationIcon'),
    problemReport: generateIcon('ProblemReport'),
    unsupported: generateIcon('Unsupported'),
    toolbarInfo: generateIcon('ToolbarInfo'),
    trash: generateIcon('Trashicon'),
    toolbarAdvanced: generateIcon('ToolbarAdvanced'),
    toolbarCustomize: generateIcon('ToolbarCustomizeIcon'),
    notifications: generateIcon('Notifications'),
    executableBinary: generateIcon('ExecutableBinaryIcon'),
    fileVault: generateIcon('FileVaultIcon'),
    finder: generateIcon('FinderIcon'),

    /**
     * Side bar icons
     */
    sidebarAirDrop: generateIcon('SidebarAirDrop'),
    sidebarAirportDisk: generateIcon('SidebarAirportDisk'),
    sidebarAirportExpress: generateIcon('SidebarAirportExpress'),
    sidebarAirportExtreme: generateIcon('SidebarAirportExtreme'),
    sidebarAirportExtremeTower: generateIcon('SidebarAirportExtremeTower'),
    sidebarAllMyFiles: generateIcon('SidebarAllMyFiles'),
    sidebarApplicationsFolder: generateIcon('SidebarApplicationsFolder'),
    sidebarBonjour: generateIcon('SidebarBonjour'),
    sidebarBurnFolder: generateIcon('SidebarBurnFolder'),
    sidebarDesktopFolder: generateIcon('SidebarDesktopFolder'),
    sidebarDisplay: generateIcon('SidebarDisplay'),
    sidebarDocumentsFolder: generateIcon('SidebarDocumentsFolder'),
    sidebarDownloadsFolder: generateIcon('SidebarDownloadsFolder'),
    sidebarDropBoxFolder: generateIcon('SidebarDropBoxFolder'),
    sidebarExternalDisk: generateIcon('SidebarExternalDisk'),
    sidebarGenericFile: generateIcon('SidebarGenericFile'),
    sidebarGenericFolder: generateIcon('SidebarGenericFolder'),
    sidebarHomeFolder: generateIcon('SidebarHomeFolder'),
    sidebariCloud: generateIcon('SidebariCloud'),
    sidebariDisk: generateIcon('SidebariDisk'),
    sidebariMac: generateIcon('SidebariMac'),
    sidebarInternalDisk: generateIcon('SidebarInternalDisk'),
    sidebariPad: generateIcon('SidebariPad'),
    sidebariPhone: generateIcon('SidebariPhone'),
    sidebariPodTouch: generateIcon('SidebariPodTouch'),
    sidebarLaptop: generateIcon('SidebarLaptop'),
    sidebarMacMini: generateIcon('SidebarMacMini'),
    sidebarMacPro: generateIcon('SidebarMacPro'),
    sidebarMacProCylinder: generateIcon('SidebarMacProCylinder'),
    sidebarMoviesFolder: generateIcon('SidebarMoviesFolder'),
    sidebarMusicFolder: generateIcon('SidebarMusicFolder'),
    sidebarNetwork: generateIcon('SidebarNetwork'),
    sidebarOpticalDisk: generateIcon('SidebarOpticalDisk'),
    sidebarPC: generateIcon('SidebarPC'),
    sidebarPicturesFolder: generateIcon('SidebarPicturesFolder'),
    sidebarPrefs: generateIcon('SidebarPrefs'),
    sidebarRecents: generateIcon('SidebarRecents'),
    sidebarRemovableDisk: generateIcon('SidebarRemovableDisk'),
    sidebarServerDrive: generateIcon('SidebarServerDrive'),
    sidebarSmartFolder: generateIcon('SidebarSmartFolder'),
    sidebarTimeCapsule: generateIcon('SidebarTimeCapsule'),
    sidebarTimeMachine: generateIcon('SidebarTimeMachine'),
    sidebarUtilitiesFolder: generateIcon('SidebarUtilitiesFolder'),
    sidebarXserve: generateIcon('SidebarXserve'),
} as const

/**
 * @description
 * Get icons from the system
 *
 * You can use it to get the icon path for a specific icon
 *
 * @example
 * ```typescript
 *     alfredClient.output({
 *      items: [
 *          {
 *              title: 'Some Error',
 *              icon: {
 *                  path: alfredClient.icons.getIcon('error'),
 *              },
 *          },
 *      ],
 *  })
 * ```
 */
export class IconService {
    public getIcon(name: StringWithAutocomplete<keyof typeof ICONS>): string {
        const icon = ICONS[name as keyof typeof ICONS]
        if (!icon) {
            const dyamicIcon = generateIcon(name)
            return dyamicIcon
        }

        return icon
    }
}
