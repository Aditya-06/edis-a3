# Use a lightweight Node.js image for building
FROM node:lts-alpine 

# Create app directory
WORKDIR /app

RUN apk update && apk add npm

# Copy source code (excluding node_modules)
COPY . .

# Install dependencies
RUN npm install

# Expose the port your application listens on
EXPOSE 5001

# Start command
CMD [ "npm", "start" ]
