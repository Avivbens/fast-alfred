import { Injectable, Scope } from '@nestjs/common'
import { COLORS_CONFIG, Color } from './logger.config'

const LOG_LEVEL_ORDER = ['error', 'warn', 'log', 'debug', 'verbose'] as const
type LogLevel = (typeof LOG_LEVEL_ORDER)[number]

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
    private _context: string
    private _logLevel: LogLevel = 'log'

    public setContext(context: string) {
        this._context = context
    }

    public setLogLevel(level: LogLevel) {
        this._logLevel = level
    }

    public log(message: string, color?: Color) {
        const shouldLog = this.logLevelGuard('log')
        if (!shouldLog) {
            return
        }

        const generatedMessage = this.generateMessage(message)
        color ? console.log(this.coloredMessage(generatedMessage, color)) : console.log(message)
    }

    public error(message: string) {
        const generatedMessage = this.generateMessage(message)
        console.error(this.coloredMessage(generatedMessage, 'red'))
    }

    public warn(message: string) {
        const shouldLog = this.logLevelGuard('warn')
        if (!shouldLog) {
            return
        }

        const generatedMessage = this.generateMessage(message)
        console.log(this.coloredMessage(generatedMessage, 'yellow'))
    }

    public verbose(message: string) {
        const shouldLog = this.logLevelGuard('verbose')
        if (!shouldLog) {
            return
        }

        const generatedMessage = this.generateMessage(message)
        console.log(this.coloredMessage(generatedMessage, 'cyan'))
    }

    public debug(message: string) {
        const shouldLog = this.logLevelGuard('debug')
        if (!shouldLog) {
            return
        }

        const generatedMessage = this.generateMessage(message)
        console.log(this.coloredMessage(generatedMessage, 'blue'))
    }

    private get context(): string {
        return this._context ? `${this._context}` : ''
    }

    private coloredMessage(message: string, color: Color): string {
        const colorCode = COLORS_CONFIG[color]
        const coloredMessage = `${colorCode}${message}\x1b[0m`

        return coloredMessage
    }

    private generateMessage(message: string): string {
        return `[${this.context}] ${message}`
    }

    /**
     * Check if should log current level
     * @param level - The log level to check against
     * @returns - true if should log, false otherwise
     */
    private logLevelGuard(level: LogLevel): boolean {
        const currentLevelIndex = LOG_LEVEL_ORDER.indexOf(this._logLevel)
        const levelIndex = LOG_LEVEL_ORDER.indexOf(level)

        return currentLevelIndex >= levelIndex
    }
}
