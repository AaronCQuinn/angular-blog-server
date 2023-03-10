const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require('dotenv').config();

class Database {
    constructor() {
        this.connect();
    }
    
    connect() {
        mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log("Successfully connected to MongoDB.");
            })
            .catch((error) => {
                console.error("Error connecting to MongoDB " + error);
            }
        )
    }
}

module.exports = new Database();