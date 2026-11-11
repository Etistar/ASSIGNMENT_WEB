import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faUser, faCode, faGraduationCap, faBriefcase, faEnvelope, faRightToBracket, faUserPlus, faInbox, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: faHome },
    { path: '/about', label: 'About', icon: faUser },
    { path: '/projects', label: 'Projects', icon: faCode },
    { path: '/education', label: 'Education', icon: faGraduationCap },
    { path: '/services', label: 'Services', icon: faBriefcase },
    { path: '/contact', label: 'Contact', icon: faEnvelope },
  ];

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setIsOpen(false);

  const handleSignOut = async () => {
    closeMenu();
    await signOut();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          <span className="logo-badge">EZ</span>
          <span className="logo-text">Etienne<span>ZONON</span></span>
        </Link>

        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
          {isOpen ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
        </button>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={isActive(item.path) ? 'active' : ''}
              onClick={closeMenu}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
          {user && (
            <Link to="/messages" className={isActive('/messages') ? 'active' : ''} onClick={closeMenu}>
              <FontAwesomeIcon icon={faInbox} />
              <span>Messages</span>
            </Link>
          )}
          {user ? (
            <button type="button" onClick={handleSignOut}>
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>Sign out</span>
            </button>
          ) : (
            <>
              <Link to="/signin" className={isActive('/signin') ? 'active' : ''} onClick={closeMenu}>
                <FontAwesomeIcon icon={faRightToBracket} />
                <span>Sign in</span>
              </Link>
              <Link to="/signup" className={isActive('/signup') ? 'active' : ''} onClick={closeMenu}>
                <FontAwesomeIcon icon={faUserPlus} />
                <span>Sign up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
