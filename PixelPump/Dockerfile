# Frontend Dockerfile
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ .
RUN npm run build

# Backend + Frontend final image
FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source
COPY backend/ .

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S pixelpump -u 1001

# Change ownership
RUN chown -R pixelpump:nodejs /app
USER pixelpump

EXPOSE 3001

CMD ["node", "app.js"]
