


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


export const logInfo = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ℹ INFO: ${message}`, data ? data : "");
};


export const logError = (message, error = null) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ✖ ERROR: ${message}`, error ? error : "");
};


export const logWarn = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] ⚠ WARN: ${message}`, data ? data : "");
};


export const logSuccess = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ✓ SUCCESS: ${message}`, data ? data : "");
};
