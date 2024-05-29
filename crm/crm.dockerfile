# Use a lightweight Node.js image for building
FROM node:lts-alpine 

# Create app directory
WORKDIR /app

RUN apk update && apk add npm

# Copy source code (excluding node_modules)
COPY . .

# Install dependencies
RUN npm install

EXPOSE 3000

# Start command
CMD [ "npm", "start" ]
