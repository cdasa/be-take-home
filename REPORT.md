# Fuse Stock Trading Service Report

**Date:** October 19, 2025  
**Author:** Chaitanya Dasa  
**Project:** Fuse Stock Trading Service  
**GitHub Repository:** [Link to your repo, if applicable]  
**Deployed URL:** [https://oceanic-bindery-475619-c8.ue.r.appspot.com/](https://oceanic-bindery-475619-c8.ue.r.appspot.com/)

---

## Overview

The **Fuse Stock Trading Service** is a production-ready Node.js backend application built with **Express.js**, designed to interact with Fuse's mock vendor API for stock trading operations. It provides RESTful endpoints to list stocks, manage user portfolios, execute buy transactions, retrieve user data, and send daily transaction reports via email.

The application integrates **MongoDB Atlas** for data persistence, **Ethereal Email** for development email testing, and **Swagger UI** for interactive API documentation. It is deployed on **Google App Engine (GAE)** Standard Environment with **Node.js 22**, meeting all functional and deployment requirements.

---

## App Structure

The Fuse Stock Trading Service follows a **modular, layered architecture** with clear separation of concerns, designed for maintainability, scalability, and ease of testing.

### Key Components

- **app.js** – Main entry point, initializes Express, middleware (Helmet, CORS, Morgan, Compression), Swagger UI, routes, and MongoDB connection. Includes a `GET /` route to prevent 404 errors on GAE.
- **config/** – Manages database connection (`database.js`) with MongoDB Atlas using Mongoose ORM.
- **controllers/** – Business logic for each endpoint, handling requests and responses.
- **middleware/** – Custom error handling for standardized API responses.
- **models/** – Mongoose schemas for `User` (portfolio) and `Transaction` (buy records).
- **routes/** – Defines API endpoints mapped to controllers.
- **services/** – External integrations (vendor API via Axios, email via Nodemailer/Ethereal).
- **swagger.js** – Configures Swagger UI for API documentation.
- **app.yaml** – GAE configuration with `runtime: nodejs22`, environment variables, and scaling.
- **package.json** – Specifies Node.js 22 engines, dependencies, and `"gcp-build": ""` to fix the October 2025 buildpack issue.

---

## Architectural Pattern

The application follows a **Layered Architecture** with elements of **MVC (Model-View-Controller)** and **Service-Oriented Design**.

### Presentation Layer (`app.js`, `routes/`)

- Handles HTTP requests/responses via Express.
- Defines API endpoints (`/api/stocks`, `/api/portfolio/:userId`, etc.).
- Serves Swagger UI at `/api-docs`.
- Includes middleware for security (Helmet), logging (Morgan), CORS, and compression.

### Controller Layer (`controllers/`)

- Contains business logic for each endpoint.
- Maps HTTP requests to service methods, returning standardized JSON responses.

### Service Layer (`services/`)

- Encapsulates external integrations:
  - `vendorApiService.js` – Uses Axios with retries to fetch stock data from Fuse’s mock API.
  - `emailService.js` – Sends daily reports via Nodemailer/Ethereal.
- Abstracts complex logic (e.g., ±2% price tolerance for transactions, email formatting).

### Data Access Layer (`models/`, `config/database.js`)

- Uses Mongoose to interact with MongoDB Atlas.
- Defines schemas (`User`, `Transaction`) for data consistency.
- Manages database connection with retry logic.

### Cron Job (`app.js`)

- Uses `node-cron` to schedule daily reports at midnight, integrating with `emailService.js`.

**Benefits:**

- **Separation of Concerns** – Each layer has a single responsibility.
- **Modularity** – Components are independent, allowing easy updates.
- **Testability** – Controllers and services can be unit-tested in isolation.
- **Scalability** – Stateless routes and MongoDB Atlas support horizontal scaling.

---

## Separation of Concerns

The app separates concerns effectively:

- **Routing vs. Logic:** Routes define endpoints; controllers handle logic.
- **Data Models:** `User` and `Transaction` schemas isolate database structure.
- **External Services:** `vendorApiService.js` and `emailService.js` encapsulate external integrations.
- **Error Handling:** Centralized in `middleware/errorHandler.js`.
- **Configuration:** Managed via `config/database.js` and environment variables.
- **Documentation:** `swagger.js` isolates Swagger setup.

This structure aligns with **Node.js best practices**, ensuring clarity and extensibility.

---

## Design Decisions

### Decision to Use Express.js

**Why Express.js:**

- Lightweight, flexible, and unopinionated.
- Rich middleware ecosystem (Helmet, Morgan, CORS, Swagger).
- Mature, stable, and compatible with GAE.
- Optimized performance with compression middleware.

**Alternatives Considered:**

- **Fastify:** Faster but limited middleware.
- **NestJS:** TypeScript-heavy and more complex.
- **Koa:** Modern but smaller ecosystem.

Express was chosen for its **simplicity, ecosystem, and GAE compatibility**.

---

### Decision to Use MongoDB (Atlas)

**Why MongoDB Atlas:**

- Flexible document model for unstructured data.
- Managed hosting with automatic scaling and backups.
- Integrates easily with GAE.
- Mongoose provides schemas, validation, and query helpers.
- Free M0 tier suitable for testing.

**Alternatives Considered:**

- PostgreSQL (too rigid for dynamic schema).
- Firestore (less flexible for complex queries).
- Local MongoDB (manual setup required).

**Challenge:**  
`MongooseServerSelectionError` fixed by allowing Atlas IP access from `0.0.0.0/0`.

---

### Decision to Use Ethereal Email

**Why Ethereal Email:**

- Free, temporary SMTP for development.
- Seamless Nodemailer integration.
- Provides email preview URLs for testing.
- Zero configuration and cost.

**Alternatives Considered:**

- SendGrid/Mailgun (paid).
- Gmail SMTP (OAuth complexity).
- Cloud Pub/Sub (overkill).

Implemented in `services/emailService.js` with daily reports scheduled via `node-cron`.

---

### Additional Design Decisions

- **Swagger UI:** Served locally to avoid TLS errors.
- **Node.js 22:** Required for GAE deployment and long-term support.
- **Middleware:** Helmet, Morgan, CORS, Compression for security and performance.
- **Error Handling:** Centralized JSON responses.
- **Cron Jobs:** Scheduled daily reports via `node-cron`.

---

## Challenges and Solutions

| Challenge            | Solution                                               |
| -------------------- | ------------------------------------------------------ |
| GAE Error 13         | Added `"gcp-build": ""` in `package.json`              |
| MongoDB Connection   | Whitelisted `0.0.0.0/0` and removed deprecated options |
| 404 Error on Root    | Added `GET /` route                                    |
| Swagger UI TLS Error | Served assets locally via `/api-docs-assets`           |

---

## Architectural Benefits

- **Maintainability:** Modular code structure.
- **Scalability:** Stateless and horizontally scalable.
- **Extensibility:** Easy to replace or add services.
- **Reliability:** Built-in retries, validation, and error handling.

---

## Deployment and Testing

### Deployment Process

1. Configured `app.yaml` with `runtime: nodejs22` and environment variables.
2. Added `"gcp-build": ""` in `package.json`.
3. Deployed via `gcloud app deploy --version=20251019t1800`.
4. Verified at [https://oceanic-bindery-475619-c8.ue.r.appspot.com/](https://oceanic-bindery-475619-c8.ue.r.appspot.com/).

### Testing

- **Local:** Swagger UI at `http://localhost:3000/api-docs`.
- **GAE:** Verified with `curl` and browser tests.
- **MongoDB Atlas:** Verified data with `db.transactions.find()`.
- **Ethereal Email:** Confirmed preview URLs for daily reports.

---

## Conclusion

The **Fuse Stock Trading Service** delivers a **robust, production-ready API**, successfully deployed on GAE.  
The layered architecture ensures maintainability, scalability, and testability.  
All issues (Error 13, MongoDB connection, 404, TLS) were resolved effectively.

**Live Demo:** [https://oceanic-bindery-475619-c8.ue.r.appspot.com/](https://oceanic-bindery-475619-c8.ue.r.appspot.com/)  
**Contact:** [chaitanyadasa1@gmail.com](mailto:chaitanyadasa1@gmail.com)
