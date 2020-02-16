import mongoose = require('mongoose');
import loggerUtil from "../util/logger.util";
import config = require('config');
process.env.NODE_CONFIG_DIR = '../config';
const db = config.get('mongoURI');

const logger = new loggerUtil("server");

export const connectDB = async () => {
    try {
        await mongoose.connect((db as string),
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });
        logger.info('Connected to MongoDB');
    } catch (error) {
        logger.error(error);
        process.exit();
    }
}