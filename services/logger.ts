/**
 * Enterprise Logger Service
 * Abstraction layer for logging to allow future integration with external services (Sentry, Datadog, etc.)
 */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class LoggerService {
  private isDevelopment = import.meta.env.DEV;

  private log(level: LogLevel, message: string, data?: unknown) {
    if (this.isDevelopment) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

      switch (level) {
        case 'info':
          console.log(prefix, message, data || '');
          break;
        case 'warn':
          console.warn(prefix, message, data || '');
          break;
        case 'error':
          console.error(prefix, message, data || '');
          break;
        case 'debug':
          console.debug(prefix, message, data || '');
          break;
      }
    }

    // TODO: In production, send critical logs to remote service
    if (level === 'error' && !this.isDevelopment) {
      // Sentry.captureException(data);
    }
  }

  public info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  public warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  public error(message: string, data?: unknown) {
    this.log('error', message, data);
  }

  public debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }
}

export const Logger = new LoggerService();
