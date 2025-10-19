# Fuse Stock Trading Service

A production-ready Node.js backend for stock trading operations with Fuse vendor API integration.

## Features

- List paginated stocks.
- View user portfolios.
- Execute stock purchases with 2% price tolerance.
- List all users.
- Daily email reports (Ethereal in dev).
- Swagger UI documentation.

## Prerequisites

- Node.js v18+
- MongoDB Atlas
- Google Cloud SDK for GAE

## Setup (Local)

1. Clone repo.
2. `npm install`
3. Copy `.env.example` to `.env` and update:
   - `MONGODB_URI`: Atlas URI (allow 0.0.0.0/0 for testing).
   - `VENDOR_API_KEY`: `nSbPbFJfe95BFZufiDwF32UhqZLEVQ5K4wdtJI2e`
   - `ADMIN_EMAIL`: `admin@example.com`
   - `PORT`: 3000
4. `npm run dev`
5. API: `http://localhost:3000/api`
6. Swagger UI: `http://localhost:3000/api-docs`

## Deployment (Google App Engine)

1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
2. Auth: `gcloud auth login`
3. Set project: `gcloud config set project oceanic-bindery-475619-c8`
4. Initialize: `gcloud app create --region=us-central`
5. Update `app.yaml` (runtime: nodejs18, entrypoint: node src/app.js, env_variables).
6. Add `"gcp-build": ""` to `package.json` scripts (fixes auto-build error).
7. Deploy: `gcloud app deploy --verbosity=debug`
8. Access: `https://oceanic-bindery-475619-c8.ue.r.appspot.com/`
9. Logs: `gcloud app logs tail -s default`

## Endpoints

- `GET /` - Welcome.
- `GET /api/stocks` - List stocks.
- `GET /api/portfolio/:userId` - Portfolio.
- `POST /api/transactions/buy` - Buy stock.
- `GET /api/users/all-users` - List users.
- `GET /api/reports/daily` - Send report.
- `GET /api-docs` - Swagger UI.

## Testing

- Local: `npm run dev`; test in Swagger UI.
- GAE: Check logs for "MongoDB Atlas connected".
- Transactions: `db.transactions.find()` in Atlas.
- Email: Check Ethereal preview URL from `/api/reports/daily`.

## Notes

- GAE Error 13 Fix: `"gcp-build": ""` in `package.json` disables auto `npm run build`.
- Runtime: nodejs18 (add `"engines": { "node": "18.x" }` in package.json).
- Env Vars: Set in `app.yaml` or GAE Console (GAE ignores `.env`).
- Scaling: `max_instances: 10` in `app.yaml`.
