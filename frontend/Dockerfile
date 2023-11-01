# Используйте официальный образ Node.js
FROM node:18

# Установите рабочую директорию
WORKDIR /app

# Скопируйте файлы проекта в контейнер
COPY . .

# Установите зависимости
RUN npm install

# Соберите frontend
RUN npm run build
EXPOSE 9000
CMD ["npm", "start"]

