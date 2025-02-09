# Etapa 1: Compilação do TypeScript
FROM node:alpine as ts-compiler
WORKDIR /usr/app

# Copie os arquivos de dependências e instale
COPY package*.json ./
COPY tsconfig*.json ./
COPY public ./  # Se precisar do public durante o build
RUN npm install

# Copie todo o código fonte e compile
COPY . ./
RUN npm run build

# Etapa 2: Remover TypeScript e manter apenas a build
FROM node:alpine as ts-remover
WORKDIR /usr/app

# Copiar apenas os arquivos necessários
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/dist ./dist
COPY --from=ts-compiler /usr/app/public ./public

# Etapa 3: Imagem final
FROM node:alpine
WORKDIR /usr/app

# Adicionando biblioteca openssl se necessário
RUN apk add --no-cache openssl

# Se precisar do dockerize, descomente esta parte
# ENV DOCKERIZE_VERSION v0.6.1
# RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#     && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#     && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Copie a aplicação compilada para a imagem final
COPY --from=ts-remover /usr/app ./

# Definir variáveis de ambiente
ENV NODE_ENV=production

# Instale alias de módulo
RUN npm i --save module-alias

# Rodar como root
USER root

# Use o script de entrada
ENTRYPOINT ["npm", "start"]
