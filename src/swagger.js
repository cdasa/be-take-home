const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.4',
    info: {
        title: 'Fuse Stock Trading Assessment API',
        version: '1.0.0',
        description: 'API for stock trading with Fuse vendor integration.',
    },
    servers: [
        {
            url: 'http://127.0.0.1:3000/api',
            description: 'Localhost Development Server'
        }
    ],
    components: {
        schemas: {
            Stock: {
                type: 'object',
                properties: {
                    symbol: { type: 'string', example: 'AAPL'},
                    price: { type: 'number', example: 1.5}
                }
            },
            PortfolioItem: {
                type: 'object',
                properties: {
                    symbol: {type: 'string', example: 'AAPL'},
                    quantity: {type: 'integer', example: 10}
                }
            },
            User: {
                type: 'object',
                properties: {
                    userId: {type: 'string', example: 'user1'},
                    email: {type: 'string', example: 'user1@example.com'},
                    portfolio: {
                        type: 'array',
                        items: { $ref: '#components/schemas/PortfolioItem'}
                    }
                }
            },
            Transaction: {
                type: 'object',
                properties: {
                    userId: {type: 'string', example: 'user1'},
                    symbol: { type: 'string', example: 'AAPL' },
                    quantity: { type: 'integer', example: 5 },
                    price: { type: 'number', example: 1.5 },
                    status: { type: 'string', example: 'success' },
                    timestamp: { type: 'string', format: 'date-time', example: '2025-10-18T12:00:00Z' }
                }
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: ['./src/controllers/*.js']
};

const swaggerSpecs = swaggerJSDoc(options);

module.exports = swaggerSpecs;