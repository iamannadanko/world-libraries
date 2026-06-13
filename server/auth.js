import supabase from './supabase.js';

/**
 * Middleware: обов'язкова авторизація.
 * Перевіряє Supabase JWT із заголовка Authorization.
 * Додає req.userId (Supabase user id) і req.userEmail.
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
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ error: 'Помилка авторизації' });
  }
}

/**
 * Middleware: опціональна авторизація.
 * Якщо токен є — встановлює req.userId, якщо ні — пропускає далі.
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.userId = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data, error } = await supabase.auth.getUser(token);
    req.userId = (error || !data?.user) ? null : data.user.id;
    req.userEmail = data?.user?.email || null;
  } catch {
    req.userId = null;
  }

  next();
}
