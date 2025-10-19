require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('node-cron');
const routes = require('./routes');
const {errorHandler} = require('./middleware/errorHandler');
const {sendDailyReport} = require('./services/emailService');
const {connectDB} = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// MIDDLEWARE
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Fuse Stock Trading Service API',
        version: '1.0.0',
        endpoints: [
        '/api/stocks - List stocks',
        '/api/portfolio/:userId - Get portfolio',
        '/api/transactions/buy - Purchase stock',
        '/api/users/all-users - List all users',
        '/api/reports/daily - Trigger daily report',
        '/api-docs - Swagger UI documentation'
        ]
    });
});

// Serve Swagger UI assets locally
app.use('/api-docs-assets', express.static(path.join(__dirname, 'node_modules', 'swagger-ui-dist')));

// Swagger UI with custom options
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCssUrl: '/api-docs-assets/swagger-ui.css',
  customJs: '/api-docs-assets/swagger-ui-bundle.js',
  customJsStr: '/api-docs-assets/swagger-ui-standalone-preset.js'
}));

// ROUTES
app.use('/api', routes);

// ERROR HANDLER
app.use(errorHandler);

// DATABASE
connectDB().then(async () => {
    const User = require('./models/User');
    const existing = await User.countDocuments();

    if (existing === 0) {
        try{
            await User.insertMany([
                { userId: 'user1', email: 'user1@example.com', portfolio: [{symbol: 'AAPL', quantity: 10}]},
                { userId: 'user2', email: 'user2@example.com', portfolio: [{symbol: 'GOOGL', quantity: 5}]},
            ]);
            console.log("Mock users seeded");
        } catch (err) {
            console.error('Error seeding mock users:', err);
        }
    } else {
        console.log('Existing users found. Skipping seeding');
    }

    // console.log('Testing daily report on startup');
    // await sendDailyReport();

    cron.schedule('0 0 * * *', () => {
        console.log("Running daily report cron job");
        sendDailyReport(true);
    })

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Swagger UI available at http://127.0.0.1:${PORT}/api-docs`);
    });

});
