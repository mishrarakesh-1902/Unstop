# Base stage for dependencies
FROM node:26-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "run", "dev"]

# Build stage for production
FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

# Production runner stage
FROM node:26-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 8000
CMD ["node", "dist/index.js"]
