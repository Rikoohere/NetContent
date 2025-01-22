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
        console.log('Response:', response);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Result:', result);

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

  const handleUpdateTask = async () => {
    try {
      const response = await fetch('/.netlify/functions/update-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: taskId,
          email: 'test@gmail.com',
          password: 'Password123!',
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage('Task updated successfully!');
      } else {
        setMessage(result.message || 'Failed to update task. Please try again.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

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

      <button
        className="script-button"
        onClick={generateTaskData}
        disabled={isLoading}
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

          <button className="script-button" onClick={handleSubmit}>
            Submit
          </button>

          {message && <p className="message">{message}</p>}
        </div>
      )}

      <button className="script-button" onClick={handleUpdateTask}>
        Update Task (Test)
      </button>
    </section>
  );
}

export default CreateAccounts;