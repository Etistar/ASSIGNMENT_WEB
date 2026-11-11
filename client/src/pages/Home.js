import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="page home-page">
      {/* Add the container class here to center the welcome block */}
      <div className="container">
        <div className="hero">
          <h1>Welcome to My Portfolio</h1>
          <p className="hero-subtitle">Passionate Web Developer</p>
          <p className="mission">
            My mission is to create innovative and accessible digital experiences 
            that transform ideas into reality.
          </p>
          <Link to="/about" className="btn btn-primary">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
