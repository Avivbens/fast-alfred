import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { FastAlfred } from './fast-alfred.client'

describe('FastAlfred', () => {
    describe('router', () => {
        it('should refuse a second router, since both would share one session variable', () => {
            /**
             * Skips the constructor, which writes the client's cache to disk
             */
            const alfredClient: FastAlfred = Object.create(FastAlfred.prototype)
            const routes = { checkouts: { schema: z.object({ repo: z.string() }) } }

            alfredClient.router(routes)

            expect(() => alfredClient.router(routes)).toThrow(
                'alfredClient.router() can only be called once per script',
            )
        })
    })
})
