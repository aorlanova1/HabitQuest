import React, { useState } from 'react';
import './CalendarView.css';

const CalendarView = ({ goals, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day, event) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(clickedDate);

    // Get the position of the clicked date element
    const rect = event.currentTarget.getBoundingClientRect();
    const calendarRect = event.currentTarget.closest('.calendar-container').getBoundingClientRect();
    
    // Calculate position relative to the calendar container
    const top = rect.bottom - calendarRect.top + 10; // Position below the date
    const left = rect.left - calendarRect.left + (rect.width / 2); // Center horizontally relative to the date

    setPopupPosition({ top, left });
    setIsPopupOpen(true);
  };

  const getGoalsForDate = (date) => {
    return goals.filter(goal => {
      if (!goal.completed || !goal.createdAt) return false;
      const goalDate = new Date(goal.createdAt);
      return (
        goalDate.getDate() === date.getDate() &&
        goalDate.getMonth() === date.getMonth() &&
        goalDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const renderDays = () => {
    const days = [];
    const today = new Date();

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const goalsOnDay = getGoalsForDate(date);
      const isToday = date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={day}
          className={`calendar-day ${goalsOnDay.length > 0 ? 'active' : ''} ${isToday ? 'today' : ''}`}
          onClick={(e) => handleDateClick(day, e)}
        >
          <span>{day}</span>
          {goalsOnDay.length > 0 && (
            <div className="completed-goals-tooltip">
              <span className="completed-marker">✔</span>
              <div className="tooltip-content">
                {goalsOnDay.map((goal, index) => (
                  <div key={index} className="goal-marker">✔ {goal.name}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const goalsForSelectedDate = selectedDate ? getGoalsForDate(selectedDate) : [];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="calendar-nav-button" onClick={handlePrevMonth}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h3>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
        <button className="calendar-nav-button" onClick={handleNextMonth}>
          <i className="fas fa-chevron-right"></i>
        </button>
        <button className="calendar-close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="calendar-day-header">{day}</div>
        ))}
        {renderDays()}
      </div>
      {isPopupOpen && selectedDate && (
        <div className="date-details-popup" style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }} onClick={(e) => {if (e.target.className === 'date-details-popup') setIsPopupOpen(false);}}>
          <div className="date-details-popup-content">
            <h3>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3>
            {goalsForSelectedDate.length > 0 ? (
              <ul>
                {goalsForSelectedDate.map((goal, index) => (
                  <li key={index}>{goal.name}</li>
                ))}
              </ul>
            ) : (
              <p>No goals completed on this day.</p>
            )}
            <button onClick={() => setIsPopupOpen(false)} className="close-date-details-button">
              <i className="fas fa-times"></i> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;