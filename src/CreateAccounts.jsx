import React, { useState } from 'react';
import './CreateAccounts.css';

function CreateAccounts() {
  const [showContainer, setShowContainer] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [message, setMessage] = useState('');
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

  const handleSubmit = async () => {
    const accountDetails = {
      firstName: taskData.firstName,
      lastName: taskData.lastName,
      day: taskData.day,
      month: taskData.month,
      year: taskData.year,
      email: userEmail,
      password: userPassword,
    };
  
    try {
      const response = await fetch('/.netlify/functions/submit-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountDetails),
      });
  
      const result = await response.json();
  
      if (result.success) {
        setMessage(`Account details submitted successfully! Confirmation Key: ${result.confirmationKey}`);
        setUserEmail('');
        setUserPassword('');
      } else {
        setMessage(result.message || 'Failed to submit account details. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting account details:', error);
      setMessage('An error occurred. Please try again.');
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
  
    try {
      // Send a request to the Telegram bot to get the email and password
      const telegramResponse = await fetch('/.netlify/functions/submit-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          day,
          month,
          year,
        }),
      });
  
      const telegramResult = await telegramResponse.json();
  
      if (telegramResult.success) {
        // Update the task data with the email and password from the Telegram bot
        setTaskData({
          firstName,
          lastName,
          day,
          month,
          year,
          email: telegramResult.email,
          password: telegramResult.password,
        });
      } else {
        console.error('Failed to get email and password from Telegram bot');
        setTaskData({
          firstName,
          lastName,
          day,
          month,
          year,
          email,
          password,
        });
      }
    } catch (error) {
      console.error('Error communicating with Telegram bot:', error);
      setTaskData({
        firstName,
        lastName,
        day,
        month,
        year,
        email,
        password,
      });
    }
  };

  return (
    <section id="create-accounts">
      <h2>Create Accounts</h2>
      <p>Earn $ for every account you create! Follow these steps:</p>
      <ol>
        <li>Click "Generate Task" to get account details.</li>
        <li>Visit Create a new gmail account with the provided details.</li>
        <li>Submit the email and password to confirm.</li>
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

          <div className="user-input">
            <input
              type="text"
              placeholder="Enter the email you created"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter the password you created"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
            <button className="script-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>

          {message && <p className="message">{message}</p>}
        </div>
      )}
    </section>
  );
}

export default CreateAccounts;