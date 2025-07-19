import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'INFO';
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };
    return JSON.stringify(logEntry);
  }

  writeToFile(level, message) {
    const filename = `${new Date().toISOString().split('T')[0]}.log`;
    const filepath = path.join(logsDir, filename);
    
    fs.appendFileSync(filepath, message + '\n');
  }

  log(level, message, meta = {}) {
    if (LOG_LEVELS[level] <= LOG_LEVELS[this.logLevel]) {
      const formattedMessage = this.formatMessage(level, message, meta);
      
      // Console output with colors
      const colors = {
        ERROR: '\x1b[31m', // Red
        WARN: '\x1b[33m',  // Yellow
        INFO: '\x1b[36m',  // Cyan
        DEBUG: '\x1b[90m'  // Gray
      };
      
      console.log(`${colors[level]}[${level}]\x1b[0m ${message}`, meta);
      
      // Write to file in production
      if (process.env.NODE_ENV === 'production') {
        this.writeToFile(level, formattedMessage);
      }
    }
  }

  error(message, meta = {}) {
    this.log('ERROR', message, meta);
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }

  // Request logging middleware
  requestLogger() {
    return (req, res, next) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          duration: `${duration}ms`,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        };

        if (res.statusCode >= 400) {
          this.warn(`${req.method} ${req.originalUrl} - ${res.statusCode}`, logData);
        } else {
          this.info(`${req.method} ${req.originalUrl} - ${res.statusCode}`, logData);
        }
      });

      next();
    };
  }
}

export const logger = new Logger();