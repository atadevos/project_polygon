FROM node:18
WORKDIR /app
COPY package.json ./
COPY package-lock.json* ./
RUN npm install
COPY . .
COPY .env.docker .env
RUN cat .env
EXPOSE 3000
CMD ["npm", "run", "start"]