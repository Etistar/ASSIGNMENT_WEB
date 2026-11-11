import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import RecordForm from '../components/RecordForm';
import StatusBanner from '../components/StatusBanner';

const emptyMessage = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: ''
};

const messageFields = [
  { name: 'firstName', label: 'First name', required: true },
  { name: 'lastName', label: 'Last name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone' },
  { name: 'message', label: 'Message', type: 'textarea', required: true }
];

const Messages = () => {
  const { user, isAdmin } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [denied, setDenied] = useState(null);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [formKey, setFormKey] = useState('new');
  const [formValues, setFormValues] = useState(emptyMessage);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError('');
    setDenied(null);
    try {
      const data = await api('/api/contacts');
      setContacts(data);
    } catch (err) {
      setContacts([]);
      if (err.status === 401 || err.status === 403) {
        setDenied({ status: err.status, error: err.message });
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) loadContacts();
  }, [isAdmin, loadContacts]);

  const handleSubmit = async (values) => {
    setBusy(true);
    setError('');
    setNotice('');
    const body = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim()
    };
    try {
      if (editingId) {
        await api(`/api/contacts/${editingId}`, { method: 'PUT', body });
        setNotice('Message updated.');
      } else {
        await api('/api/contacts', { method: 'POST', body });
        setNotice('Message added.');
      }
      setEditingId('');
      setFormValues(emptyMessage);
      setFormKey(`saved-${Date.now()}`);
      await loadContacts();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const removeContact = async (contact) => {
    if (!window.confirm('Delete this message?')) return;
    setError('');
    setNotice('');
    try {
      await api(`/api/contacts/${contact._id}`, { method: 'DELETE' });
      setNotice('Message deleted.');
      await loadContacts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page">
      <div className="container">
        <h1>Contact messages</h1>
        <StatusBanner type="error">{error}</StatusBanner>
        <StatusBanner type="success">{notice}</StatusBanner>

        {!user && (
          <StatusBanner type="info">
            Sign in is required. <Link to="/signin">Sign in</Link>
          </StatusBanner>
        )}

        {user && !isAdmin && (
          <div className="crud-panel">
            <StatusBanner type="info">
              Signed in as {user.name}. Regular users cannot open contact records.
            </StatusBanner>
            <button type="button" className="btn btn-secondary" onClick={loadContacts}>
              Request contact records
            </button>
          </div>
        )}

        {denied && (
          <pre className="api-result" role="alert">
            {`HTTP ${denied.status}\n${JSON.stringify({ error: denied.error }, null, 2)}`}
          </pre>
        )}

        {isAdmin && (
          <div className="crud-panel">
            <h2>{editingId ? 'Edit message' : 'Add a message'}</h2>
            <RecordForm
              fields={messageFields}
              initialValues={formValues}
              resetKey={editingId || formKey}
              submitLabel={editingId ? 'Update message' : 'Add message'}
              busy={busy}
              onSubmit={handleSubmit}
              onCancel={editingId ? () => { setEditingId(''); setFormValues(emptyMessage); } : null}
            />
          </div>
        )}

        {loading && <p className="page-loading">Loading messages...</p>}

        <div className="message-list">
          {contacts.map((contact) => (
            <article key={contact._id} className="qualification-card">
              <h3>{contact.firstName} {contact.lastName}</h3>
              <p><strong>Email:</strong> {contact.email}</p>
              {contact.phone && <p><strong>Phone:</strong> {contact.phone}</p>}
              <p>{contact.message}</p>
              {isAdmin && (
                <div className="record-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingId(contact._id);
                      setFormValues({
                        firstName: contact.firstName || '',
                        lastName: contact.lastName || '',
                        email: contact.email || '',
                        phone: contact.phone || '',
                        message: contact.message || ''
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => removeContact(contact)}>Delete</button>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Messages;
