//import modules
const mongoose = require("mongoose");

require("dotenv").config();

const dbConfig = async (uri, callback) => {
    try {
        const URL = process.env.MONGODB_URL;

        await mongoose.connect(URL, {
            //define connection
            useNewUrlParser: true,
            useUnifiedTopology: true,

        });


        //assign database connection for a constant variable
        mongoose.connection.once("open", () => {
            console.log("MongoDB connection was successful");
        });
    } catch (error) {
        console.error("MongoDB connection failed");
        process.exit(1);
    }
};

module.exports = dbConfig;
