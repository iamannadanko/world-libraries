import supabase from './supabase.js';
import dotenv from 'dotenv';
dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

/**
 * Middleware: обов'язкова авторизація.
 * Перевіряє Supabase JWT із заголовка Authorization.
 * Додає req.userId, req.userEmail, req.isAdmin.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Необхідна авторизація' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Невалідний токен' });
    }

    req.userId = data.user.id;
    req.userEmail = data.user.email;
    req.isAdmin = data.user.email === ADMIN_EMAIL;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ error: 'Помилка авторизації' });
  }
}

/**
 * Middleware: тільки для адміністратора.
 * Спочатку перевіряє авторизацію, потім — чи це адмін.
 */
export async function requireAdmin(req, res, next) {
  await requireAuth(req, res, () => {
    if (!req.isAdmin) {
      return res.status(403).json({ error: 'Доступ заборонено. Потрібні права адміністратора.' });
    }
    next();
  });
}

/**
 * Middleware: опціональна авторизація.
 * Якщо токен є — встановлює req.userId, якщо ні — пропускає далі.
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.userId = null;
    req.isAdmin = false;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data, error } = await supabase.auth.getUser(token);
    req.userId = (error || !data?.user) ? null : data.user.id;
    req.userEmail = data?.user?.email || null;
    req.isAdmin = data?.user?.email === ADMIN_EMAIL;
  } catch {
    req.userId = null;
    req.isAdmin = false;
  }

  next();
}
