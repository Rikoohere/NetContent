import React, { useState, useEffect } from 'react';
import './CreateAccounts.css';

function CreateAccounts() {
  const [showContainer, setShowContainer] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taskData, setTaskData] = useState({
    email: '',
    password: '',
  });
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState('Offline'); // Track online/offline status
  const [timeLeft, setTimeLeft] = useState(null); // Track the countdown for task submission

  const checkOnlineStatus = async () => {
    try {
      const response = await fetch('/.netlify/functions/check-status'); // Netlify function to check the status
      const result = await response.json();
      if (result.success) {
        setStatus('Online');
      } else {
        setStatus('Offline');
      }
    } catch (error) {
      setStatus('Offline');
      console.error('Error checking status:', error);
    }
  };

  useEffect(() => {
    checkOnlineStatus();
    const interval = setInterval(checkOnlineStatus, 30000); // Check every 30 seconds to keep status updated
    return () => clearInterval(interval);
  }, []);

  const generateTaskData = async () => {
    setIsLoading(true);
    setMessage('Waiting for email and password...');

    try {
      // Call Netlify function to create a task
      const response = await fetch('/.netlify/functions/create-task', {
        method: 'POST',
      });

      const result = await response.json();
      if (result.success) {
        setTaskId(result.taskId); // Store the task ID
        console.log('Task ID:', result.taskId);
        pollForAccountDetails(result.taskId); // Start polling for email and password
        setTimeLeft(10 * 60); // Set timer for 10 minutes (in seconds)
      } else {
        setMessage('Failed to generate task. Please try again.');
      }
    } catch (error) {
      console.error('Error generating task:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const pollForAccountDetails = async (taskId) => {
    const interval = setInterval(async () => {
      try {
        console.log('Polling for task details...');
        const response = await fetch(`/.netlify/functions/get-task?taskId=${taskId}`);
        const result = await response.json();

        if (result.success && result.email && result.password) {
          clearInterval(interval); // Stop polling
          setIsLoading(false);
          setTaskData({ email: result.email, password: result.password });
          setMessage('Email and password received!');
        } else {
          console.log('Waiting for admin response...');
        }
      } catch (error) {
        console.error('Error polling for account details:', error);
        clearInterval(interval); // Stop polling on error
        setIsLoading(false);
        setMessage('An error occurred while fetching account details.');
      }
    }, 5000); // Poll every 5 seconds
  };

  const handleSubmit = async () => {
    try {
      // Send confirmation to Netlify function
      const response = await fetch('/.netlify/functions/confirm-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, ...taskData }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Task submitted successfully!');
      } else {
        setMessage(result.message || 'Failed to submit task. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleTimeCountdown = () => {
    if (timeLeft > 0) {
      setTimeLeft(timeLeft - 1);
    } else {
      // Time is up, mark task as ready or handle expiration
      setMessage('Time expired. Task will be marked as ready.');
      // Here you might call a function to update the task to "Ready"
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(handleTimeCountdown, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  return (
    <section id="create-accounts">
      <h2>Create Accounts</h2>
      <p>Earn $ for every account you create! Follow these steps:</p>
      <ol>
        <li>Click "Generate Task" to request account details.</li>
        <li>Wait for the email and password to be provided.</li>
        <li>Create a new Gmail account with the provided details.</li>
        <li>Click "Submit" to confirm the task.</li>
      </ol>

      <p className={`status ${status === 'Online' ? 'online' : 'offline'}`}>{status}</p>

      <button
        className="script-button"
        onClick={generateTaskData}
        disabled={isLoading || status !== 'Online'}
      >
        {isLoading ? 'Generating...' : 'Generate Task'}
      </button>

      {isLoading && <div className="loading">Waiting for email and password...</div>}

      {taskData.email && taskData.password && (
        <div className="task-container">
          <h3>Task Details</h3>
          <div className="task-data">
            <p><strong>Email:</strong> {taskData.email}</p>
            <p><strong>Password:</strong> {taskData.password}</p>
          </div>

          <div className="task-time">
            <p><strong>Time Left:</strong> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
          </div>

          <input
            type="email"
            placeholder="Enter Email"
            value={taskData.email}
            onChange={(e) => setTaskData({ ...taskData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={taskData.password}
            onChange={(e) => setTaskData({ ...taskData, password: e.target.value })}
          />

          <button className="script-button" onClick={handleSubmit}>
            Submit
          </button>

          {message && <p className="message">{message}</p>}
        </div>
      )}
    </section>
  );
}

export default CreateAccounts;
