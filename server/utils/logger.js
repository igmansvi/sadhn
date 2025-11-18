/**
 * Logger Utility
 *
 * Provides logging functionality for HTTP requests and application events.
 * Logs include timestamp, method, URL, status code, and response time.
 *
 * @module utils/logger
 */

/**
 * Logs HTTP request details including method, URL, status code, and response time
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const status = res.statusCode;
    const ip = req.ip || req.connection.remoteAddress;

    const statusColor =
      status >= 500
        ? "\x1b[31m"
        : status >= 400
        ? "\x1b[33m"
        : status >= 300
        ? "\x1b[36m"
        : status >= 200
        ? "\x1b[32m"
        : "\x1b[0m";
    const resetColor = "\x1b[0m";

    console.log(
      `[${timestamp}] ${method} ${url} ${statusColor}${status}${resetColor} ${duration}ms - ${ip}`
    );
  });

  next();
};

/**
 * Logs informational messages
 *
 * @param {string} message - The message to log
 * @param {Object} [data] - Optional data to log with the message
 */
export const logInfo = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ℹ INFO: ${message}`, data ? data : "");
};

/**
 * Logs error messages
 *
 * @param {string} message - The error message to log
 * @param {Error|Object} [error] - Optional error object or additional data
 */
export const logError = (message, error = null) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ✖ ERROR: ${message}`, error ? error : "");
};

/**
 * Logs warning messages
 *
 * @param {string} message - The warning message to log
 * @param {Object} [data] - Optional data to log with the message
 */
export const logWarn = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] ⚠ WARN: ${message}`, data ? data : "");
};

/**
 * Logs success messages
 *
 * @param {string} message - The success message to log
 * @param {Object} [data] - Optional data to log with the message
 */
export const logSuccess = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ✓ SUCCESS: ${message}`, data ? data : "");
};
