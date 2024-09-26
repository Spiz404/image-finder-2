FROM node:latest

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

CMD ["npm", "run", "build"]

RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "3000"]
