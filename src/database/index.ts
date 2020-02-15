import mongoose = require('mongoose');
import loggerUtil from "../util/logger.util";
import config = require('config');
//process.env.NODE_CONFIG_DIR = '../config';
//const db = config.get('mongoURI');

const logger = new loggerUtil("server");

export const connectDB = async () => {
    const uri = 'mongodb+srv://dbUser:Q.4BKajBj9%23%2B-ssS@event-io-5cnia.azure.mongodb.net/test?retryWrites=true&w=majority';
    try {
        await mongoose.connect(uri,
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