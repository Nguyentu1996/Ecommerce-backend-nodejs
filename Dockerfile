
# Use Node.js base image
FROM node:20.10.0

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN rm -rf node_modules && npm install

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]