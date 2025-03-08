import React, { useState } from 'react';
import axios from 'axios';

const GoalForm = ({ setGoals, onGoalAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('daily');
  const [priority, setPriority] = useState('medium');
  const [icon, setIcon] = useState('default');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.length < 3) {
      setError('Goal name must be at least 3 characters long');
      return;
    }

    const token = localStorage.getItem('token');
    const newGoal = { name, description, type: type, priority, icon, notes }; // Ensure 'frequency' is sent as 'type'
    try {
      const res = await axios.post('http://74.208.11.61:5001/api/goals', newGoal, { headers: { 'x-auth-token': token } });
      setGoals(prev => [...prev, res.data]);
      setName('');
      setDescription('');
      setType('daily');
      setPriority('medium');
      setIcon('default');
      setNotes('');
      setError('');
      if (onGoalAdded) onGoalAdded();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add goal');
    }
  };

  return (
    <div className="goal-form card">
      <h2>Add a New Goal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Goal Name</label>
          <input
            type="text"
            placeholder="e.g., Drink 8 glasses of water"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Describe your goal (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="form-group">
          <label>Icon</label>
          <select value={icon} onChange={(e) => setIcon(e.target.value)}>
            <option value="default">Default Icon</option>
            <option value="star">⭐ Star</option>
            <option value="heart">❤️ Heart</option>
            <option value="book">📚 Book</option>
            <option value="run">🏃 Run</option>
            <option value="apple">🍎 Apple</option>
          </select>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea
            placeholder="Notes (e.g., how did it go?)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit">Add Goal</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default GoalForm;
