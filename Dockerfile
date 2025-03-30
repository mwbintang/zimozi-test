# Use an official Node.js image as the base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --only=production

# Copy the entire application
COPY . .

# Expose the application port
EXPOSE 3000

# Set environment variables (optional, can be overridden)
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/server.js"]
