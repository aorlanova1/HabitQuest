import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoalForm from './GoalForm';
import GoalList from './GoalList';
import Pet from './Pet';
import CalendarView from './CalendarView';
import ProgressInsights from './ProgressInsights';
import { useNavigate, Link } from 'react-router-dom';
import quotes from './MotivationalQuotes';
import './Dashboard.css';

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userAction, setUserAction] = useState(null);
  const [petMessage, setPetMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    const fetchData = async () => {
      try {
        const [goalsRes, userRes] = await Promise.all([
          axios.get('http://74.208.11.61:5001/api/goals', { headers: { 'x-auth-token': token } }),
          axios.get('http://74.208.11.61:5001/api/auth/user', { headers: { 'x-auth-token': token } })
        ]);
        setGoals(goalsRes.data);
        setUser(userRes.data);
        document.body.className = userRes.data.colorScheme;
        document.body.style.fontFamily = userRes.data.fontStyle;
        const backgroundTheme = userRes.data.backgroundTheme;
        document.body.classList.remove('theme-teal', 'theme-purple', 'theme-blue');
        document.body.classList.add(`theme-${backgroundTheme}`);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    fetchData();
  }, [navigate]);

  // Pet messages (static, no timer)
  const contextualMessages = {
    overview: "Welcome to the Overview! Check your progress here.",
    goals: "This is your Goals tab! Add or complete a goal to keep progressing.",
    analytics: "Explore your Analytics to understand your habits better!",
    achievements: "Your Achievements are here! Keep earning badges!"
  };

  const guidanceMessages = {
    overview: "Review your stats to see where you stand!",
    goals: "Add a new goal to keep progressing, or mark one as complete!",
    analytics: "Dive into your habit trends to improve consistency!",
    achievements: "Complete more goals to earn new badges!"
  };

  const feedbackMessages = {
    addedGoal: "Great job adding a goal! Keep up the momentum!",
    completedGoal: "Awesome, you completed a goal! You're on fire!",
    noAction: "Hmm, looks like you haven't done anything yet—let's get started!",
    invalidGoal: "That goal name might be too short—try adding more details!"
  };

  useEffect(() => {
    const updatePetMessage = () => {
      const context = contextualMessages[activeTab];
      const guidance = guidanceMessages[activeTab];
      const feedback = userAction ? feedbackMessages[userAction] : feedbackMessages.noAction;
      setPetMessage(`${context} ${guidance} ${feedback}`);
    };

    updatePetMessage();
  }, [activeTab, userAction]);

  const handleShare = (type) => {
    const completedCount = goals.filter(g => g.completed).length;
    const text = `I've completed ${completedCount} goals on HabitQuest! Rank: ${user?.rank} #HabitQuest`;

    if (type === 'feed') {
      const url = `https://www.instagram.com/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    } else {
      navigator.clipboard.writeText(text).then(() => {
        const storyUrl = 'instagram://story-camera';
        const fallbackUrl = `https://www.instagram.com/?text=${encodeURIComponent(text)}`;
        window.location.href = storyUrl;
        setTimeout(() => {
          window.open(fallbackUrl, '_blank');
        }, 2000);
        alert('Text copied to clipboard! Paste it into your Instagram Story.');
      }).catch(err => {
        console.error('Failed to copy text:', err);
        window.open(`https://www.instagram.com/?text=${encodeURIComponent(text)}`, '_blank');
      });
    }
    setUserAction('shared');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsCalendarOpen(false);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleGoalAdded = () => {
    setUserAction('addedGoal');
  };

  const handleGoalCompleted = () => {
    setUserAction('completedGoal');
  };

  const completedGoals = goals.filter(g => g.completed).length;
  const rankProgress = {
    bronze: { next: 'silver', goal: 5 },
    silver: { next: 'gold', goal: 10 },
    gold: { next: 'platinum', goal: 20 },
    platinum: { next: null, goal: null }
  };
  const currentRank = user?.rank || 'bronze';
  const nextRankInfo = rankProgress[currentRank];
  const progressPercent = nextRankInfo && nextRankInfo.goal ? (completedGoals / nextRankInfo.goal) * 100 : 100;

  const levels = [
    { level: 1, minGoals: 0 },
    { level: 2, minGoals: 6 },
    { level: 3, minGoals: 16 },
    { level: 4, minGoals: 30 },
    { level: 5, minGoals: 50 }
  ];
  const currentLevel = levels.reduce((acc, lvl) => 
    completedGoals >= lvl.minGoals ? lvl.level : acc, 1
  );

  const achievements = [];
  if (completedGoals >= 1) achievements.push({ 
    name: 'First Goal', 
    icon: '/assets/achievement-first.png',
    description: 'You completed your first goal!',
    earnedOn: goals.find(g => g.completed)?.createdAt ? new Date(goals.find(g => g.completed).createdAt).toLocaleDateString() : 'N/A'
  });
  const maxStreak = Math.max(...goals.map(g => g.streak), 0);
  if (maxStreak >= 5) achievements.push({ 
    name: '5-Day Streak', 
    icon: '/assets/achievement-streak.png',
    description: 'You maintained a streak of 5 days!',
    earnedOn: goals.find(g => g.streak >= 5)?.createdAt ? new Date(goals.find(g => g.streak >= 5).createdAt).toLocaleDateString() : 'N/A'
  });
  if (completedGoals >= 10) achievements.push({ 
    name: '10 Goals', 
    icon: '/assets/achievement-10goals.png',
    description: 'You completed 10 goals!',
    earnedOn: goals.filter(g => g.completed).length >= 10 ? new Date(goals.filter(g => g.completed)[9].createdAt).toLocaleDateString() : 'N/A'
  });

  const upcomingAchievements = [];
  if (completedGoals < 1) {
    upcomingAchievements.push({
      name: 'First Goal',
      icon: '/assets/achievement-first.png',
      description: 'Complete your first goal to earn this achievement.',
      requirement: 'Complete 1 goal'
    });
  }
  if (maxStreak < 5) {
    upcomingAchievements.push({
      name: '5-Day Streak',
      icon: '/assets/achievement-streak.png',
      description: 'Maintain a streak of 5 days by completing goals daily.',
      requirement: `Achieve a streak of ${5 - maxStreak} more days`
    });
  }
  if (completedGoals < 10) {
    upcomingAchievements.push({
      name: '10 Goals',
      icon: '/assets/achievement-10goals.png',
      description: 'Complete 10 goals to earn this achievement.',
      requirement: `Complete ${10 - completedGoals} more goals`
    });
  }

  const rankOrder = ['bronze', 'silver', 'gold', 'platinum'];
  const currentRankIndex = rankOrder.indexOf(currentRank);
  const upcomingRanks = rankOrder.slice(currentRankIndex + 1).map(rank => ({
    name: rank.charAt(0).toUpperCase() + rank.slice(1),
    icon: `/assets/${rank}.png`,
    description: `Reach the ${rank.charAt(0).toUpperCase() + rank.slice(1)} rank by completing more goals.`,
    requirement: `Complete ${rankProgress[rank.toLowerCase()]?.goal - completedGoals || 0} more goals`
  }));

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const totalCompleted = completedGoals;
  const currentStreak = maxStreak;

  const today = new Date();
  const todayDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const todayDay = today.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="logo-container">
          <img src="/assets/logo.png" alt="HabitQuest Logo" className="site-logo" />
          <h1 className="site-title">HabitQuest</h1>
        </div>
        <div className="header-actions">
          <div className="calendar-icon" onClick={toggleCalendar}>
            <i className="fas fa-calendar-alt"></i>
            <div className="date-display">
              <span>{todayDate}</span>
              <span>{todayDay}</span>
            </div>
          </div>
          {isCalendarOpen && (
            <div className="calendar-popup" onClick={(e) => {if (e.target.className === 'calendar-popup') setIsCalendarOpen(false);}}>
              <CalendarView goals={goals} onClose={() => setIsCalendarOpen(false)} />
            </div>
          )}
          <div className="user-profile">
            <div className="profile-icon" onClick={toggleDropdown}>
              {user ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            {isDropdownOpen && (
              <div className="profile-dropdown" onClick={(e) => {if (e.target.className === 'profile-dropdown') setIsDropdownOpen(false);}}>
                <div className="user-info">
                  <p><strong>Username:</strong> {user?.username}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Rank:</strong> {user?.rank}</p>
                  <p><strong>Level:</strong> {currentLevel}</p>
                </div>
                <Link to="/settings" className="dropdown-item">
                  <i className="fas fa-cog"></i> Settings
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pet card">
        <Pet user={user} goals={goals} message={petMessage} animate={user?.petAnimation} />
      </div>

      <div className="tab-nav">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          Goals
        </button>
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab tab-card">
            <div className="quote-section">
              <h2>Motivation for Today</h2>
              <p className="quote">"{randomQuote}"</p>
            </div>

            <div className="rank-section">
              {user && (
                <div className="rank-container">
                  <img src={`/assets/${user.rank}.png`} alt={user.rank} className="rank-image animate-bounce" />
                  <div className="rank-details">
                    <span>Rank: {user.rank}</span>
                    <p><strong>Level:</strong> {currentLevel}</p>
                    {nextRankInfo.goal && (
                      <>
                        <p>{`${nextRankInfo.goal - completedGoals} goals to ${nextRankInfo.next}`}</p>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${Math.min(progressPercent, 100)}%` }}></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="quick-stats">
              <h2>Quick Stats</h2>
              <p><strong>Completed Goals:</strong> {totalCompleted}</p>
              <p><strong>Current Streak:</strong> {currentStreak} days</p>
              <button onClick={() => setActiveTab('goals')} className="quick-action-button">
                <i className="fas fa-plus"></i> Add a New Goal
              </button>
            </div>

            <div className="achievements-section">
              <h2>Recent Achievements</h2>
              {achievements.length === 0 ? (
                <p>No achievements yet. Keep tracking goals to earn badges!</p>
              ) : (
                <div className="badge-list">
                  {achievements.slice(0, 3).map((achievement, index) => (
                    <AchievementItem key={index} achievement={achievement} />
                  ))}
                </div>
              )}
            </div>

            <div className="social-share-overview">
              <h3>Share Your Progress</h3>
              <button onClick={() => handleShare('feed')} className="share-button">
                <i className="fab fa-instagram"></i> Feed
              </button>
              <button onClick={() => handleShare('story')} className="share-button">
                <i className="fab fa-instagram"></i> Story
              </button>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="goals-tab tab-card">
            <div className="goal-form">
              <GoalForm setGoals={setGoals} onGoalAdded={handleGoalAdded} />
            </div>
            <div className="goal-list">
              <GoalList goals={goals} setGoals={setGoals} onGoalCompleted={handleGoalCompleted} />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab tab-card">
            <div className="insights">
              <ProgressInsights goals={goals} totalCompleted={totalCompleted} totalGoals={goals.length} />
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-tab tab-card">
            <div className="achievements-section">
              <h2>Current Achievements</h2>
              {achievements.length === 0 ? (
                <p>No achievements yet. Keep tracking goals to earn badges!</p>
              ) : (
                <div className="badge-list">
                  {achievements.map((achievement, index) => (
                    <AchievementItem key={index} achievement={achievement} />
                  ))}
                </div>
              )}
            </div>
            <div className="achievements-section">
              <h2>Upcoming Achievements</h2>
              {upcomingAchievements.length === 0 ? (
                <p>Great job! You've earned all current achievements!</p>
              ) : (
                <div className="badge-list">
                  {upcomingAchievements.map((achievement, index) => (
                    <AchievementItem key={index} achievement={achievement} />
                  ))}
                </div>
              )}
            </div>
            <div className="achievements-section">
              <h2>Upcoming Ranks</h2>
              {upcomingRanks.length === 0 ? (
                <p>You're at the highest rank—congratulations!</p>
              ) : (
                <div className="badge-list">
                  {upcomingRanks.map((rank, index) => (
                    <AchievementItem key={index} achievement={rank} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AchievementItem = ({ achievement }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="badge">
      <div className="badge-clickable" onClick={() => setIsPopupOpen(true)}>
        <img src={achievement.icon} alt={achievement.name} className="badge-image" />
        <span>{achievement.name}</span>
      </div>
      {isPopupOpen && (
        <div className="achievement-popup" onClick={(e) => {if (e.target.className === 'achievement-popup') setIsPopupOpen(false);}}>
          <div className="achievement-popup-content">
            <h3>{achievement.name}</h3>
            <p>{achievement.description}</p>
            {achievement.earnedOn ? (
              <p><strong>Earned On:</strong> {achievement.earnedOn}</p>
            ) : (
              <p><strong>Requirement:</strong> {achievement.requirement}</p>
            )}
            <button onClick={() => setIsPopupOpen(false)} className="close-achievement-button">
              <i className="fas fa-times"></i> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
