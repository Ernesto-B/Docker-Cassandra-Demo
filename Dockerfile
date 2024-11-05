FROM node:14

LABEL version="1.0"
LABEL description="Image Testing and Demo"
LABEL maintainer = ["Ernesto Barreto"]

WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node" , "index.js"]