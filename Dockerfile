# FROM node:18-alpine AS builder
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build

# FROM node:18-alpine AS production
# WORKDIR /usr/src/app
# COPY --from=builder /usr/src/app/dist ./dist
# COPY --from=builder /usr/src/app/package*.json ./
# RUN npm ci --only=production
# EXPOSE 8080
# CMD ["node", "dist/main.js"]



FROM node:22.12.0

WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


EXPOSE  8080


CMD ["npm", "run", "start:dev"]