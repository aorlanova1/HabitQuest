import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
  const [colorScheme, setColorScheme] = useState('light');
  const [petType, setPetType] = useState('dog');
  const [notifications, setNotifications] = useState(true);
  const [backgroundTheme, setBackgroundTheme] = useState('teal');
  const [fontStyle, setFontStyle] = useState('Montserrat');
  const [petAnimation, setPetAnimation] = useState(true);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://74.208.11.61:5001/api/auth/user', { headers: { 'x-auth-token': token } })
      .then(res => {
        setColorScheme(res.data.colorScheme);
        setPetType(res.data.petType);
        setNotifications(res.data.notifications);
        setBackgroundTheme(res.data.backgroundTheme);
        setFontStyle(res.data.fontStyle);
        setPetAnimation(res.data.petAnimation);
        setUsername(res.data.username);
      });
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://74.208.11.61:5001/api/settings', {
        colorScheme,
        petType,
        notifications,
        backgroundTheme,
        fontStyle,
        petAnimation
      }, { headers: { 'x-auth-token': token } });
      document.body.className = colorScheme;
      document.body.style.fontFamily = fontStyle;
      document.body.classList.remove('theme-teal', 'theme-purple', 'theme-blue');
      document.body.classList.add(`theme-${backgroundTheme}`);
      alert('Settings saved!');
    } catch (err) {
      console.error(err);
      alert('Error saving settings.');
    }
  };

  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="settings-section card">
        <h2><i className="fas fa-user"></i> Account</h2>
        <div className="setting-item">
          <label>Username:</label>
          <span>{username}</span>
        </div>
      </div>
      <div className="settings-section card">
        <h2><i className="fas fa-paint-brush"></i> Appearance</h2>
        <div className="setting-item">
          <label className={colorScheme === 'light' ? 'color-light' : 'color-dark'}>Color Scheme:</label>
          <select value={colorScheme} onChange={(e) => setColorScheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="setting-item">
          <label className={`label-text ${colorScheme === 'light' ? 'color-light' : 'color-dark'}`}>Background Theme:</label>
          <select value={backgroundTheme} onChange={(e) => setBackgroundTheme(e.target.value)}>
            <option value="teal">Teal Gradient</option>
            <option value="purple">Purple Gradient</option>
            <option value="blue">Blue Gradient</option>
          </select>
        </div>
        <div className="setting-item">
          <label>Font Style:</label>
          <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
            <option value="Montserrat" style={{ fontFamily: 'Montserrat' }}>Montserrat</option>
            <option value="Roboto" style={{ fontFamily: 'Roboto' }}>Roboto</option>
            <option value="OpenSans" style={{ fontFamily: 'Open Sans' }}>Open Sans</option>
          </select>
        </div>
      </div>
      <div className="settings-section card">
        <h2><i className="fas fa-paw"></i> Pet Companion</h2>
        <div className="setting-item">
          <label>Pet Type:</label>
          <div className="pet-selector">
            <div
              className={`pet-option ${petType === 'dog' ? 'selected' : ''}`}
              onClick={() => setPetType('dog')}
            >
              <img src="/assets/dog.png" alt="Dog" className="pet-icon" />
              <span>Dog</span>
            </div>
            <div
              className={`pet-option ${petType === 'cat' ? 'selected' : ''}`}
              onClick={() => setPetType('cat')}
            >
              <img src="/assets/cat.png" alt="Cat" className="pet-icon" />
              <span>Cat</span>
            </div>
            <div
              className={`pet-option ${petType === 'bird' ? 'selected' : ''}`}
              onClick={() => setPetType('bird')}
            >
              <img src="/assets/bird.png" alt="Bird" className="pet-icon" />
              <span>Bird</span>
            </div>
          </div>
        </div>
        <div className="setting-item">
          <label>Pet Animation:</label>
          <select value={petAnimation} onChange={(e) => setPetAnimation(e.target.value === 'true')}>
            <option value={true}>Enabled</option>
            <option value={false}>Disabled</option>
          </select>
        </div>
      </div>
      <div className="settings-section card">
        <h2><i className="fas fa-bell"></i> Notifications</h2>
        <div className="setting-item">
          <label>Email Notifications:</label>
          <select value={notifications} onChange={(e) => setNotifications(e.target.value === 'true')}>
            <option value={true}>Enabled</option>
            <option value={false}>Disabled</option>
          </select>
        </div>
      </div>
      <div className="settings-buttons">
        <button onClick={handleSave} className="save-settings-button">
          <i className="fas fa-save"></i> Save Settings
        </button>
        <button
          type="button"
          className="back-home-button" // Reuse the existing class since it's now "Back to Dashboard"
          onClick={() => navigate('/dashboard')} // Navigate to Dashboard
        >
          <i className="fas fa-tachometer-alt"></i> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Settings;
