import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import loggerUtil from "./util/logger.util";
import events from "./routes/events.route";
import user from "./routes/user.route";
class App {
  private app = express();
  private logger = new loggerUtil("server");
  constructor() {
    //Define app.map
    this.app.map = (a: any, route: string) => {
      route = route || "";
      for (var key in a) {
        switch (typeof a[key]) {
          // { '/path': { ... }}
          case "object":
            this.app.map(a[key], route + key);
            break;
          // get: function(){ ... }
          case "function":
            // @ts-ignore
            this.app[key](route, a[key]);
            break;
        }
      }
    };
    // allow CORs requests
    this.app.use((req: Request, res: Response, next: () => void) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Token, Ocp-Apim-Trace "
      );
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      next();
    });
    // parse application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    this.app.use(bodyParser.json());
    this.app.use((req: Request, res: Response, next: () => void) => {
      this.logger.info(`${req.method} ${req.url}`);
      next();
    });
    //Main Router Call to Handle all Requests except Authentication
    this.app.map({
      "/user": {
        get: user.getUser,
        post: user.createUser,
        put: user.updateUser,
        delete: user.deleteUser,
        "/registered": {
          get: user.getRegisteredEvents
        },
        "/hosted": {
          get: user.getEvents
        }
      },
      "/events": {
        get: events.getEvents,
        post: events.createEvent,
        "/:id": {
          get: events.getEvent,
          put: events.updateEvent,
          delete: events.deleteEvent,
          "/register": {
            post: events.registerForEvent,
            delete: events.removeRegistration
          }
        }
      }
    });
    this.app.use(
      (error: Error, req: Request, res: Response, next: () => void) => {
        this.logger.error(error);
        res.status(400).send({
          error,
          info: error.message,
          message: "Client side request error.",
          request: req.url,
          statusCode: 400
        });
      }
    );
  }
  public startServer(port: string) {
    console.log(`Server started on port ${port}`);
    this.app.listen(port, () => {
      this.logger.info(`Server started on port ${port}`);
    });
  }
}
export default App;
