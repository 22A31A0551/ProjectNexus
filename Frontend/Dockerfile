# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency files and install packages
COPY package*.json ./
RUN npm ci

# Copy all source files and build the React app
COPY . .
RUN npm run build

# Run stage (serving static files with Nginx)
FROM nginx:stable-alpine

# Copy the build output from the build stage to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to support SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
