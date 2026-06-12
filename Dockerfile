FROM node:20-alpine as build

WORKDIR build

RUN npm cache clean --force
COPY . .
RUN npm install --legacy-peer-deps
RUN npx ng build

CMD npm start

EXPOSE 4200