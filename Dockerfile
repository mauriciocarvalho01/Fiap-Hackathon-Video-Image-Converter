FROM node:alpine as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
COPY public ./
RUN npm install

# Copie todo o código fonte e compile
COPY . ./
RUN npm run build

FROM node:alpine as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/dist ./dist
COPY --from=ts-compiler /usr/app/public ./public

FROM node:alpine
WORKDIR /usr/app

# Adicionando biblioteca se necessário
# Instalar openssl e ffmpeg
RUN apk add --no-cache openssl ffmpeg

# ENV DOCKERIZE_VERSION v0.6.1
# RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#     && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd6a4-$DOCKERIZE_VERSION.tar.gz \
#     && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Copie a aplicação compilada para a imagem final
COPY --from=ts-remover /usr/app ./

# Instale alias de módulo
RUN npm i --save module-alias

USER root

# Use o script de entrada
ENTRYPOINT ["npm", "start"]

USER 1000
