# build/compile the app in a temporary container
FROM node:14 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY ./ .
RUN npm run build

# container to run the app
FROM node:14 as production-stage
RUN mkdir /app
COPY --from=build-stage /app/build /app
CMD ["node", "/app/server.js"]
