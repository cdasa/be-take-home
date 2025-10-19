const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });
        console.log("Successfully connected to MongoDB Atlas");
    } catch (error) {
        console.log('Error connecting to MongoDB: ', error);
        process.exit(1);
    }
}

module.exports = {connectDB};