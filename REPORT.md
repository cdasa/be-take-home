Fuse Stock Trading Service Report

Date: October 19, 2025Author: Chaitanya DasaProject: Fuse Stock Trading ServiceGitHub Repository: [Link to your repo, if applicable]Deployed URL: https://oceanic-bindery-475619-c8.ue.r.appspot.com/

Overview
The Fuse Stock Trading Service is a production-ready Node.js backend application built with Express.js, designed to interact with Fuse's mock vendor API for stock trading operations. It provides RESTful endpoints to list stocks, manage user portfolios, execute buy transactions, retrieve user data, and send daily transaction reports via email. The application integrates MongoDB Atlas for data persistence, Ethereal Email for development email testing, and Swagger UI for interactive API documentation. It is deployed on Google App Engine (GAE) Standard Environment with Node.js 22, meeting all functional and deployment requirements.

App Structure
The Fuse Stock Trading Service follows a modular, layered architecture with clear separation of concerns, designed for maintainability, scalability, and ease of testing.

Key Components:

app.js: The main entry point, initializing Express, middleware (Helmet, CORS, Morgan, Compression), Swagger UI, routes, and MongoDB connection. It includes a GET / route to prevent 404 errors on GAE.
config/: Manages database connection (database.js) with MongoDB Atlas, using Mongoose for ORM.
controllers/: Business logic for each endpoint, handling requests and responses.
middleware/: Custom error handling to standardize API errors.
models/: Mongoose schemas for User (portfolio) and Transaction (buy records).
routes/: Defines API endpoints, mapping to controllers.
services/: External integrations (vendor API via Axios, email via Nodemailer/Ethereal).
swagger.js: Configures Swagger UI for API documentation.
app.yaml: GAE configuration with runtime: nodejs22, environment variables, and scaling.
package.json: Specifies Node.js 22 (engines), dependencies, and "gcp-build": "" to fix the October 2025 buildpack issue.

Architectural Pattern
The application follows a Layered Architecture with elements of MVC (Model-View-Controller) and Service-Oriented Design:

Presentation Layer (app.js, routes/):

Handles HTTP requests/responses via Express.
Defines API endpoints (/api/stocks, /api/portfolio/:userId, etc.).
Serves Swagger UI for documentation (/api-docs).
Includes middleware for security (Helmet), logging (Morgan), CORS, and compression.

Controller Layer (controllers/):

Contains business logic for each endpoint (e.g., stockController.js fetches stocks, transactionController.js validates buy transactions).
Maps HTTP requests to service methods, returning standardized JSON responses.

Service Layer (services/):

Encapsulates external integrations:
vendorApiService.js: Uses Axios with retries to fetch stock data from Fuse’s mock API.
emailService.js: Sends daily reports via Nodemailer/Ethereal.

Abstracts complex logic (e.g., ±2% price tolerance for transactions, email formatting).

Data Access Layer (models/, config/database.js):

Uses Mongoose to interact with MongoDB Atlas.
Defines schemas (User, Transaction) for data consistency.
Manages database connection with retry logic.

Cron Job (app.js):

Uses node-cron to schedule daily reports at midnight, integrating with emailService.js.

This layered approach ensures:

Separation of Concerns: Each layer has a single responsibility (e.g., controllers for logic, services for integrations).
Modularity: Components are independent, allowing easy updates (e.g., swap Ethereal for SendGrid).
Testability: Controllers and services can be unit-tested in isolation.
Scalability: Stateless Express routes and MongoDB Atlas support horizontal scaling.

Separation of Concerns
The app separates concerns effectively:

Routing vs. Logic: Routes (routes/index.js) define endpoints, while controllers handle logic, keeping app.js clean.
Data Models: User and Transaction schemas in models/ isolate database structure from logic.
External Services: vendorApiService.js and emailService.js encapsulate API calls and email sending, reducing controller complexity.
Error Handling: Centralized in middleware/errorHandler.js for consistent error responses.
Configuration: config/database.js and .env/GAE env_variables manage settings separately.
Documentation: swagger.js isolates Swagger configuration, making API docs maintainable.

This structure aligns with Node.js best practices (e.g., Express documentation, MongoDB Atlas guides), ensuring clarity and extensibility.
Design Decisions
Decision to Use Express.js
Why Express.js:

Simplicity and Flexibility: Express is lightweight, offering middleware and routing without imposing rigid conventions (unlike NestJS or Fastify). It suited the project’s need for a quick, RESTful API setup.
Ecosystem: Extensive middleware (e.g., Helmet, Morgan, CORS) and integrations (e.g., swagger-ui-express) simplified security, logging, and documentation.
Community and Stability: Express is mature, widely used, and well-documented, ensuring reliability for GAE deployment (confirmed via npm trends and GitHub activity).
Performance: Sufficient for a low-to-medium traffic API, with compression middleware for optimization.
Alternatives Considered:
Fastify: Faster but less middleware support; overkill for this project’s scope.
NestJS: More structured (TypeScript-based), but steeper learning curve and unnecessary for a simple API.
Koa: Modern but smaller ecosystem compared to Express.
Express was chosen for its balance of simplicity, ecosystem, and GAE compatibility (per Google Cloud docs).

Decision to Use MongoDB (Atlas)
Why MongoDB Atlas:

