import * as bcrypt from 'bcryptjs';

export const hashEncrypt = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const compare = async (password: string, encryptedPassword: string) => {
    return await bcrypt.compare(password, encryptedPassword);
}