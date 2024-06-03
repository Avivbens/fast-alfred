export class IconService {
    private readonly ICONS = {
        info: this.generateIcon('ToolbarInfo'),
        warning: this.generateIcon('AlertCautionIcon'),
        error: this.generateIcon('AlertStopIcon'),
        alert: this.generateIcon('Actions'),
        like: this.generateIcon('ToolbarFavoritesIcon'),
        delete: this.generateIcon('ToolbarDeleteIcon'),
    }

    private generateIcon(name: string): string {
        return `/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/${name}.icns`
    }

    public getIcon(name: keyof typeof this.ICONS): string {
        const icon = this.ICONS[name]
        if (!icon) {
            throw new Error(`Icon ${name} not found`)
        }

        return icon
    }
}