NoSQL Flexibility: MongoDB’s document model suits the project’s unstructured data (user portfolios, transactions). Schemas (User, Transaction) ensure consistency while allowing future schema evolution.
Cloud-Native: Atlas provides managed hosting, automatic scaling, and backups, ideal for a small-scale assessment without local database setup.
Mongoose ORM: Simplifies MongoDB interactions with schemas, validation, and queries, reducing boilerplate (e.g., User.findOne({ userId })).
GAE Integration: Atlas’s SRV connection string works seamlessly with GAE’s env_variables (after fixing IP whitelist).
Free Tier: M0 tier (512 MB) is sufficient for testing, with no cost for this project.
Alternatives Considered:
PostgreSQL (Cloud SQL): Relational, but overkill for simple key-value data; requires more schema management.
Firestore: Serverless, but less flexible for complex queries compared to MongoDB.
Local MongoDB: Requires server setup, less practical than Atlas for cloud deployment.
Atlas was chosen for its ease of use, scalability, and Node.js compatibility (via Mongoose).

Challenge Faced: The MongooseServerSelectionError (IP whitelist issue) was resolved by setting Atlas’s IP access to 0.0.0.0/0 for testing, ensuring GAE’s dynamic IPs could connect.
Decision to Use Ethereal Email
Why Ethereal Email:

Development-Friendly: Ethereal provides a free, temporary email service for testing without requiring a real SMTP server (e.g., Gmail, SendGrid).
Nodemailer Integration: Works seamlessly with Nodemailer (nodemailer.createTestAccount), generating preview URLs for email verification.
No Cost or Setup: Ideal for the assessment’s scope, avoiding external service costs or complex configurations.
Functionality: Supports sending daily transaction reports (GET /api/reports/daily) with preview URLs for verification (e.g., https://ethereal.email/message/...).
Alternatives Considered:
SendGrid/Mailgun: Require API keys and paid accounts for production; unnecessary for dev testing.
Gmail SMTP: Limited by OAuth setup and quotas; less reliable for automated tests.
Cloud Pub/Sub: Overkill for simple email reports.
Ethereal was chosen for its simplicity and immediate usability in development, with the option to swap for a production service later.

Implementation: services/emailService.js uses Nodemailer to send emails to ADMIN_EMAIL, with cron scheduling in app.js for daily reports.
Additional Design Decisions

Swagger UI: Chosen for interactive API documentation, served with local assets (/api-docs-assets) to fix TLS errors (https://127.0.0.1:3000/api-docs/swagger-ui.css).
Node.js 22: Selected for GAE compatibility and long-term support, with "gcp-build": "" in package.json to address the October 2025 buildpack change (automatic npm run build).
Middleware:
Helmet: Enhances security (e.g., XSS protection), with CSP disabled to allow Swagger UI.
Morgan: Logs requests for debugging.
CORS: Enables cross-origin requests for potential frontend integration.
Compression: Reduces response size for performance.

Error Handling: Centralized in middleware/errorHandler.js for consistent JSON error responses.
Cron: node-cron schedules daily reports, ensuring reliability without external schedulers.

Challenges and Solutions

GAE Error 13: Fixed by adding "gcp-build": "" in package.json to disable automatic builds, aligning runtime: nodejs22.
MongoDB Connection: Resolved by whitelisting 0.0.0.0/0 in Atlas and removing deprecated Mongoose options (useNewUrlParser, useUnifiedTopology).
404 Error: Added GET / route in app.js to handle GAE’s root URL.
Swagger UI TLS: Served assets locally via /api-docs-assets to prevent HTTPS errors.

Architectural Benefits

Maintainability: Modular structure (controllers, services, models) simplifies updates.
Scalability: Stateless Express and MongoDB Atlas support horizontal scaling (configured max_instances: 10 in app.yaml).
Extensibility: Easy to add new endpoints or swap services (e.g., Ethereal to SendGrid).
Reliability: Axios retries, Mongoose validation, and error handling ensure robustness.

Deployment and Testing

Deployment Process:

Configured app.yaml with runtime: nodejs22 and env_variables.
Added "gcp-build": "" in package.json to fix buildpack issue.
Deployed via gcloud app deploy --version=20251019t1800.
Verified at https://oceanic-bindery-475619-c8.ue.r.appspot.com/.

Testing:

Local: Tested endpoints via Swagger UI (http://localhost:3000/api-docs).
GAE: Confirmed functionality with curl and browser tests (/api/stocks, /api/reports/daily).
MongoDB: Verified transactions in Atlas (db.transactions.find()).
Email: Confirmed Ethereal preview URLs for daily reports.

Conclusion
The Fuse Stock Trading Service delivers a robust, production-ready API that meets all requirements, deployed successfully on GAE. The layered architecture, combined with Express.js, MongoDB Atlas, and Ethereal Email, ensures maintainability, scalability, and ease of testing. All challenges (Error 13, MongoDB connection, 404, TLS) were resolved through targeted configuration updates. The application is fully functional at https://oceanic-bindery-475619-c8.ue.r.appspot.com/, with Swagger UI for testing and Ethereal for email previews.
Video Walkthrough: A ~3-minute video can demonstrate:

Local setup (npm run dev).
Endpoint testing in Swagger UI (/api-docs).
Transaction storage in MongoDB Atlas.
Ethereal Email report preview.
GAE deployment and live tests.

Contact: chaitanyadasa1@gmail.com
