// Built-in Node Modules
import util from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';

enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

interface LogEntry {
  readonly timestamp: string;
  readonly level: keyof typeof LogLevel;
  readonly message: string;
  readonly data?: any;
}

class Logger {
  private logLevel: LogLevel = LogLevel.INFO;
  private logBuffer: string[] = [];
  private fileLoggingEnabled: boolean = false;
  private logFilePath: string = '';

  constructor(level: LogLevel = LogLevel.INFO) {
    this.logLevel = level;
    this.initializeLogFilePath();
  }

  private initializeLogFilePath(): void {
    // Get the path to the executable directory
    const executablePath = app.getPath('exe');
    const executableDir = path.dirname(executablePath);
    const logsDir = path.join(executableDir, 'logs');
    
    // Ensure logs directory exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    // Create log file name with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    this.logFilePath = path.join(logsDir, `simtr-session-${timestamp}-${Date.now()}.log`);
  }

  setLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  enableFileLogging(enabled: boolean): void {
    this.fileLoggingEnabled = enabled;
    if (enabled) {
      this.log('INFO', 'File logging enabled');
    }
  }

  error(message: string, data?: any): void {
    if (this.logLevel >= LogLevel.ERROR) {
      this.log('ERROR', message, data);
    }
  }

  warn(message: string, data?: any): void {
    if (this.logLevel >= LogLevel.WARN) {
      this.log('WARN', message, data);
    }
  }

  info(message: string, data?: any): void {
    if (this.logLevel >= LogLevel.INFO) {
      this.log('INFO', message, data);
    }
  }

  debug(message: string, data?: any): void {
    if (this.logLevel >= LogLevel.DEBUG) {
      this.log('DEBUG', message, data);
    }
  }

  private log(level: keyof typeof LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };

    const formattedMessage = this.formatMessage(entry);
    
    // Always log to console
    switch (level) {
      case 'ERROR':
        console.error(formattedMessage);
        break;
      case 'WARN':
        console.warn(formattedMessage);
        break;
      case 'INFO':
        console.info(formattedMessage);
        break;
      case 'DEBUG':
        console.debug(formattedMessage);
        break;
    }

    // Store in buffer if file logging is enabled
    if (this.fileLoggingEnabled) {
      this.logBuffer.push(formattedMessage);
    }
  }

  private formatMessage(entry: LogEntry): string {
    const { timestamp, level, message, data } = entry;
    const baseMessage = `[${timestamp}] ${level}: ${message}`;
    
    if (data !== undefined) {
      const dataString = typeof data === 'object' 
        ? util.inspect(data, { depth: 2, colors: false }) // No colors for file output
        : String(data);
      return `${baseMessage}\n${dataString}`;
    }
    
    return baseMessage;
  }

  // Method to save all collected logs to file
  saveLogsToFile(): void {
    if (!this.fileLoggingEnabled || this.logBuffer.length === 0) {
      return;
    }

    try {
      const sessionHeader = `=== Simtr Session Log ===\n`;
      const sessionFooter = `\n=== Session ended at ${new Date().toISOString()} ===\n`;
      const logContent = sessionHeader + this.logBuffer.join('\n') + sessionFooter;
      
      fs.writeFileSync(this.logFilePath, logContent, 'utf8');
      console.log(`Logs saved to: ${this.logFilePath}`);
    } catch (error) {
      console.error('Failed to save logs to file:', error);
    }
  }

  // Get current log file path
  getLogFilePath(): string {
    return this.logFilePath;
  }

  // Get current buffer size
  getBufferSize(): number {
    return this.logBuffer.length;
  }
}

// Create singleton logger instance
const logger = new Logger(
  process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
);

export default logger;
export { LogLevel }; 