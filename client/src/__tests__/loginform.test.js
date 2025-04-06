import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import LoginForm from '../components/LoginForm';
import '@testing-library/jest-dom';

// Mock setup
jest.mock('axios');
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

// Define localStorage mock
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};

// Set up localStorage mock before all tests
beforeAll(() => {
  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true
  });
});

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('logs in with correct credentials and redirects to dashboard', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: 'test-token' } });

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Email or Username'), {
        target: { value: 'user@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'StrongPass123' }
      });
      fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        'http://74.208.11.61:5001/api/auth/login',
        { identifier: 'user@example.com', password: 'StrongPass123' }
      );
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error message for incorrect credentials', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { msg: 'Invalid credentials' } }
    });

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Email or Username'), {
        target: { value: 'user@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'wrongpass' }
      });
      fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    });

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(mockedNavigate).not.toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  test('prevents submission with empty fields', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    });

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });
  });

  test('handles server errors properly', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Email or Username'), {
        target: { value: 'user@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'StrongPass123' }
      });
      fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    });

    await waitFor(() => {
      expect(screen.getByText('Login failed')).toBeInTheDocument();
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  test('includes link to registration page', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const registerLink = screen.getByText('Register');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  test('navigates back to home page', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Back to Home'));
    });

    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });
});