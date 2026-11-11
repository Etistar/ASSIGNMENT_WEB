import React from 'react';

const StatusBanner = ({ type = 'info', children }) => {
  if (!children) return null;
  const role = type === 'error' ? 'alert' : 'status';
  return (
    <p className={`form-alert ${type}`} role={role}>
      {children}
    </p>
  );
};

export default StatusBanner;
