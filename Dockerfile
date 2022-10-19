
# FROM mhart/alpine-node as builder
FROM node:12.22.3-alpine as builder

WORKDIR /app
COPY . .
COPY yarn.lock /app/yarn.lock

RUN yarn install
RUN yarn build

# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["yarn", "start"]

