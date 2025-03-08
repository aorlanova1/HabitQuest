import React from 'react';
import axios from 'axios';

const GoalList = ({ goals, setGoals, onGoalCompleted }) => {
  const handleComplete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`http://74.208.11.61:5001/api/goals/${id}`, { completed: true }, { headers: { 'x-auth-token': token } });
      setGoals(prev => prev.map(goal => goal._id === id ? res.data : goal));
      if (onGoalCompleted) onGoalCompleted();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="goal-list card">
      <h2>Your Goals</h2>
      {goals.length === 0 ? <p>No goals yet. Add some!</p> : (
        goals.map(goal => (
          <div
            key={goal._id}
            className={`goal-item ${
              goal.priority === 'low' ? 'priority-low' :
              goal.priority === 'high' ? 'priority-high' : 'priority-medium'
            } ${goal.completed ? 'completed' : ''}`}
          >
            <div className="goal-header">
              <span className="goal-icon">{goal.icon || '📌'}</span>
              <h3>{goal.name}</h3>
            </div>
            <p>{goal.description}</p>
            <p>Type: {goal.type} | Priority: {goal.priority} | Streak: {goal.streak}</p>
            {goal.notes && <p><strong>Notes:</strong> {goal.notes}</p>}
            <button onClick={() => handleComplete(goal._id)} disabled={goal.completed}>
              {goal.completed ? 'Completed ✓' : 'Mark Complete'}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default GoalList;
