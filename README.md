# 📚 Найбільші бібліотеки світу

Веб-застосунок про найбільші бібліотеки світу, побудований з використанням сучасних веб-технологій.

## 🛠 Технології

- **Frontend:** React.js, Bootstrap 5, CSS Grid, Flexbox, медіазапити
- **Backend:** Node.js, Express.js
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
2. Відкрийте **SQL Editor** та виконайте скрипт із файлу `supabase/schema.sql`
3. Скопіюйте **URL** та **anon key** з **Settings → API**

### 3. Налаштування змінних середовища

```bash
cp .env.example .env
```

Заповніть `.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=5000
```

### 4. Встановлення залежностей

```bash
npm install
cd client && npm install && cd ..
```

### 5. Заповнення бази даних

```bash
npm run seed
```

### 6. Запуск

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Структура проекту

```
world-libraries/
├── server/
│   ├── index.js          # Express сервер + API
│   └── seed.js           # Заповнення БД даними
├── client/
│   ├── src/
│   │   ├── App.jsx       # Головний компонент
│   │   ├── components/   # React компоненти
│   │   └── styles/       # Кастомні стилі (Grid, Flexbox, медіазапити)
│   └── index.html
├── supabase/
│   └── schema.sql        # SQL схема бази даних
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
