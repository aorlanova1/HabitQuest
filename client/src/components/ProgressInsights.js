import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const ProgressInsights = ({ goals, totalCompleted, totalGoals }) => {
  // Success Rate (from Statistics)
  const successRate = totalGoals > 0 ? (totalCompleted / totalGoals) * 100 : 0;

  // Completed Goals by Type Bar Chart (from Statistics)
  const completedByTypeData = {
    labels: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    datasets: [{
      label: 'Completed Goals',
      data: [
        goals.filter(g => g.type === 'daily' && g.completed).length,
        goals.filter(g => g.type === 'weekly' && g.completed).length,
        goals.filter(g => g.type === 'monthly' && g.completed).length,
        goals.filter(g => g.type === 'yearly' && g.completed).length
      ],
      backgroundColor: [
        'linear-gradient(135deg, #77D7F7 0%, #4DA8DA 100%)',
        'linear-gradient(135deg, #81C784 0%, #4CAF50 100%)',
        'linear-gradient(135deg, #FFCA28 0%, #FFB300 100%)',
        'linear-gradient(135deg, #F48FB1 0%, #EC407A 100%)'
      ].map(gradient => {
        const ctx = document.createElement('canvas').getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 0, 400);
        const [start, end] = gradient.match(/#[0-9a-fA-F]{6}/g);
        grad.addColorStop(0, start);
        grad.addColorStop(1, end);
        return grad;
      }),
      borderColor: [
        '#4DA8DA',
        '#4CAF50',
        '#FFB300',
        '#EC407A'
      ],
      borderWidth: 2,
      borderRadius: 5,
      hoverBackgroundColor: [
        'rgba(77, 215, 247, 0.9)',
        'rgba(129, 199, 132, 0.9)',
        'rgba(255, 202, 40, 0.9)',
        'rgba(244, 143, 177, 0.9)'
      ],
      hoverBorderColor: [
        '#2E86C1',
        '#388E3C',
        '#FFA000',
        '#D81B60'
      ],
      hoverBorderWidth: 3
    }]
  };

  const completedByTypeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: 'Montserrat',
            weight: '500'
          },
          color: '#00796b'
        }
      },
      title: {
        display: true,
        text: 'Completed Goals by Type',
        font: {
          size: 16,
          family: 'Montserrat',
          weight: '600'
        },
        color: '#00796b',
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { family: 'Montserrat', size: 12 },
        bodyFont: { family: 'Montserrat', size: 10 },
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Goals',
          font: {
            size: 12,
            family: 'Montserrat'
          },
          color: '#00796b'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 10,
            family: 'Montserrat'
          },
          color: '#333'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Goal Type',
          font: {
            size: 12,
            family: 'Montserrat'
          },
          color: '#00796b'
        },
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 10,
            family: 'Montserrat'
          },
          color: '#333'
        }
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    },
    maintainAspectRatio: false
  };

  // Success Rate Over Time
  const completedByDate = {};
  goals.forEach(goal => {
    if (goal.completed) {
      const date = new Date(goal.createdAt);
      const dayKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      completedByDate[dayKey] = (completedByDate[dayKey] || 0) + 1;
    }
  });

  const dates = Object.keys(completedByDate).sort((a, b) => new Date(a) - new Date(b));
  const successData = dates.map(date => completedByDate[date] || 0);

  const successRateData = {
    labels: dates,
    datasets: [{
      label: 'Completed Goals Over Time',
      data: successData,
      borderColor: '#00796b',
      backgroundColor: 'rgba(0, 121, 107, 0.2)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#00796b',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#00796b'
    }]
  };

  const successRateOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: 'Montserrat',
            weight: '500'
          },
          color: '#00796b'
        }
      },
      title: {
        display: true,
        text: 'Success Rate Over Time',
        font: {
          size: 16,
          family: 'Montserrat',
          weight: '600'
        },
        color: '#00796b',
        padding: {
          bottom: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Completed Goals',
          font: {
            size: 12,
            family: 'Montserrat'
          },
          color: '#00796b'
        },
        ticks: {
          font: {
            size: 10,
            family: 'Montserrat'
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 12,
            family: 'Montserrat'
          },
          color: '#00796b'
        },
        ticks: {
          font: {
            size: 10,
            family: 'Montserrat'
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  // Most active days (by weekday)
  const activeDays = {};
  goals.forEach(goal => {
    if (goal.completed) {
      const date = new Date(goal.createdAt);
      const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
      activeDays[weekday] = (activeDays[weekday] || 0) + 1;
    }
  });

  const activeDaysData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [{
      label: 'Completions by Day',
      data: [
        activeDays['Monday'] || 0,
        activeDays['Tuesday'] || 0,
        activeDays['Wednesday'] || 0,
        activeDays['Thursday'] || 0,
        activeDays['Friday'] || 0,
        activeDays['Saturday'] || 0,
        activeDays['Sunday'] || 0
      ],
      backgroundColor: '#ffca28',
      borderColor: '#ffb300',
      borderWidth: 2,
      borderRadius: 5
    }]
  };

  const activeDaysOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: 'Montserrat',
            weight: '500'
          },
          color: '#00796b'
        }
      },
      title: {
        display: true,
        text: 'Most Active Days of the Week',
        font: {
          size: 16,
          family: 'Montserrat',
          weight: '600'
        },
        color: '#00796b',
        padding: {
          bottom: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Completions',
          font: {
            size: 12,
            family: 'Montserrat'
          },
          color: '#00796b'
        },
        ticks: {
          font: {
            size: 10,
            family: 'Montserrat'
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Day of the Week',
          font: {
            size: 12,
            family: 'Montserrat'
          },
          color: '#00796b'
        },
        ticks: {
          font: {
            size: 10,
            family: 'Montserrat'
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  // Longest streak
  const longestStreak = Math.max(...goals.map(g => g.streak), 0);

  return (
    <div className="insights">
      <h2>Analytics</h2>
      <div className="insights-card card success-rate">
        <div className="card-header">
          <i className="fas fa-chart-line"></i>
          <h3>Success Rate</h3>
        </div>
        <div className="card-content">
          <p><strong>{successRate.toFixed(1)}%</strong></p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${successRate}%` }}></div>
          </div>
        </div>
      </div>
      <div className="divider"><i className="fas fa-chevron-down"></i></div>
      <div className="insights-card card">
        <div className="card-header">
          <i className="fas fa-chart-bar"></i>
          <h3>Completed Goals by Type</h3>
        </div>
        <div className="card-content chart-container">
          <Bar data={completedByTypeData} options={completedByTypeOptions} height={600} />
        </div>
      </div>
      <div className="divider"><i className="fas fa-chevron-down"></i></div>
      <div className="insights-card card">
        <div className="card-header">
          <i className="fas fa-line-chart"></i>
          <h3>Success Rate Over Time</h3>
        </div>
        <div className="card-content chart-container">
          <Line data={successRateData} options={successRateOptions} height={600} />
        </div>
      </div>
      <div className="divider"><i className="fas fa-chevron-down"></i></div>
      <div className="insights-card card">
        <div className="card-header">
          <i className="fas fa-calendar-day"></i>
          <h3>Most Active Days</h3>
        </div>
        <div className="card-content chart-container">
          <Bar data={activeDaysData} options={activeDaysOptions} height={600} />
        </div>
      </div>
      <div className="divider"><i className="fas fa-chevron-down"></i></div>
      <div className="insights-card card longest-streak">
        <div className="card-header">
          <i className="fas fa-star"></i>
          <h3>Longest Streak</h3>
        </div>
        <div className="card-content">
          <p><strong>{longestStreak}</strong> days</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressInsights;