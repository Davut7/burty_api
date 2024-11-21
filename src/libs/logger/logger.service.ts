import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import 'winston-mongodb';

@Injectable()
export class LoggerService {
    private logger: winston.Logger;
    private logsDir = path.resolve(__dirname, '..', '..', 'logs');

    constructor(private readonly configService: ConfigService) {
        const environment = configService.get<string>('NODE_ENV');
        let logLevel = 'debug';

        if (environment === 'prod') {
            logLevel = 'warn';
        } else if (environment === 'test') {
            logLevel = 'error';
        } else {
            logLevel = 'debug';
        }

        this.logger = winston.createLogger({
            level: logLevel,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            transports: [
                new winston.transports.Console({
                    level: logLevel,
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple(),
                    ),
                }),
            ],
        });

        if (environment === 'prod') {
            this.logger.add(
                new DailyRotateFile({
                    dirname: this.logsDir,
                    filename: 'error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    level: 'error',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                }),
            );
            this.logger.add(
                new DailyRotateFile({
                    dirname: this.logsDir,
                    filename: 'combined-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                }),
            );
            this.logger.add(
                new winston.transports.MongoDB({
                    level: 'error',
                    db: configService.get<string>('MONGODB_URI'),
                    collection: 'logs',
                    tryReconnect: true,
                }),
            );

            this.logger.add(
                new winston.transports.File({
                    filename: path.join(this.logsDir, 'production.log'),
                }),
            );
        }
    }

    log(message: string, context?: string) {
        this.logger.info(message, { context });
    }

    error(message: string, trace: string, context?: string) {
        this.logger.error(message, { trace, context });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context });
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, { context });
    }

    verbose(message: string, context?: string) {
        this.logger.verbose(message, { context });
    }
}
