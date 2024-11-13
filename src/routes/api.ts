import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { FastifyDone } from '../web'
import { logger } from '../logger'
import * as info from './resources/info'
import cors from './middleware/cors'

export default (fastify: FastifyInstance, opts: FastifyPluginOptions, done: FastifyDone) => {
    logger.trace('Register API routes for webservice')
    fastify.get('', (_, res) => res.send('OK'))

    fastify.get('/info', { preHandler: cors }, info.info)

    done()
}
