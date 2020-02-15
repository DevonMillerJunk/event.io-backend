import bunyan from "bunyan";
import debug from "debug";

class Logger {
  private bunyanLogger: bunyan;
  private serverLogger: debug.Debugger;
  private isDevelopment = process.env.NODE_ENV !== "production";
  private isTesting = process.env.NODE_ENV === "test";
  private namespace: string;
  constructor(namespace: string) {
    this.namespace = `event.io:${namespace}:`;
    this.bunyanLogger = bunyan.createLogger({
      name: this.namespace,
      streams: [
        {
          level: "info",
          path: `${__dirname}/logs/info.log`, // hook this to some production logging set up
          stream: process.stdout
        },
        {
          level: "error",
          path: `${__dirname}/logs/error.json`, // hook this to some production logging set up
          stream: process.stderr
        }
      ]
    });
    this.serverLogger = debug(this.namespace);
  }
  public debug(message: any) {
    if (this.isTesting) return;
    if (this.isDevelopment) {
      const templatedMessage = `DEBUG: ${message}`;
      this.serverLogger(templatedMessage);
    }
  }
  public info(message: any) {
    if (this.isTesting) return;
    const templatedMessage = `INFO: ${message}`;
    if (this.isDevelopment) {
      this.serverLogger(templatedMessage);
    } else {
      this.bunyanLogger.info(templatedMessage);
    }
  }
  public error(message: any) {
    if (this.isTesting) return;
    const templatedMessage = `ERROR: ${message}`;
    if (this.isDevelopment) {
      this.serverLogger(templatedMessage);
    } else {
      this.bunyanLogger.error(templatedMessage);
    }
  }
}
export default Logger;
