import path from 'path';
import winston, { format } from 'winston';

export const logger = winston.createLogger({
	format: format.combine(
		format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
		format.printf(
			(info) => `[${info.timestamp}] [${info.level}] - ${info.message}`,
		),
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: path.join(__dirname, '/../debug.log'),
		}),
	],
});
