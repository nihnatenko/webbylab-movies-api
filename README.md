# Movies Management API (WebbyLab Test Task)

Це REST API для керування каталогом фільмів, побудоване на Node.js, Express та Sequelize.

## 🛠 Технологічний стек
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite
- **ORM:** Sequelize
- **Auth:** JSON Web Tokens (JWT)
- **Containerization:** Docker

## 🚀 Як запустити

### Варіант 1: Через Docker (Рекомендовано)
Система автоматично створить базу даних при старті.
```bash
# Збірка образу
docker build -t your_super_account/movies .

# Запуск контейнера (змонтуємо папку data, щоб база не зникала)
docker run -p 8000:8000 \
  -e JWT_SECRET=supersecret \
  -e DB_STORAGE=./data/db.sqlite \
  -v $(pwd)/data:/app/data \
  your_super_account/movies
```
# 🧩 Swagger API Documentation
- **http://localhost:8000/api-docs**
