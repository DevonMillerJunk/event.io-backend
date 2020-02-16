import { Request, Response } from "express";
import { getUser, insertUser, updateUser, deleteUser } from "../database/queries";
import { IUserInterface } from "../database/models/User";

class user {
  public getUser = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const result = await getUser(req.body.email, req.body.password);
      res.send(result);
    } catch (error) {
      next(error);
    }
  };
  public createUser = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const userInt: IUserInterface = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        eventsCreated: req.body.eventsCreated,
        registeredEvents: req.body.registeredEvents
      };
      const result = await insertUser(userInt);
      res.send(result);
    } catch (error) {
      next(error);
    }
  };
  public updateUser = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const userInt: IUserInterface = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        eventsCreated: req.body.eventsCreated,
        registeredEvents: req.body.registeredEvents
      };
      const result = await updateUser(req.body.id, userInt);
      res.send(result);
    } catch (error) {
      next(error);
    }
  };
  public deleteUser = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const result = await deleteUser(req.body.email, req.body.password);
      res.send(result);
    } catch (error) {
      next(error);
    }
  };
  // Sorry, I do not how to fill the last two - Kabishan
  public getRegisteredEvents = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
    } catch (error) {
      next(error);
    }
  };
  public getEvents = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
    } catch (error) {
      next(error);
    }
  };
}

export default new user();
