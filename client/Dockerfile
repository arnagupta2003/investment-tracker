# Build Stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Set API URL for build time (if using env vars in build)
# But for Nginx proxying, we usually want relative paths or standard /api
# In our code we used VITE_API_URL.
# If we want Nginx to proxy /api, the frontend should request /api/... basically just '/api/...' relative to domain
# But our code does: `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/...`
# So if VITE_API_URL is empty, it defaults to localhost:5001.
# In Docker, we want it to be just empty string (so it becomes /api/...) or specifically the domain.
# Let's set VITE_API_URL to empty string or '/' so it requests from same origin.
ENV VITE_API_URL=""

RUN npm run build

# Production Stage
FROM docker.io/nginxinc/nginx-unprivileged:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx-global.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
