FROM node:20-slim

WORKDIR /app

# Fix: Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install && npm ci --only=production && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]