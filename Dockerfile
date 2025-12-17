FROM node:18-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN mkdir -p /app/data && chown -R node:node /app/data

RUN mkdir -p /app/data /app/uploads && chown -R node:node /app/data /app/uploads

EXPOSE 8000

USER node

CMD ["node", "src/app.js"]
