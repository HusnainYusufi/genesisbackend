const mongoose = require('mongoose');


const connectDB = async (DATABASE_URL) => {

    try {
        const DB_OPTION = {
            dbname : 'GenesisBackend'
        }
        await mongoose.connect(DATABASE_URL , DB_OPTION)
        console.log("connected successfully");
    } catch (error) {
        console.log(error);
    }

}

module.exports = connectDB;