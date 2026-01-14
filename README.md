# Chat-app — Turbo Monorepo

A small Turbo/Next.js monorepo implementing a real-time chat demo using a lightweight WebSocket server and Redis pub/sub.

🔧 **Tech stack**
- Frontend: Next.js (apps/web) + React + Zustand
- Backend: Node + ws WebSocket server (apps/server)
- Pub/Sub: Redis (ioredis)
- Monorepo: Turborepo (root scripts)

## 🚀 Project overview
This repository contains three main apps:

- `apps/web` – Next.js frontend that connects to the WebSocket server and provides the chat UI. Uses `SocketProvider` + `useChatStore` (Zustand) to manage real-time messages.
- `apps/server` – HTTP server that upgrades connections to WebSockets and handles pub/sub via Redis to broadcast messages per chat room.
- `apps/docs` – Documentation site (Next.js) for the project.

There are shared utility packages in `packages/*` (eslint/configs, shared UI components).

---

## 🧰 Requirements
- Node >= 18
- npm
- Redis (local or remote) for pub/sub


## ⚡ Quick start (local)
Install dependencies from the repo root:

```bash
npm install
```

Start everything (recommended) using Turborepo from the workspace root:

```bash
npm run dev
```

Alternatively run apps individually:

```bash
# In one terminal (server)
cd apps/server
npm install
npm run dev

# In another terminal (web)
cd apps/web
npm install
npm run dev
```

The Next.js frontend runs on port `3000` by default and the WebSocket server defaults to `8000` unless overridden via environment variables.

---

## 🔐 Environment variables
Check `.env.example` files in each app for full list. Important variables:

- apps/server/.env.example
  - `PORT` — server port (default: 8000)
  - `REDIS_PORT`, `REDIS_HOSTNAME`, `REDIS_PASSWORD` — Redis connection
  - `BACKEND_URL` — hostname (used in server logs)
  - `NEXT_PUBLIC_BACKEND_URL` — used by client when creating the WebSocket URL

- apps/web/.env.example
  - `PORT` — Next.js port
  - `NEXT_PUBLIC_BACKEND_URL` — **host:port** that the client uses to connect to the WebSocket server (see note below)

💡 Note: the client constructs the socket as `new WebSocket('wss://${NEXT_PUBLIC_BACKEND_URL}?room=...')`. For local setups set `NEXT_PUBLIC_BACKEND_URL=localhost:8000` (no protocol). Ensure the value matches what the server is actually listening on.

---

## 📦 Scripts
From the repo root (Turborepo):

- `npm run dev` — run all apps in dev mode (via `turbo run dev`)
- `npm run build` — build all apps (via `turbo run build`)
- `npm run lint` — run lint across workspaces
- `npm run format` — run Prettier

Per-app scripts: see `apps/web/package.json` and `apps/server/package.json` (e.g. `npm run dev`, `npm run build`, `npm start`).

---

## ✅ How it works (high-level)
- Client connects to the WebSocket server with a `room` query param.
- Server upgrades the connection and records which room each socket is in.
- When a client sends a message the server publishes it to Redis using the room channel.
- All subscribed server instances receive the Redis message and broadcast it to sockets connected to that room.

This makes the chat horizontally scalable (multiple server instances can coordinate via Redis pub/sub).

---

## 🐞 Troubleshooting
- WebSocket connection issues:
  - Ensure `NEXT_PUBLIC_BACKEND_URL` points to the correct `host:port` and uses `wss://` in production (or `ws://` for insecure local setups).
  - Check both server and client env vars and ports.
- Redis errors: confirm `REDIS_HOSTNAME`, `REDIS_PORT`, and `REDIS_PASSWORD` are correct and reachable.
- CORS and proxies: if you deploy behind a proxy or load balancer, ensure it forwards upgrade headers for WebSocket traffic.

---

## 📐 Contributing
PRs welcome. Please run lint/format checks before opening a PR.
