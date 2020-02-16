import { Request, Response } from "express";
import { getEvents, insertEvent, getEvent, updateEvent, deleteEvent, registerForEvent, removeRegistration } from "../database/queries";
import { IEventInterface } from "../database/models/Event";
import jwt = require("jsonwebtoken");
import config = require('config');

class events {
  public getEvents = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const result = await getEvents();
      if (!result) {
        return res.status(400).json({ msg: "Error: can't get events" });
      }
      jwt.sign(
        result,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err: any, token: any) => {
          if (err) throw err;
          res.json({ token });
        }
      );
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
      if (!result) {
        return res.status(400).json({ msg: "Error: can't create event" });
      }
      jwt.sign(
        result,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err: any, token: any) => {
          if (err) throw err;
          res.json({ token });
        }
      );
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
      if (!result) {
        return res.status(400).json({ msg: "Error: can't get event" });
      }
      jwt.sign(
        result,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err: any, token: any) => {
          if (err) throw err;
          res.json({ token });
        }
      );
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
      if (!result || result.hasOwnProperty("msg")) {
        return res.status(400).json(result || { msg: "Error: can't update event" });
      }
      jwt.sign(
        result,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err: any, token: any) => {
          if (err) throw err;
          res.json({ token });
        }
      );
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
      if (!result || result.hasOwnProperty("msg")) {
        return res.status(400).json(result || { msg: "Error: can't delete event" });
      }
      jwt.sign(
        { msg: result },
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err: any, token: any) => {
          if (err) throw err;
          res.json({ token });
        }
      );
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
      if (!result || result.hasOwnProperty("msg")) {
        return res.status(400).json(result || { msg: "Error: can't register for event" });
      }
      jwt.sign(
        { msg: result },
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err: any, token: any) => {
          if (err) throw err;
          res.json({ token });
        }
      );
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
      if (!result || result.hasOwnProperty("msg")) {
        return res.status(400).json(result || { msg: "Error: can't remove registration from event" });
      }
      jwt.sign(
        { msg: result },
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err: any, token: any) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      next(error);
    }
  };

}

export default new events();
