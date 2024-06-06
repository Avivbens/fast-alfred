const generateIcon = (name: string) =>
    `/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/${name}.icns` as const

const ICONS = {
    info: generateIcon('ToolbarInfo'),
    warning: generateIcon('AlertCautionIcon'),
    error: generateIcon('AlertStopIcon'),
    alert: generateIcon('Actions'),
    like: generateIcon('ToolbarFavoritesIcon'),
    delete: generateIcon('ToolbarDeleteIcon'),
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
    public getIcon(name: keyof typeof ICONS): string {
        const icon = ICONS[name]
        if (!icon) {
            throw new Error(`Icon ${name} not found`)
        }

        return icon
    }
}
