import React, { useState } from 'react';
import './CreateAccounts.css';

function CreateAccounts() {
  const [showContainer, setShowContainer] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmationKey, setConfirmationKey] = useState('');
  const [taskData, setTaskData] = useState({
    firstName: '',
    lastName: '',
    day: '',
    month: '',
    year: '',
    email: '',
    password: '',
  });

  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    return Array.from({ length: 12 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  };

  const generateRandomBirthDate = (startYear, endYear) => {
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = (`0${Math.floor(Math.random() * 12) + 1}`).slice(-2);
    const day = (`0${Math.floor(Math.random() * 28) + 1}`).slice(-2);
    return { day, month, year };
  };

  const fetchRandomName = async () => {
    try {
      const response = await fetch('https://randomuser.me/api/');
      const data = await response.json();
      const { first, last } = data.results[0].name;
      return { firstName: first, lastName: last };
    } catch (error) {
      console.error('Error fetching random name:', error);
      return { firstName: 'John', lastName: 'Doe' };
    }
  };

  const generateEmail = (firstName, lastName) => {
    const randomNum = Math.floor(Math.random() * 1000);
    return `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNum}@gmail.com`;
  };

  const generateTaskData = async () => {
    const { firstName, lastName } = await fetchRandomName();
    const { day, month, year } = generateRandomBirthDate(1980, 2005);
    const password = generateRandomPassword();
    const email = generateEmail(firstName, lastName);

    // Update task data
    setTaskData({
      firstName,
      lastName,
      day,
      month,
      year,
      email,
      password,
    });
  };

  const handleSubmit = async () => {
    try {
      // Send account details to the backend
      const response = await fetch('/.netlify/functions/submit-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();

      if (result.success) {
        setConfirmationKey(result.confirmationKey); // Store the confirmation key
        setMessage('Task submitted successfully!');
      } else {
        setMessage(result.message || 'Failed to submit task. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(confirmationKey)
      .then(() => {
        alert('Confirmation key copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy confirmation key.');
      });
  };

  return (
    <section id="create-accounts">
      <h2>Create Accounts</h2>
      <p>Earn $ for every account you create! Follow these steps:</p>
      <ol>
        <li>Click "Generate Task" to get account details.</li>
        <li>Visit Create a new gmail account with the provided details.</li>
        <li>Click "Submit" to confirm the task.</li>
      </ol>

      <button
        className="script-button"
        onClick={async () => {
          setShowContainer(true);
          await generateTaskData();
        }}
      >
        Generate Task
      </button>

      {showContainer && (
        <div className="task-container">
          <h3>Task Details</h3>
          <div className="task-data">
            <p><strong>First Name:</strong> {taskData.firstName}</p>
            <p><strong>Last Name:</strong> {taskData.lastName}</p>
            <p><strong>Date of Birth:</strong> {taskData.day}/{taskData.month}/{taskData.year}</p>
            <p><strong>Email:</strong> {taskData.email}</p>
            <p><strong>Password:</strong> {taskData.password}</p>
          </div>

          <button className="script-button" onClick={handleSubmit}>
            Submit
          </button>

          {confirmationKey && (
            <div className="confirmation-key">
              <div className="key-box">
                <span className="key-label">Confirmation Key:</span>
                <span className="key-value">{confirmationKey}</span>
              </div>
              <button className="copy-button" onClick={copyToClipboard}>
                Copy Key
              </button>
            </div>
          )}

          {message && <p className="message">{message}</p>}
        </div>
      )}
    </section>
  );
}

export default CreateAccounts;