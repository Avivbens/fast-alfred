import { Module } from '@nestjs/common'
import { PackCommand } from './commands/pack/pack.command'
import { LoggerModule } from './core/logger/logger.module'

const COMMANDS = [PackCommand]

@Module({
    imports: [LoggerModule.register()],
    providers: [...COMMANDS],
})
export class AppModule {}
