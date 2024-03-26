const { utils } = require('./utils')
const winston = require('winston');
const { combine, timestamp, printf } = winston.format;
require('winston-daily-rotate-file');

const myFormat = printf(({ level, label, message, data, timestamp, request_id }) => {
    return jsonStringify([{
        level, timestamp, request_id, label, message, data
    }])
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'silly',
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    },
    timestamp: true,
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new winston.transports.DailyRotateFile({
            filename: 'application-%DATE%.log',
            dirname: 'logs',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '45d'
        })
    ]
});
const request_logger = winston.createLogger({
    level: 'request',
    levels: {
        request: 0
    },
    timestamp: true,
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new winston.transports.DailyRotateFile({
            filename: 'request-%DATE%.log',
            dirname: 'logs',
            level: 'request',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '45d'
        })
    ]
});
exports.requestlog = async (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let body = { ...req.body };
            body = utils.removeSecret(body);
            let request_id = utils.genReqId(req)

            let data = {
                path: req.path,
                params: jsonStringify(req.params),
                query_params: jsonStringify(req.query),
                body: jsonStringify(body),
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                "user-agent": req.get('user-agent'),
                headers: jsonStringify(req.headers)
            }
            request_logger.log({ level: 'request', data, request_id })
            resolve(request_id)
        } catch (err) {
            console.log('err')
            reject(err)
        }
    })
}

exports.logger = logger;