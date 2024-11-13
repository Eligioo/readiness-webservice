import Fastify from 'fastify'
import { logger } from './logger'
import ApiRouter from './routes/api'

const web = Fastify()
const port = Number.parseInt(process.env.WEBSERVICE_PORT as string) || 8090

// Wrapper type to match Fasify type definition
export type FastifyDone = (err?: Error | undefined) => void

export async function launchWebService() {
    web.register(ApiRouter, { prefix: '/api' })

    logger.info("Connecting with Redis")
    web.register(require('@fastify/redis'), { host: '127.0.0.1' })

    web.listen({
        port: port
    }, (err) => {
        if (err) {
            logger.fatal(err.message)
            process.exit(1)
        }
        logger.info(`Webservice running port ${port}`)
    })
}
