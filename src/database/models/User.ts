import * as mongoose from "mongoose";

export interface IUserInterface {
    name: string;
    email: string;
    password: string;
    eventsCreated: string[];
    registeredEvents: string[];
}

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    eventsCreated: string[];
    registeredEvents: string[];
}

export const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    eventsCreated: { type: [String], required: false },
    registeredEvents: { type: [String], required: false },
});

export default mongoose.model<IUser>("user", UserSchema);