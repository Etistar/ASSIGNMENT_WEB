import React from 'react';

const About = () => {
  return (
    <section className="page about-page">
      {/* La classe container centre le bloc entier au milieu de l'écran */}
      <div className="container" style={{ textAlign: 'center' }}>
        
        <h1 style={{ marginBottom: '30px' }}>À propos de moi</h1>
        
        {/* Ce bloc regroupe la photo et le texte de manière centrée */}
        <div className="about-profile-box" style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          background: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
          
          <div className="about-image">
            <img
              src="/EtienneZONON.png"
              alt="Portrait de Etienne ZONON"
              width="200"
              height="200"
              loading="lazy"
              decoding="async"
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%', /* Transforme la photo en rond pour un style CV pro */
                objectFit: 'cover',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            />
          </div>
          
          <div className="about-content-text">
            <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '5px' }}>Etienne ZONON</h2>
            <p className="role" style={{ fontSize: '1.2rem', color: '#0056b3', fontWeight: 'bold', marginBottom: '20px' }}>
              Data Scientist & Software Engineer (FR/EN)
            </p>
            
            {/* Version Française */}
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <p style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                English 
              </p>
              <p style={{ color: '#555', maxWidth: '650px', margin: '0 auto', textAlign: 'justify', lineHeight: '1.6' }}>
                Bilingual (FR/EN) Data Scientist and Data Engineer with over 6 years of experience, passionate about software engineering and artificial intelligence. Expert in transforming data into strategic insights (governance, predictive modeling, A/B testing, and automation) as well as designing high-performance software architectures and AI-powered applications. Skilled in prototyping and developing modern technological solutions by combining analytical rigor with development best practices.
              </p>
            </div>

            {/* Version Anglaise */}
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <p style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Français
              </p>
              <p style={{ color: '#555', maxWidth: '650px', margin: '0 auto', textAlign: 'justify', lineHeight: '1.6' }}>
               Scientifique de données (Data Scientist) et ingénieur de données (Data Engineer) bilingue (FR/EN) avec plus de 6 ans d'expérience, profondément passionné par le génie logiciel et l'intelligence artificielle. Habile à transformer les données en insights stratégiques grâce à l'analyse statistique, la gouvernance des données, la modélisation prédictive, les tests A/B et l'automatisation des flux de travail, tout en s'appuyant sur une solide expertise en architectures logicielles et en applications pilotées par l'IA. Capacité éprouvée à faire le pont entre l'analytique avancée et l'ingénierie robuste pour concevoir et prototyper des solutions techniques innovantes.
              </p>
            </div>
            
            <p style={{ color: '#555', maxWidth: '650px', margin: '0 auto 30px auto', textAlign: 'justify', lineHeight: '1.6' }}>
              Toujours curieux et motivé, je m'adapte rapidement aux nouvelles technologies 
              et aux méthodologies agiles pour livrer des solutions de qualité.
            </p>
            
            <a 
              href="/diplome/resume.pdf" 
              className="btn btn-primary" 
              download
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#0056b3',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              Télécharger mon CV / Download my resume
            </a>
          </div>
          
        </div>

      </div>
    </section>
  );
};

export default About;