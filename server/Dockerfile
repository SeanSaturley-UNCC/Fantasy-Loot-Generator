# Use Node LTS image
FROM node:20

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build TypeScript
RUN npm run build

# Expose the server port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
