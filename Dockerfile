FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install -g dotenv-cli
RUN npm ci --legacy-peer-deps
RUN npm run start
EXPOSE 3000
CMD [ "npx", "serve", "-s", "build" ]