FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Mudamos para a porta do Vite
EXPOSE 5173

# O comando agora é "dev" e adicionamos "--host" para funcionar no Docker
CMD ["npm", "run", "dev", "--", "--host"]