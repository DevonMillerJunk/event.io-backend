import { Request, Response } from "express";
import { login, getUser, getEventsFromUser, insertUser, updateUser, deleteUser } from "../database/queries";
import { IUserInterface } from "../database/models/User";
import jwt = require("jsonwebtoken");
import config = require('config');

class user {
  public login = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const result = await login(req.body.email, req.body.password);
      if (result.hasOwnProperty("msg")) {
        return res.status(400).json(result);
      }
      jwt.sign(
        {
          user: result
        },
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

  public getUser = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const result = await getUser(req.params.id);
      if (result.hasOwnProperty("msg")) {
        return res.status(400).json(result);
      }
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
        registeredEvents: req.body.registeredEvents || []
      };
      const result = await insertUser(userInt);
      if (result.hasOwnProperty("msg")) {
        return res.status(400).json(result);
      }
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
        registeredEvents: req.body.registeredEvents || []
      };
      const result = await updateUser(req.body.id, userInt);
      if (!result || result.hasOwnProperty("msg")) {
        return res.status(400).json(result || { msg: "Error: Unable to update user" });
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

  public deleteUser = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const result = await deleteUser(req.body.email);
      if (result.hasOwnProperty("msg")) {
        return res.status(400).json(result);
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

  public getEvents = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      const result = await getEventsFromUser(req.params.id);
      if (!result) {
        return res.status(400).json({ msg: "Error: Unable to get events of user" });
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
}

export default new user();
