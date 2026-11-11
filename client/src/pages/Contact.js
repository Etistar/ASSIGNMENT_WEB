import React, { useState } from 'react';
import { api } from '../api/client';
import StatusBanner from '../components/StatusBanner';

const emptyForm = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  message: ''
};

function validateContact(form) {
  if (!form.firstName.trim()) return 'First name is required';
  if (!form.lastName.trim()) return 'Last name is required';
  if (!form.email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Enter a valid email address';
  if (!form.message.trim()) return 'Message is required';
  return '';
}

const Contact = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateContact(formData);
    if (validationError) {
      setSuccess('');
      setError(validationError);
      return;
    }

    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await api('/api/contacts', {
        method: 'POST',
        auth: false,
        body: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          message: formData.message.trim()
        }
      });
      setFormData(emptyForm);
      setSuccess('Message sent. It is saved in the portfolio database.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page contact-page">
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '30px' }}>Contact Me</h1>
        <div className="contact-profile-box" style={{
          maxWidth: '650px',
          margin: '0 auto',
          background: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          textAlign: 'left'
        }}>
          <div className="contact-info-summary" style={{
            textAlign: 'center',
            marginBottom: '35px',
            paddingBottom: '25px',
            borderBottom: '1px solid #eee'
          }}>
            <p style={{ margin: '5px 0', fontSize: '1.1rem', color: '#333' }}>
              <strong>Email:</strong> zononetienne2009@gmail.com
            </p>
            <p style={{ margin: '5px 0', fontSize: '1.1rem', color: '#333' }}>
              <strong>Phone:</strong> +1 (343) 558-6485 / + 229 66 55 67 66
            </p>
            <p style={{ margin: '5px 0', fontSize: '1.1rem', color: '#0056b3', fontWeight: 'bold' }}>
              <strong>Location:</strong> Canada (Ottawa)
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <StatusBanner type="error">{error}</StatusBanner>
            <StatusBanner type="success">{success}</StatusBanner>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="firstName" style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="lastName" style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="phone" style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label htmlFor="message" style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', resize: 'vertical' }}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={busy}
                style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  backgroundColor: '#0056b3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                {busy ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
