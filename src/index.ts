import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import loggerUtil from "./util/logger.util";
import { connectDB } from "./database/index";

import { getUser, deleteUser, updateUser, insertUser } from './database/queries';
import { IUserInterface } from "./database/models/User";

const server = new app();
const logger = new loggerUtil("server");
try {
  if (!process.env.PORT) {
    console.log("NO PORT");
    throw new Error("ERROR: Missing Express Server Port").stack;
  }

  //Connect to DB
  (async () => {
    await connectDB();
  })();

  server.startServer(process.env.PORT || "");


  (async () => {
    const firstUser: IUserInterface = {
      name: 'Kabishan',
      email: 'ksuvendran@gmail.com',
      password: 'qwerty67809',
      eventsCreated: [],
      registeredEvents: []
    }
    const insertedUser = await insertUser(firstUser);
    console.log("Inserted User: " + insertedUser);
  })();

} catch (error) {
  logger.error(error);
}
