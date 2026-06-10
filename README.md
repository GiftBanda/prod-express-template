# prod-express-template

An Express.js production ready template with typescript, ESLint and Prettier configured

## Prerequisites

- Node.js 22+
- npm 10+

## Install dependencies

```bash
npm install
```

## Environment setup

Create a local env file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

You can set `PORT` in `.env` (default is `9001`).

## Run the server (development)

Starts the server with hot reload:

```bash
npm run dev
```

Server URL: `http://localhost:9001` (or your configured `PORT`).

## Run the server (production)

Build TypeScript first, then start the compiled server:

```bash
npm run build
npm start
```

## Useful scripts

- `npm run dev` - Development server with watch mode
- `npm run dev:staging` - Development server using `.env.staging`
- `npm run dev:prod` - Development server using `.env.production`
- `npm run build` - Compile TypeScript to `dist`
- `npm start` - Run compiled server from `dist/index.js`
- `npm run test:run` - Run tests once
- `npm run type-check` - Run TypeScript checks without emitting files
- `npm run lint` - Run ESLint
- `npm run format:check` - Check Prettier formatting
