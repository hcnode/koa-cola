import * as winston from 'winston'
import winston_daily_rotate_file = require('winston-daily-rotate-file')
const logPath = (app.config.logPath || (process.cwd() + '/logs'));
const path = require('path');
require('fs-extra').ensureDirSync(logPath);
var logger = new (winston.Logger)({
	transports: [
		new (winston_daily_rotate_file)({ // 记录info以下的日志
			name: 'info-file',
			filename: path.join(logPath, 'info.log'),
			datePattern: '.yyyy-MM-dd',
			level: 'info'
		}),
		new (winston_daily_rotate_file)({ // 只记录error日志
			name: 'error-file',
			filename: path.join(logPath, 'error.log'),
			datePattern: '.yyyy-MM-dd',
			level: 'error'
		})
	]
});
export default logger;
