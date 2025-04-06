import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import GoalForm from '../components/GoalForm';

// Mock axios
jest.mock('axios');

// Mock localStorage globally
beforeAll(() => {
  const localStorageMock = {
    getItem: jest.fn(() => 'test-token'),
    setItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
});

describe('Daily Goal Creation Tests', () => {
  const mockSetGoals = jest.fn();
  const mockOnGoalAdded = jest.fn();
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Ensure localStorage.getItem returns 'test-token' for each test
    window.localStorage.getItem.mockReturnValue('test-token');
  });

  // Test Case 3.1
  test('Test Case 3.1: Creating a valid daily goal', async () => {
    const newGoal = {
      name: 'Workout',
      description: '30 min run',
      type: 'daily',
      priority: 'high',
      icon: 'default',
      notes: ''
    };
    
    const responseData = { ...newGoal, _id: '123' };
    axios.post.mockResolvedValueOnce({ data: responseData });
    
    render(<GoalForm setGoals={mockSetGoals} onGoalAdded={mockOnGoalAdded} />);
    
    fireEvent.change(screen.getByLabelText(/Goal Name/i), { target: { value: newGoal.name } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: newGoal.description } });
    fireEvent.change(screen.getByLabelText(/Priority/i), { target: { value: newGoal.priority } });
    
    fireEvent.click(screen.getByText(/Add Goal/i));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://74.208.11.61:5001/api/goals',
        newGoal,
        { headers: { 'x-auth-token': 'test-token' } }
      );
      expect(mockSetGoals).toHaveBeenCalledWith(expect.any(Function));
      expect(mockOnGoalAdded).toHaveBeenCalled();
    });
  });

  // Test Case 3.2
  test('Test Case 3.2: Submitting goal with empty name', async () => {
    render(<GoalForm setGoals={mockSetGoals} onGoalAdded={mockOnGoalAdded} />);
    
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Read 10 pages' } });
    fireEvent.change(screen.getByLabelText(/Priority/i), { target: { value: 'medium' } });
    
    fireEvent.click(screen.getByText(/Add Goal/i));
    
    expect(axios.post).not.toHaveBeenCalled();
    expect(mockSetGoals).not.toHaveBeenCalled();
    expect(mockOnGoalAdded).not.toHaveBeenCalled();
    
    await waitFor(() => {
      expect(screen.getByText(/Goal name must be at least 3 characters long/i)).toBeInTheDocument();
    });
  });

  // Test Case 3.3
  test('Test Case 3.3: Setting reminder time for daily goal', async () => {
    const newGoal = {
      name: 'Study',
      description: '',
      type: 'daily',
      priority: 'medium',
      icon: 'default',
      notes: 'Reminder set for 5:00 PM'
    };
    
    const responseData = { ...newGoal, _id: '456' };
    axios.post.mockResolvedValueOnce({ data: responseData });
    
    render(<GoalForm setGoals={mockSetGoals} onGoalAdded={mockOnGoalAdded} />);
    
    fireEvent.change(screen.getByLabelText(/Goal Name/i), { target: { value: newGoal.name } });
    fireEvent.change(screen.getByLabelText(/Notes/i), { target: { value: newGoal.notes } });
    
    fireEvent.click(screen.getByText(/Add Goal/i));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://74.208.11.61:5001/api/goals',
        newGoal,
        { headers: { 'x-auth-token': 'test-token' } }
      );
      expect(mockSetGoals).toHaveBeenCalledWith(expect.any(Function));
      expect(mockOnGoalAdded).toHaveBeenCalled();
    });
  });

  // Additional test
  test('Validates goal name must be at least 3 characters', async () => {
    render(<GoalForm setGoals={mockSetGoals} onGoalAdded={mockOnGoalAdded} />);
    
    fireEvent.change(screen.getByLabelText(/Goal Name/i), { target: { value: 'Hi' } });
    
    fireEvent.click(screen.getByText(/Add Goal/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Goal name must be at least 3 characters long/i)).toBeInTheDocument();
    });
    expect(axios.post).not.toHaveBeenCalled();
  });
});