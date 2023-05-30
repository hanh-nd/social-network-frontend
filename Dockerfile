FROM node:16 AS ui-build

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install 

COPY . .

RUN yarn build

FROM nginx:1.17.1-alpine

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=ui-build /usr/src/app/dist /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
