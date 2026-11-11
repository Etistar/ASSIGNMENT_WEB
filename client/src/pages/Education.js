import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import RecordForm from '../components/RecordForm';
import StatusBanner from '../components/StatusBanner';
import { formatWhen, toDateInput } from '../utils/dates';

const emptyQualification = {
  title: '',
  completion: '',
  description: '',
  institution: '',
  period: '',
  credential: '',
  link: ''
};

const qualificationFields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'completion', label: 'Completion date', type: 'date', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'institution', label: 'Institution' },
  { name: 'period', label: 'Period shown on the card' },
  { name: 'credential', label: 'Credential' },
  { name: 'link', label: 'Verification link' }
];

const toForm = (item) => ({
  title: item.title || '',
  completion: toDateInput(item.completion),
  description: item.description || '',
  institution: item.institution || '',
  period: item.period || '',
  credential: item.credential || '',
  link: item.link || ''
});

const toPayload = (values) => ({
  title: values.title.trim(),
  completion: values.completion,
  description: values.description.trim(),
  institution: values.institution.trim(),
  period: values.period.trim(),
  credential: values.credential.trim(),
  link: values.link.trim()
});

const Education = () => {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [formKey, setFormKey] = useState('new');
  const [formValues, setFormValues] = useState(emptyQualification);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api('/api/qualifications', { auth: false });
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSubmit = async (values) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (editingId) {
        await api(`/api/qualifications/${editingId}`, { method: 'PUT', body: toPayload(values) });
        setNotice('Qualification updated.');
      } else {
        await api('/api/qualifications', { method: 'POST', body: toPayload(values) });
        setNotice('Qualification added.');
      }
      setEditingId('');
      setFormValues(emptyQualification);
      setFormKey(`saved-${Date.now()}`);
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const removeItem = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    setError('');
    setNotice('');
    try {
      await api(`/api/qualifications/${item._id}`, { method: 'DELETE' });
      if (editingId === item._id) {
        setEditingId('');
        setFormValues(emptyQualification);
        setFormKey(`saved-${Date.now()}`);
      }
      setNotice('Qualification deleted.');
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page education-page">
      <div className="container">
        <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Education & Certifications</h1>
        <StatusBanner type="error">{error}</StatusBanner>
        <StatusBanner type="success">{notice}</StatusBanner>
        {user && !isAdmin && (
          <StatusBanner type="info">
            Signed in as {user.name}. You can view qualifications. Only an administrator can add, edit, or delete them.
          </StatusBanner>
        )}
        {loading && <p className="page-loading">Loading qualifications...</p>}

        {isAdmin && (
          <div className="crud-panel">
            <h2>{editingId ? 'Edit qualification' : 'Add a qualification'}</h2>
            <RecordForm
              fields={qualificationFields}
              initialValues={formValues}
              resetKey={editingId || formKey}
              submitLabel={editingId ? 'Update qualification' : 'Add qualification'}
              busy={busy}
              onSubmit={handleSubmit}
              onCancel={editingId ? () => { setEditingId(''); setFormValues(emptyQualification); } : null}
            />
          </div>
        )}

        <div className="education-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '30px' }}>
          {items.map((qual) => (
            <div
              key={qual._id}
              className="qualification-card"
              style={{
                background: '#ffffff',
                padding: '25px',
                borderRadius: '10px',
                borderLeft: '5px solid #0056b3',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <div className="qualification-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#111', fontWeight: '700' }}>{qual.title}</h3>
                <span className="qualification-period" style={{ fontWeight: 'bold', color: '#0056b3', fontSize: '0.95rem' }}>{formatWhen(qual)}</span>
              </div>
              {qual.institution && (
                <p className="qualification-institution" style={{ margin: '0 0 6px 0', color: '#444' }}>
                  <strong>Institution:</strong> {qual.institution}
                </p>
              )}
              <p className="qualification-credential" style={{ margin: '0 0 20px 0', color: '#666' }}>
                <strong>Details:</strong> {qual.credential || qual.description}
              </p>
              <div className="record-actions">
                {qual.link && (
                  <a
                    href={qual.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: '#ffffff',
                      color: '#0056b3',
                      border: '2px solid #0056b3',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}
                  >
                    Verify Certification
                  </a>
                )}
                {isAdmin && (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(qual._id); setFormValues(toForm(qual)); }}>Edit</button>
                    <button type="button" className="btn btn-danger" onClick={() => removeItem(qual)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {!loading && items.length === 0 && <p style={{ textAlign: 'center' }}>No qualifications saved yet.</p>}
      </div>
    </section>
  );
};

export default Education;
