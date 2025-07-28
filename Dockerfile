# Стартовый образ
FROM node:20.18.0-bullseye AS build

# Автор
LABEL authors="ad-158"

# Рабочая директория
WORKDIR /usr/src/app

# JSON файлы
COPY *.json ./

# Установка всех пакетов и зависимостей, указанных в JSON
RUN npm install

COPY ./public ./public
COPY ./src ./src
COPY ./vite.config.ts ./
COPY ./.env ./
COPY ./index.html ./

EXPOSE 3000

# Запуск
CMD ["npm", "start"]