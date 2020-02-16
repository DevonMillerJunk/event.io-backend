import User, { IUserInterface } from "./models/User";
import Event, { IEventInterface, attendee } from "./models/Event";
import loggerUtil from "../util/logger.util";
import { hashEncrypt, compare } from "../util/password.util";
const logger = new loggerUtil("server");

//Users
export const getUser = async (email: string, password: string) => {
    const user = await User.findOne({ email }, (err: any, user: any) => {
        if (err) {
            logger.error(err);
            return null;
        }
        return user;
    });
    if (!user) {
        return "Error: No user with that email";
    } else {
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return "Error: No user with that email";
        }
    }
    return user;
}

export const deleteUser = async (email: string) => {
    return await User.deleteOne({ email }, (err: any) => {
        if (err) {
            logger.error(err);
            return false;
        }
        return true;
    });
}

export const updateUser = async (id: string, body: IUserInterface) => {
    const encryptedPassword = await hashEncrypt(body.password);
    return await User.findByIdAndUpdate(id, { ...body, "password": encryptedPassword }, (err: any) => {
        if (err) {
            logger.error(err);
            return false;
        }
        return true;
    });
}

export const insertUser = async (body: IUserInterface) => {
    const replicate = await User.findOne({ "email": body.email });
    if (replicate) {
        return "Error: Email already in use";
    }
    const encryptedPassword = await hashEncrypt(body.password);
    const newUser = new User({ ...body, "password": encryptedPassword });
    return await newUser.save();
}

//Events
export const getEvents = async (ownerId: string) => {
    return await Event.find({ ownerId }, (err: any, event: any) => {
        if (err) {
            logger.error(err);
            return null;
        }
        return event;
    });
}

export const getEvent = async (id: string) => {
    return await Event.findById(id, (err: any, event: any) => {
        if (err) {
            logger.error(err);
            return null;
        }
        return event;
    });
}

export const deleteEvent = async (id: string) => {
    return await User.findByIdAndDelete(id, (err: any) => {
        if (err) {
            logger.error(err);
            return false;
        }
        return true;
    });
}

export const updateEvent = async (id: string, body: IEventInterface) => {
    return await User.findByIdAndUpdate(id, body, (err: any) => {
        if (err) {
            logger.error(err);
            return false;
        }
        return true;
    });
}

export const insertEvent = async (body: IEventInterface) => {
    const newUser = new User(body);
    return await newUser.save();
}