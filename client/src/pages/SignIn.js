import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBanner from '../components/StatusBanner';

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError('Email and password are required');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const data = await api('/api/auth/signin', {
        method: 'POST',
        auth: false,
        body: { email: form.email.trim(), password: form.password }
      });
      signIn({ token: data.token, user: data.user });
      navigate('/projects');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page">
      <div className="auth-card">
        <h1>Sign in</h1>
        <StatusBanner type="error">{error}</StatusBanner>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="auth-switch">
          No account yet? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </section>
  );
};

export default SignIn;
