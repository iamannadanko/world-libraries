# 📚 Найбільші бібліотеки світу

Веб-застосунок про найбільші бібліотеки світу, побудований з використанням сучасних веб-технологій.

## 🛠 Технології

- **Frontend:** React.js, Bootstrap 5, CSS Grid, Flexbox, медіазапити
- **Backend:** Node.js, Express.js
- **ORM:** Prisma ORM
- **База даних:** Supabase (PostgreSQL)
- **Збірка:** Vite

## 🚀 Встановлення та запуск

### 1. Клонування

```bash
git clone https://github.com/iamannadanko/world-libraries.git
cd world-libraries
```

### 2. Налаштування Supabase

1. Створіть проект на [supabase.com](https://supabase.com)
2. Перейдіть в **Settings → Database → Connection string → URI**
3. Скопіюйте рядок підключення (Connection string)

### 3. Налаштування змінних середовища

```bash
cp .env.example .env
```

Заповніть `.env`:
```
DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.YOUR-PROJECT.supabase.co:5432/postgres"
PORT=5000
```

### 4. Встановлення залежностей

```bash
npm install
cd client && npm install && cd ..
```

### 5. Налаштування бази даних + заповнення

```bash
# Один крок — генерація Prisma Client, створення таблиць, заповнення даними:
npm run setup
```

Або окремо:
```bash
npx prisma generate      # Генерація Prisma Client
npx prisma db push        # Створення таблиць у Supabase
npm run seed              # Заповнення 10 бібліотеками
```

### 6. Запуск

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Prisma Studio: `npm run prisma:studio` (GUI для бази даних)

## 📁 Структура проекту

```
world-libraries/
├── prisma/
│   └── schema.prisma     # Prisma схема (модель Library)
├── server/
│   ├── index.js          # Express сервер + API (Prisma ORM)
│   ├── prisma.js          # Prisma Client singleton
│   └── seed.js           # Заповнення БД даними
├── client/
│   ├── src/
│   │   ├── App.jsx       # Головний компонент
│   │   ├── components/   # React компоненти
│   │   └── styles/       # Кастомні стилі (Grid, Flexbox, медіазапити)
│   └── index.html
├── .env.example
└── package.json
```

## 📡 API ендпоінти

| Метод  | Шлях                 | Опис                     |
|--------|----------------------|--------------------------|
| GET    | `/api/libraries`     | Отримати всі бібліотеки  |
| GET    | `/api/libraries/:id` | Отримати одну бібліотеку |
| POST   | `/api/libraries`     | Додати нову бібліотеку   |
| PUT    | `/api/libraries/:id` | Оновити бібліотеку       |
| DELETE | `/api/libraries/:id` | Видалити бібліотеку      |

## 🔧 Prisma команди

```bash
npx prisma studio        # Відкрити GUI для перегляду/редагування даних
npx prisma db push        # Синхронізувати схему з базою даних
npx prisma generate       # Перегенерувати Prisma Client
npx prisma format         # Відформатувати schema.prisma
```
