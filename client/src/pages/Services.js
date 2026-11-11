import React from 'react';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Front-End Web Development',
      description: 'Creating modern, fluid, and responsive user interfaces with React, JavaScript, and seamless integration of animated mockups.',
      icon: '🌐'
    },
    {
      id: 2,
      title: 'Full-Stack Web Development',
      description: 'End-to-end design of digital solutions, from the user interface down to the database, utilizing robust and secure architectures.',
      icon: '⚙️'
    },
    {
      id: 3,
      title: 'Mobile Application Development',
      description: 'Building high-performance, cross-platform applications ready for iOS and Android using modern frameworks.',
      icon: '📱'
    },
    {
      id: 4,
      title: 'Data Science & Business Analytics',
      description: 'Unlocking value and modeling complex data: building interactive dashboards, advanced statistical analysis, and predictive models to guide your decisions.',
      icon: '📊'
    }
  ];

  return (
    <section className="page services-page">
      {/* Integration of the universal container for a perfect centered alignment */}
      <div className="container">
        <h1>My Services</h1>
        <div className="services-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '25px',
          marginTop: '30px'
        }}>
          {services.map((service) => (
            <div key={service.id} className="service-card" style={{
              background: '#f8f9fa',
              padding: '30px 20px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              borderTop: '4px solid #0056b3'
            }}>
              <div className="service-icon" style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{service.icon}</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#333' }}>{service.title}</h3>
              <p style={{ color: '#666', lineHeight: '1.5', fontSize: '0.95rem', margin: 0 }}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
