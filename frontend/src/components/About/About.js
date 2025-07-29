import React from 'react';
import './About.css';
import { useNavigate } from 'react-router-dom';
import Footer from "../Footer/Footer.js";
import Header from "../HeaderPage/Header.js"

const AboutPage = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      id: 1,
      name: "Riya Yadav",
      position: "Founder",
      bio: " SkyCard to revolutionize business networking.",
      img: "/images/riya.jpeg"
    },
    // {
    //   id: 3,
    //   name: "Rishika",
    //   position: "Backend Developer",
    //   bio: "Prachi architects our robust card creation platform with cutting-edge MERN technologies.",
    //   img: "/images/prachi.png"
    // },
    // {
    //   id: 4,
    //   name: "Prachi",
    //   position: "Design Director",
    //   bio: "Michael ensures every SkyCard template meets the highest aesthetic standards.",
    //   img: "https://randomuser.me/api/portraits/men/22.jpg"
    // }
  ];

  const features = [
    {
      title: "Categorized Templates",
      description: "Choose from 10+ professionally categorized designed templates"
    },
    {
      title: "Easy Editing",
      description: "Intuitive drag-and-drop interface for effortless customization"
    },
    {
      title: "Instant Sharing",
      description: "Share your digital card images"
    },
    {
      title: "Storage",
      description: "All your cards securely stored and accessible anywhere"
    }
  ];

  const handleContactClick = () => {
    navigate('/select-card');
  };

  return (
    <>
       <Header/>
    <div className="about-page">
        <header className="about-header">
        <div className="container">
          <h1>About SkyCard</h1>
          <p>The modern solution for digital business cards</p>
        </div>
      </header>
      
      <main className="container">
        <section className="about-section">
          <h2>Our Story</h2><hr/>
          <p>SkyCard was born in 2025 from a simple observation: traditional business cards are outdated in our digital world. We set out to create a platform that combines professional design with modern technology to help people make lasting connections.</p>
          <p>SkyCard digital business cards for professionals across various industries, helping them network smarter and leave memorable impressions.</p>
        </section>
        
        <section className="features-section">
          <h2>Why Choose SkyCard</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section className="team-section">
          <h2>Meet the SkyCard Founder</h2>
          <div className="team-grid">
            {teamMembers.map(member => (
              <div key={member.id} className="team-member">
                <img src={member.img} alt={member.name} />
                <h3>{member.name}</h3>
                <p className="position">{member.position}</p>
                <p className="bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section className="cta-section">
          <h2>Ready to Create Your SkyCard?</h2>
          <p>Join thousands of professionals who've upgraded their networking with digital cards.</p>
          <button onClick={handleContactClick} className="cta-button">Get Started Now</button>
        </section>
      </main>
    </div>
       <Footer/>
     </>
  );
};

export default AboutPage;