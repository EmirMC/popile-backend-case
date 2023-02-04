FROM node:lts-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci 

COPY . .

# Build
RUN npm run build

### Build production image

FROM node:lts-alpine as prod

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

EXPOSE 8000

RUN npm install --frozen-lockfile --production

CMD ["npm", "run", "start:prod"]