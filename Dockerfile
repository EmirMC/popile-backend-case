FROM node:lts-alpine as build

WORKDIR /home/app

COPY package*.json ./

RUN npm ci 

COPY . .

# Build
RUN npm run build

### Build production image

ENV PORT=80

FROM node:lts-alpine as prod

WORKDIR /home/app

COPY --from=build /home/app/dist ./dist
COPY --from=build /home/app/package*.json ./

EXPOSE ${PORT}

RUN npm install --frozen-lockfile --production

CMD ["npm", "run", "start:prod"]