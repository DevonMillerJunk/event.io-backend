import app from "./app";
import loggerUtil from "./util/logger.util";

const server = new app();
const logger = new loggerUtil("server");
try {
  if (!process.env.PORT)
    throw new Error("ERROR: Missing Express Server Port").stack;
  server.startServer(process.env.PORT || "");
} catch (error) {
  logger.error(error);
}
