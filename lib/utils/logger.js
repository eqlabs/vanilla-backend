const winston = require("winston");
const { createLogger, transports, format } = winston;
const { combine, timestamp, printf } = format;

const consoleTransport = new transports.Console();
// const combinedFiles = new transports.File({ filename: "logs/combined.log" });
// const warnFiles = new transports.File({
//   filename: "logs/warn.log",
//   level: "warn"
// });
// const exceptionsFile = new transports.File({ filename: "logs/exceptions.log" });

function logFormat() {
  return printf(
    info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
  );
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), logFormat()),
  transports: [consoleTransport],
  exceptionHandlers: [new transports.Console()]
});

if (process.env.NODE_ENV === "development") {
  consoleTransport.level = "debug";
}

if (process.env.NODE_ENV === "test") {
  consoleTransport.level = -1;
}

function moduleLogger(module) {
  const { error, warn, info, verbose, debug, silly } = logger;
  const log = options => {
    if (module) {
      let moduleName;
      try {
        moduleName = module.id.substring(module.id.indexOf("/lib/") + 1);
      } catch (e) {
        moduleName = "unable-to-parse-module";
      }
      logger.log(Object.assign({}, { label: moduleName }, options));
    } else logger.log(Object.assign({}, { label: "no-module-given" }, options));
  };

  return {
    error,
    warn,
    info,
    verbose,
    debug,
    silly,
    log
  };
}

module.exports = moduleLogger;
