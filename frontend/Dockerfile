# Use a Node.js base image
FROM node:21.6.2-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if present) for faster installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
