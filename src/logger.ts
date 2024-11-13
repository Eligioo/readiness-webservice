import pino from 'pino'

export const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            destination: loggerDestination(),
            colorize: true,
            translateTime: true
        }
    },
    level: process.env.LOG_LEVEL || 'info'
})

function loggerDestination() {
    if (process.env.LOG_FILE_NAME && typeof process.env.LOG_FILE_NAME === 'string') {
        return process.env.LOG_FILE_NAME
    }

    return undefined
}
