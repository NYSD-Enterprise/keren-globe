FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src
COPY config ./config

EXPOSE 5002

CMD ["npm", "start"]
