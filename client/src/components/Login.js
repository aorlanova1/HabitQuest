import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-logo">
          <img src="/assets/logo.png" alt="HabitQuest Logo" className="landing-logo" />
          <h1 className="landing-title">HabitQuest</h1>
        </div>
        <div className="auth-buttons">
          <button onClick={() => navigate('/login')} className="auth-button login-button">Login</button>
          <button onClick={() => navigate('/register')} className="auth-button register-button">Register</button>
        </div>
      </header>
      <main className="landing-main">
        <section className="hero-section">
          <h2>Welcome to HabitQuest</h2>
          <p>Track your habits, achieve your goals, and grow with a virtual pet companion!</p>
          <img src="/assets/hero-image.png" alt="HabitQuest Hero" className="hero-image" />
        </section>
        <section className="features-section">
          <h3>Why Choose HabitQuest?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-check-circle feature-icon"></i>
              <h4>Goal Tracking</h4>
              <p>Set and track daily, weekly, monthly, or yearly goals with ease.</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-chart-line feature-icon"></i>
              <h4>Analytics</h4>
              <p>Gain insights into your habits with detailed charts and stats.</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-trophy feature-icon"></i>
              <h4>Achievements</h4>
              <p>Earn badges and ranks as you complete goals and build streaks.</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-paw feature-icon"></i>
              <h4>Pet Companion</h4>
              <p>Grow a virtual pet that motivates you to stay on track!</p>
            </div>
          </div>
        </section>
        <section className="overview-section">
          <h3>Track Your Progress</h3>
          <p>HabitQuest helps you stay motivated with a gamified experience. Set goals, monitor your progress with analytics, earn achievements, and share your success with friends on Instagram!</p>
          <div className="overview-diagram">
            <img src="/assets/diagram.png" alt="HabitQuest Diagram" className="diagram-image" />
          </div>
        </section>
      </main>
      <footer className="landing-footer">
        <p>© 2025 HabitQuest. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;