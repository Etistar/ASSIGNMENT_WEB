import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBanner from '../components/StatusBanner';

const SignUp = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Enter a valid email address');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    setBusy(true);
    setError('');
    try {
      const data = await api('/api/auth/signup', {
        method: 'POST',
        auth: false,
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password
        }
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
        <h1>Create an account</h1>
        <p className="auth-note">New accounts are regular users. They can view records, not change them.</p>
        <StatusBanner type="error">{error}</StatusBanner>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="confirm">Confirm password</label>
            <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={handleChange} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="auth-switch">
          Already registered? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
