# Use Node.js for development
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the React dev server port
EXPOSE 3000

# Start React in development mode
CMD ["npm", "start"]
