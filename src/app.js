require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgam');
const cron = require('node-cron');
const routes = require('./routes');
const {errorHandler} = require('./middleware/errorHandler');
const {sendDailyReport} = require('./services/emailService');
const {connectDB} = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// ROUTES
app.use('/api', routes);

// ERROR HANDLER
app.use(errorHandler);

// DATABASE
connectDB().then(async () => {
    const User = require('./models/User');
    const existing = await User.countDocuments();

    if (existing === 0) {
        await User.insertMany([
            { userID: 'user1', email: 'user1@example.com', portfolio: [{symbol: 'AAPL', quantity: 10}]},
            { userID: 'user2', email: 'user2@example.com', portfolio: [{symbol: 'GOOGL', quantity: 5}]},
        ]);
        console.log("Mock users seeded");
    }

    cron.schedule('0 0 * * *', () => {
        console.log("Running daily report cron job");
        sendDailyReport();
    })

    app.listen(PORT, () => {
        console.log("Server running on Port ${PORT}");
    });

});
