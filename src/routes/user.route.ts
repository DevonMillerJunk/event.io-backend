import { Request, Response } from "express";

class user {
  public getUser = async (
    req: Request,
    res: Response,
    next: (error?: any) => void
  ) => {
    try {
      //const result =
      res.send("Hello");
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
    } catch (error) {
      next(error);
    }
  };
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
