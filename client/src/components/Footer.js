import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Les réseaux sociaux restent ici :
import { faGithub, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
// L'enveloppe déménage ici :
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';



const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <p>© {new Date().getFullYear()} Etienne ZONON. Tous droits réservés.</p>
          <p>Portfolio développé avec React</p>
        </div>
        <div className="footer-social">
          <a href="https://github.com/Etistar" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="https://www.linkedin.com/in/etienne-zonon-0864588a/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
{/* <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
  <FontAwesomeIcon icon={faTwitter} />
</a> */}
          {/* Nouveau lien WhatsApp inséré ici */}
          <a href="https://wa.me/13435586485" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>

          <a href="mailto:zononetienne2009@gmail.com">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;