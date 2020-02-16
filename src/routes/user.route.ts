import { Request, Response } from "express";
import { getUser, getEventsFromUser, insertUser, updateUser, deleteUser } from "../database/queries";
import { IUserInterface } from "../database/models/User";
import jwt = require("jsonwebtoken");
import config = require('config');

class user {
  public getUser = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const result = await getUser(req.body.email, req.body.password);
      if (result.hasOwnProperty("msg")) {
        return res.status(400).json(result);
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
        registeredEvents: req.body.registeredEvents || null
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
        registeredEvents: req.body.registeredEvents || null
      };
      const result = await updateUser(req.body.id, userInt);
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

  public deleteUser = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const result = await deleteUser(req.body.email);
      res.send(result);
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
      const result = await getEventsFromUser(req.body.id);
    } catch (error) {
      next(error);
    }
  };
}

export default new user();
