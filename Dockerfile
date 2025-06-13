# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Add build arg for NPM_TOKEN
ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}
COPY .npmrc .npmrc
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add entrypoint script for runtime env injection
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8081
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
