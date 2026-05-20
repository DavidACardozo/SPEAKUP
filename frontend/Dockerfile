FROM node:18-alpine AS build

WORKDIR /app

ARG REACT_APP_API_URL=http://localhost:8083/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/build /usr/share/nginx/html
COPY docker-entrypoint.sh /docker-entrypoint.d/05-runtime-env.sh
RUN chmod +x /docker-entrypoint.d/05-runtime-env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
