import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaUser, FaSpinner, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/');
      } else {
        await signUp(email, password, displayName);
        setSuccess('Реєстрація успішна! Перевірте email для підтвердження.');
        setIsLogin(true);
      }
    } catch (err) {
      const msg = err.message || 'Помилка';
      if (msg.includes('Invalid login credentials')) {
        setError('Невірний email або пароль');
      } else if (msg.includes('already registered')) {
        setError('Цей email вже зареєстрований');
      } else if (msg.includes('Password should be at least')) {
        setError('Пароль має бути не менше 6 символів');
      } else if (msg.includes('valid email')) {
        setError('Введіть правильний email');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5 auth-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="auth-card card border-0 shadow rounded-4 overflow-hidden">
              {/* Header */}
              <div className="auth-header text-center text-white p-4">
                <div className="auth-icon mb-3">
                  {isLogin ? <FaSignInAlt /> : <FaUserPlus />}
                </div>
                <h3 className="fw-bold mb-1">
                  {isLogin ? 'Вхід' : 'Реєстрація'}
                </h3>
                <p className="mb-0 opacity-75 small">
                  {isLogin
                    ? 'Увійдіть, щоб додавати бібліотеки та зберігати обране'
                    : 'Створіть акаунт для повного доступу'
                  }
                </p>
              </div>

              {/* Form */}
              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger py-2 small" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success py-2 small" role="alert">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">
                        <FaUser className="text-accent me-1" /> Ваше ім'я
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="Ваше ім'я"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      <FaEnvelope className="text-accent me-1" /> Email
                    </label>
                    <input
                      type="email"
                      className="form-control rounded-3"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold small">
                      <FaLock className="text-accent me-1" /> Пароль
                    </label>
                    <input
                      type="password"
                      className="form-control rounded-3"
                      placeholder={isLogin ? 'Ваш пароль' : 'Мінімум 6 символів'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-accent w-100 rounded-pill py-2 fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <><FaSpinner className="fa-spin me-2" /> Зачекайте...</>
                    ) : isLogin ? (
                      <><FaSignInAlt className="me-2" /> Увійти</>
                    ) : (
                      <><FaUserPlus className="me-2" /> Зареєструватися</>
                    )}
                  </button>
                </form>

                {/* Toggle login/register */}
                <div className="text-center mt-4">
                  <p className="text-muted small mb-0">
                    {isLogin ? 'Ще не маєте акаунту?' : 'Вже є акаунт?'}
                    <button
                      className="btn btn-link btn-sm text-accent fw-bold p-0 ms-1"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setSuccess('');
                      }}
                    >
                      {isLogin ? 'Зареєструватися' : 'Увійти'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Auth;
