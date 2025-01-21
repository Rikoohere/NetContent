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
      // Send a request to the backend function
      const response = await fetch('/.netlify/functions/submit-account', {
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
          email, // Include email
          password, // Include password
        }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        // Update the task data with the confirmation key from the backend
        setTaskData({
          firstName,
          lastName,
          day,
          month,
          year,
          email,
          password,
          confirmationKey: result.confirmationKey, // Add confirmation key
        });
      } else {
        console.error('Failed to submit account details:', result.message);
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
      console.error('Error submitting account details:', error);
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