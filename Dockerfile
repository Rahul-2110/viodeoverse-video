# Use an official Node runtime as a parent image
FROM node:20.13.1-alpine3.20 as builder
RUN apk add --no-cache ffmpeg

WORKDIR /usr

COPY . /app
WORKDIR /app
RUN npm install
RUN npm install --build-from-source --sqlite=/usr/local
RUN npm list sqlite3  # Verify sqlite3 installation
RUN ls -la node_modules  # List node_modules to check if sqlite3 is present
EXPOSE 3000
ENTRYPOINT ["node", "index.js"]