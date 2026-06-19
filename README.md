# Nestify — Server

Node.js + Express + MongoDB REST API powering the Nestify rental platform.

**Live URL:** _add your deployed Vercel URL here after deployment_

## Key Features

- JWT-based authentication, issued after Firebase login on the client
- Role-based access control middleware (`tenant` / `owner` / `admin`)
- Full CRUD for properties, bookings, reviews, and favorites
- Admin approval workflow for property listings, with rejection feedback
- Stripe PaymentIntent creation for secure card payments
- Server-side search, filtering, sorting, and pagination
- Aggregation-based owner earnings statistics (for the dashboard chart)

## NPM Packages Used

`express`, `mongoose`, `cors`, `dotenv`, `jsonwebtoken`, `bcryptjs`, `stripe`, `nodemon` (dev)

## 1. Install dependencies

```bash
cd server
npm install
```

## 2. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on locally (e.g. `5000`) |
| `MONGODB_URI` | Full MongoDB Atlas connection string (copy from Atlas: Database → Connect → Drivers → Node.js) |
| `DB_NAME` | Database name (e.g. `nestifyDB`) |
| `JWT_ACCESS_SECRET` | Any long random string, used to sign JWTs |
| `STRIPE_SECRET_KEY` | Your Stripe **secret** test key (starts with `sk_test_`) |
| `CLIENT_URLS` | Comma-separated list of allowed origins, e.g. `http://localhost:5173,https://your-client.vercel.app` |

## 3. Run locally

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

## 4. Creating your first Owner and Admin accounts

By design, every sign-up (including Google) becomes a `tenant`. To get Owner/Admin
accounts:

1. Register normally on the **client** website with the email/password you want to use
   for that account (e.g. `owner@nestify.com`, `admin@nestify.com`).
2. From the `server` folder, run:
   ```bash
   node scripts/setRole.js owner@nestify.com owner
   node scripts/setRole.js admin@nestify.com admin
   ```
3. Log out and log back in on the client so the new role takes effect.

## 5. (Optional) Seed sample properties

To avoid an empty homepage while testing, you can seed a handful of pre-approved
sample listings under your Owner account:

```bash
node scripts/seedProperties.js owner@nestify.com "Owner Demo"
```

## Deployment (Vercel)

This server is configured for Vercel's serverless functions via `vercel.json`.

1. Push this `server` folder to its own GitHub repository.
2. In Vercel, "Import Project" from that repository.
3. Add all variables from `.env.example` under Project Settings → Environment
   Variables (with your real values).
4. Deploy. Once you have your server's live URL, update `CLIENT_URLS` in Vercel to
   include your deployed client's URL, and update `VITE_API_URL` in the client's
   Vercel settings to point here — then redeploy both, to avoid CORS/404 errors.

## Folder Structure

```
server/
├── config/        → MongoDB connection
├── controllers/    → Route handler logic
├── middleware/      → verifyToken, verifyRole
├── models/           → Mongoose schemas
├── routes/            → Express routers
├── scripts/            → setRole.js, seedProperties.js (one-time CLI utilities)
└── index.js              → App entry point
```
