// src/pages/Home.js
import React from 'react';
import './Home.css';
import Header from '../HeaderPage/Header';
import Footer from "../Footer/Footer.js";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <Header/>
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Create Professional <span>ID Cards</span> in Minutes</h1>
            <p>
              Stand out from the crowd with professionally designed ID cards that reflect the uniqueness of your organization. SkyCard is your ultimate solution for creating stunning and professional ID cards that leave a lasting impression.
            </p>
            <Link to="/select-card"><button className="create-btn">Create Your ID Card</button></Link>
          </div>

          <div className="hero-image">
            <div className="card-preview" style={{backgroundImage:"url(/images/backcard.jpg)"}}>
          
       
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>Our <span>Features</span></h2>
          <p>SkyCard makes it simple to create professional ID cards for your organization or events.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon easy"></div>
            <h3>Easy to Use</h3>
            <p>Design professional ID cards with our intuitive drag-and-drop interface.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon smart"></div>
            <h3>Smart Generation</h3>
            <p>Create customized cards quickly with our template library.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon secure"></div>
            <h3>Secure Data</h3>
            <p>Your information is protected with enterprise-grade security.</p>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="get-start">
        <div className="content">
          <h2>Get Started with <span>SkyCard!</span></h2>
          <p>
            SkyCard is your one-stop solution for creating professional ID cards for your organization, school, or event.
          </p>
          <Link to="/select-card"><button className="start-btn">Start Creating Now</button></Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;