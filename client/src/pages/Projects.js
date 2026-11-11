import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import RecordForm from '../components/RecordForm';
import StatusBanner from '../components/StatusBanner';
import { toDateInput } from '../utils/dates';

const emptyProject = {
  title: '',
  completion: '',
  description: '',
  role: '',
  outcome: '',
  technologies: '',
  demoLink: ''
};

const projectFields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'completion', label: 'Completion date', type: 'date', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'role', label: 'Role' },
  { name: 'outcome', label: 'Outcome', type: 'textarea' },
  { name: 'technologies', label: 'Technologies (comma separated)' },
  { name: 'demoLink', label: 'Demo link' }
];

const toForm = (project) => ({
  title: project.title || '',
  completion: toDateInput(project.completion),
  description: project.description || '',
  role: project.role || '',
  outcome: project.outcome || '',
  technologies: (project.technologies || []).join(', '),
  demoLink: project.demoLink || ''
});

const toPayload = (values) => ({
  title: values.title.trim(),
  completion: values.completion,
  description: values.description.trim(),
  role: values.role.trim(),
  outcome: values.outcome.trim(),
  technologies: values.technologies.split(',').map((item) => item.trim()).filter(Boolean),
  demoLink: values.demoLink.trim()
});

const Projects = () => {
  const { user, isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [formKey, setFormKey] = useState('new');
  const [formValues, setFormValues] = useState(emptyProject);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api('/api/projects', { auth: false });
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleSubmit = async (values) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (editingId) {
        await api(`/api/projects/${editingId}`, { method: 'PUT', body: toPayload(values) });
        setNotice('Project updated.');
      } else {
        await api('/api/projects', { method: 'POST', body: toPayload(values) });
        setNotice('Project added.');
      }
      setEditingId('');
      setFormValues(emptyProject);
      setFormKey(`saved-${Date.now()}`);
      await loadProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setFormValues(toForm(project));
    setNotice('');
    setError('');
  };

  const removeProject = async (project) => {
    if (!window.confirm(`Delete "${project.title}"?`)) return;
    setError('');
    setNotice('');
    try {
      await api(`/api/projects/${project._id}`, { method: 'DELETE' });
      if (editingId === project._id) {
        setEditingId('');
        setFormValues(emptyProject);
        setFormKey(`saved-${Date.now()}`);
      }
      setNotice('Project deleted.');
      await loadProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page projects-page">
      <div className="container">
        <h1>My Projects</h1>
        <StatusBanner type="error">{error}</StatusBanner>
        <StatusBanner type="success">{notice}</StatusBanner>
        {user && !isAdmin && (
          <StatusBanner type="info">
            Signed in as {user.name}. You can view projects. Only an administrator can add, edit, or delete them.
          </StatusBanner>
        )}
        {loading && <p className="page-loading">Loading projects...</p>}

        {isAdmin && (
          <div className="crud-panel">
            <h2>{editingId ? 'Edit project' : 'Add a project'}</h2>
            <RecordForm
              fields={projectFields}
              initialValues={formValues}
              resetKey={editingId || formKey}
              submitLabel={editingId ? 'Update project' : 'Add project'}
              busy={busy}
              onSubmit={handleSubmit}
              onCancel={editingId ? () => { setEditingId(''); setFormValues(emptyProject); } : null}
            />
          </div>
        )}

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={project._id} className="project-card" style={{ padding: '25px' }}>
              <h3>Project {index + 1}: {project.title}</h3>
              <p className="project-desc" style={{ marginTop: '10px', marginBottom: '12px' }}>{project.description}</p>
              <div className="project-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px' }}>
                {(project.technologies || []).map((tech) => (
                  <span
                    key={tech}
                    style={{
                      backgroundColor: '#eef2f7',
                      color: '#0056b3',
                      padding: '4px 10px',
                      borderRadius: '50px',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      border: '1px solid #d0e1fd'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              {project.role && <p className="project-role"><strong>Role:</strong> {project.role}</p>}
              {project.outcome && <p className="project-outcome"><strong>Outcome:</strong> {project.outcome}</p>}
              <div className="project-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '10px',
                      backgroundColor: '#0056b3',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}
                  >
                    View Demo
                  </a>
                )}
                {isAdmin && (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={() => startEdit(project)}>Edit</button>
                    <button type="button" className="btn btn-danger" onClick={() => removeProject(project)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {!loading && projects.length === 0 && <p>No projects saved yet.</p>}
      </div>
    </section>
  );
};

export default Projects;
