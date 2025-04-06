import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import GoalList from '../components/GoalList';

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

describe('Goal Completion & Streak Tracking Tests', () => {
  const mockSetGoals = jest.fn();
  const mockOnGoalCompleted = jest.fn();

  const initialGoals = [
    {
      _id: '123',
      name: 'Meditate',
      description: '15 minutes meditation',
      type: 'daily',
      priority: 'high',
      icon: '📌',
      streak: 5,
      completed: false,
    },
    {
      _id: '456',
      name: 'Exercise',
      description: '30 minutes workout',
      type: 'daily',
      priority: 'medium',
      icon: '🏃',
      streak: 3,
      completed: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.getItem.mockReturnValue('test-token');
  });

  test('Test Case 7.1: Mark goal as complete and update streak', async () => {
    const updatedGoal = { ...initialGoals[0], completed: true, streak: 6 };
    axios.put.mockResolvedValueOnce({ data: updatedGoal });

    render(<GoalList goals={initialGoals} setGoals={mockSetGoals} onGoalCompleted={mockOnGoalCompleted} />);

    fireEvent.click(screen.getByText('Mark Complete'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://74.208.11.61:5001/api/goals/123',
        { completed: true },
        { headers: { 'x-auth-token': 'test-token' } }
      );
      expect(mockSetGoals).toHaveBeenCalledWith(expect.any(Function));
      expect(mockOnGoalCompleted).toHaveBeenCalled();
    });
  });

  test('Test Case 7.2: Undo goal completion and adjust streak', async () => {
    const updatedGoal = { ...initialGoals[1], completed: false, streak: 2 };
    axios.put.mockResolvedValueOnce({ data: updatedGoal });

    render(<GoalList goals={initialGoals} setGoals={mockSetGoals} onGoalCompleted={mockOnGoalCompleted} />);

    // Click the "Undo Complete" button for the Exercise goal
    fireEvent.click(screen.getByTestId('undo-456'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://74.208.11.61:5001/api/goals/456',
        { completed: false },
        { headers: { 'x-auth-token': 'test-token' } }
      );
      expect(mockSetGoals).toHaveBeenCalledWith(expect.any(Function));
      expect(mockOnGoalCompleted).toHaveBeenCalled();
    });
  });
});