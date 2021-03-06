import User, { IUserInterface } from "./models/User";
import Event, { IEventInterface, attendee } from "./models/Event";
import loggerUtil from "../util/logger.util";
import { hashEncrypt, compare } from "../util/password.util";
const logger = new loggerUtil("server");

//Users
export const login = async (email: string, password: string) => {
    const user = await User.findOne({ email }, (err: any, user: any) => {
        if (err) {
            logger.error(err);
            return null;
        }
        return user;
    });
    if (!user) {
        return { msg: "Error: incorrect credentials" };
    } else {
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return { msg: "Error: incorrect credentials" };
        }
    }
    return user._id;
}

export const getUser = async (id: string) => {
    const user = await User.findById(id, (err: any, user: any) => {
        if (err) {
            logger.error(err);
            return null;
        }
        return user;
    });
    if (!user) {
        return { msg: "Error: No user with that email" };
    }
    return user;
}

export const deleteUser = async (email: string) => {
    return await User.deleteOne({ email }, (err: any) => {
        if (err) {
            logger.error(err);
            return { msg: "Error: unable to delete user" };
        }
        return "Success: user deleted";
    });
}

export const updateUser = async (id: string, body: IUserInterface) => {
    const user = await User.findById(id, (err: any, user: any) => {
        if (err) {
            logger.error(err);
            return null;
        }
        return user;
    });
    if (!user) {
        return { msg: "Error: No user with that id" };
    }
    const encryptedPassword = await hashEncrypt(body.password);
    const newBody = { ...JSON.parse(JSON.stringify(user)), ...body };
    return await User.findByIdAndUpdate(id, { ...newBody, password: encryptedPassword }, (err: any) => {
        if (err) {
            logger.error(err);
            return { msg: "Error: unable to update user" };
        }
        return "Success";
    });
}

export const insertUser = async (body: IUserInterface) => {
    const replicate = await User.findOne({ email: body.email });
    if (replicate) {
        return { msg: "Error: Email already in use" };
    }
    const encryptedPassword = await hashEncrypt(body.password);
    const newUser = new User({ ...body, password: encryptedPassword });
    return await newUser.save();
}

//Events
export const getEventsFromUser = async (ownerId: string) => {
    return await Event.find({ ownerId }, (err: any, event: any) => {
        if (err) {
            logger.error(err);
            return null;
        }
        return event;
    });
}

export const getEvents = async () => {
    return await Event.find((err: any, event: any) => {
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
    return await Event.findByIdAndDelete(id, (err: any) => {
        if (err) {
            logger.error(err);
            return { msg: "Error: unable to delete event" };
        }
        return "Success: successfully deleted event";
    });
}

export const updateEvent = async (id: string, body: IEventInterface) => {
    const event = await Event.findById(id, (err: any, event: any) => {
        if (err) {
            logger.error(err);
            return null;
        }
        return event;
    });
    if (!event) {
        return { msg: "Error: No event with that id" };
    }
    return await Event.findByIdAndUpdate(id, { ...JSON.parse(JSON.stringify(event)), ...body }, (err: any, event: any) => {
        if (err) {
            logger.error(err);
            return { msg: "Error: can't update event" };
        }
        return event;
    });
}

export const insertEvent = async (body: IEventInterface) => {
    const newEvent = new Event(body);
    return await newEvent.save();
}

export const registerForEvent = async (eventId: string, userId: string) => {
    const event = await Event.findById(eventId, (err: any, event: any) => {
        if (err) {
            logger.error(err);
            return null;
        }
        return event;
    });
    if (!event) {
        return { msg: "Error: No event with that id" };
    }
    const user = await User.findById(userId, (err: any, user: any) => {
        if (err) {
            logger.error(err);
            return null;
        }
        return user;
    });
    if (!user) {
        return { msg: "Error: No user with that id" };
    }
    if (user.registeredEvents.filter(e => e === eventId).length >= 1) {
        return { msg: "Error: User already signed up for event" };
    }
    const updateUser = await User.findByIdAndUpdate(userId, { ...JSON.parse(JSON.stringify(user)), registeredEvents: [...JSON.parse(JSON.stringify(user.registeredEvents)), eventId] }, (err: any) => {
        if (err) {
            logger.error(err);
            return false;
        }
        return true;
    });
    if (!updateUser) {
        return { msg: "Error: Can't update user" };
    }
    const attendee: attendee = {
        userId
    }
    return await Event.findByIdAndUpdate(eventId, { ...JSON.parse(JSON.stringify(event)), attendees: [...JSON.parse(JSON.stringify(event.attendees)), attendee] }, (err: any) => {
        if (err) {
            logger.error(err);
            return { msg: "Error: Can't update event" };
        }
        return "Success: registered for event";
    });
}

export const removeRegistration = async (eventId: string, userId: string) => {
    const event = await Event.findById(eventId, (err: any, event: any) => {
        if (err) {
            logger.error(err);
            return null;
        }
        return event;
    });
    if (!event) {
        return { msg: "Error: No event with that id" };
    }
    const user = await User.findById(userId, (err: any, user: any) => {
        if (err) {
            logger.error(err);
            return null;
        }
        return user;
    });
    if (!user) {
        return { msg: "Error: No user with that id" };
    }
    if (user.registeredEvents.filter(e => e === eventId).length === 0) {
        return { msg: "Error: User not signed up for event" };
    }
    const updateUser = await User.findByIdAndUpdate(userId, { ...JSON.parse(JSON.stringify(user)), registeredEvents: JSON.parse(JSON.stringify(user.registeredEvents)).filter((e: any) => e !== eventId) }, (err: any) => {
        if (err) {
            logger.error(err);
            return false;
        }
        return true;
    });
    if (!updateUser) {
        return { msg: "Error: Can't update user" };
    }
    return await Event.findByIdAndUpdate(eventId, { ...JSON.parse(JSON.stringify(event)), attendees: JSON.parse(JSON.stringify(event.attendees)).filter((e: any) => e.userId !== userId) }, (err: any) => {
        if (err) {
            logger.error(err);
            return { msg: "Error: Can't update event" };
        }
        return "Success: unregisted from event";
    });
}