import React, { useEffect, useRef, useState } from 'react';

const RecordForm = ({
  fields,
  initialValues,
  resetKey,
  submitLabel,
  busy,
  onSubmit,
  onCancel
}) => {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');
  const latestValues = useRef(initialValues);
  latestValues.current = initialValues;

  useEffect(() => {
    setValues(latestValues.current);
    setError('');
  }, [resetKey]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const missing = fields.find((field) => field.required && !String(values[field.name] || '').trim());
    if (missing) {
      setError(`${missing.label} is required`);
      return;
    }
    setError('');
    onSubmit(values);
  };

  return (
    <form className="record-form" onSubmit={handleSubmit} noValidate>
      {error && <p className="form-alert error" role="alert">{error}</p>}
      {fields.map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={field.name}>
            {field.label}{field.required ? ' *' : ''}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              rows="4"
              value={values[field.name] || ''}
              onChange={handleChange}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              value={values[field.name] || ''}
              onChange={handleChange}
            />
          )}
        </div>
      ))}
      <div className="record-actions">
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default RecordForm;
