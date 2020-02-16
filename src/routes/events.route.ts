import { Request, Response } from "express";
import { getEvents, insertEvent, getEvent, updateEvent, deleteEvent, registerForEvent, removeRegistration } from "../database/queries";
import { IEventInterface } from "../database/models/Event";
import jwt = require("jsonwebtoken");
import config = require('config');
import Radar from "../util/radar.util";

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
        JSON.parse(JSON.stringify({ events: result })),
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
        ownerId: req.body.ownerId,
        location: {
          lat: req.body.lat,
          long: req.body.long
        },
        timeline: {
          startTime: req.body.startTime,
          endTime: req.body.endTime
        }
      };
      const result = await insertEvent(eventInt);
      if (!result) {
        return res.status(400).json({ msg: "Error: can't create event" });
      }
      await Radar.createGeofence(result._id, req.body.description, req.body.long, req.body.lat);
      jwt.sign(
        JSON.parse(JSON.stringify(result)),
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
      const result = await getEvent(req.params.id);
      if (!result) {
        return res.status(400).json({ msg: "Error: can't get event" });
      }
      console.log(JSON.stringify(result));
      const users = await Radar.getUsersInGeofence(result._id);
      console.log(JSON.stringify(users));
      jwt.sign(
        JSON.parse(JSON.stringify({ ...result, inGeofence: users })),
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
        ownerId: req.body.ownerId,
        location: {
          lat: req.body.lat,
          long: req.body.long
        },
        timeline: {
          startTime: req.body.startTime,
          endTime: req.body.endTime
        }
      };
      const result = await updateEvent(req.params.id, eventInt);
      if (!result || result.hasOwnProperty("msg")) {
        return res.status(400).json(result || { msg: "Error: can't update event" });
      }
      await Radar.updateGeofence(req.params.id, eventInt.title, eventInt.location ? eventInt.location.long : 0, eventInt.location ? eventInt.location.lat : 0);
      jwt.sign(
        JSON.parse(JSON.stringify(result)),
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
      const result = await deleteEvent(req.params.id);
      if (!result || result.hasOwnProperty("msg")) {
        return res.status(400).json(result || { msg: "Error: can't delete event" });
      }
      await Radar.deleteGeofence(req.params.id);
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
      const result = await registerForEvent(req.params.id, req.body.userId);
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
      const result = await removeRegistration(req.params.id, req.body.userId);
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
