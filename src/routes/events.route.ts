import { Request, Response } from "express";
import { getEvents, insertEvent, getEvent, updateEvent, deleteEvent, registerForEvent, removeRegistration } from "../database/queries";
import { IEventInterface } from "../database/models/Event";

class events {
  public getEvents = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const result = await getEvents();
      return res.send(result);
    } catch (error) {
      next(error);
    }
  };

  public createEvent = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const eventInt: IEventInterface = {
        title: req.body.title,
        description: req.body.description,
        ownerId: req.body.ownerId
      };
      const result = await insertEvent(eventInt);
      return res.send(result);
    } catch (error) {
      next(error);
    }
  };

  public getEvent = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const result = await getEvent(req.body.id);
      return res.send(result);
    } catch (error) {
      next(error);
    }
  };

  public updateEvent = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const eventInt: IEventInterface = {
        title: req.body.title,
        description: req.body.description,
        ownerId: req.body.ownerId
      };
      const result = await updateEvent(req.body.id, eventInt);
      return res.send(result);
    } catch (error) {
      next(error);
    }
  };

  public deleteEvent = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const result = await deleteEvent(req.body.id);
      return res.send(result);
    } catch (error) {
      next(error);
    }
  };

  public registerForEvent = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const result = await registerForEvent(req.body.eventId, req.body.userId);
      return res.send(result);
    } catch (error) {
      next(error);
    }
  };

  public removeRegistration = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const result = await removeRegistration(req.body.eventId, req.body.userId);
      return res.send(result);
    } catch (error) {
      next(error);
    }
  };

}

export default new events();
