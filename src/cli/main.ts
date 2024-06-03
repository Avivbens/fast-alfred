import { CommandFactory } from 'nest-commander'
import { PACKAGE_NAME, PACKAGE_VERSION } from '@common/constants'
import { AppModule } from './app.module'

;(async () => {
    const cliCommand = PACKAGE_NAME

    const app = await CommandFactory.createWithoutRunning(AppModule, {
        errorHandler: () => {
            process.exit(1)
        },
        version: PACKAGE_VERSION,
        completion: {
            cmd: cliCommand,
        },
    })

    await CommandFactory.runApplication(app)
})()
