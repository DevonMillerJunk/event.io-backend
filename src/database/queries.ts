import User, { IUserInterface } from "./models/User";
import loggerUtil from "../util/logger.util";
import { hashEncrypt } from "../util/password.util";
const logger = new loggerUtil("server");

export const getUser = async (email: string, password: string) => {
    const encryptedPassword = await hashEncrypt(password);
    return await User.findOne({ email, encryptedPassword }, (err: any, book: any) => {
        if (err) {
            logger.error(err);
            return null;
        }
        return book;
    });
}

export const deleteUser = async (email: string, password: string) => {
    const encryptedPassword = await hashEncrypt(password);
    return await User.deleteOne({ email, encryptedPassword }, (err: any) => {
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