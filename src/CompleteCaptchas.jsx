import React, { useState, useEffect } from 'react';
import './CompleteCaptchas.css'; // Import the new stylesheet

function CompleteCaptchas() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [hearts, setHearts] = useState(3); // 3 hearts
  const [taskStarted, setTaskStarted] = useState(false); // Track if the task has started
  const [taskCompleted, setTaskCompleted] = useState(false); // Track if the task is completed
  const [completionTime, setCompletionTime] = useState(null); // Time taken to complete the task
  const [randomKey, setRandomKey] = useState(null); // Random key for successful completion
  const [captchaImage, setCaptchaImage] = useState(''); // Captcha image URL
  const [userInput, setUserInput] = useState(''); // User's input
  const [captchaCount, setCaptchaCount] = useState(0); // Number of captchas solved
  const [message, setMessage] = useState(''); // Message to display to the user
  const [captchaToken, setCaptchaToken] = useState(''); // Token for CAPTCHA validation

  // Fetch CAPTCHA image and token
  const fetchCaptcha = async () => {
    try {
      const response = await fetch('/.netlify/functions/captcha');
      const data = await response.json(); // Assuming the function returns { body: SVG, token: JWT }
      const svgText = data.body;
      setCaptchaImage(`data:image/svg+xml;base64,${btoa(svgText)}`);
      setCaptchaToken(data.token); // Store the token for validation
    } catch (error) {
      console.error('Error fetching captcha:', error);
    }
  };

  // Validate CAPTCHA
  const validateCaptcha = async () => {
    const userAnswer = userInput.trim();
    try {
      const response = await fetch('/.netlify/functions/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: userAnswer,
          token: captchaToken, // Pass the token for validation
        }),
      });
      const result = await response.json();

      if (result.success) {
        const newCaptchaCount = captchaCount + 1; // Calculate the new count
        setCaptchaCount(newCaptchaCount); // Update the state
        if (newCaptchaCount === 20) { // Use the updated value for the condition
          handleSuccess();
        } else {
          fetchCaptcha(); // Fetch a new CAPTCHA
        }
        setMessage('Correct! Moving to the next captcha.');
      } else {
        setHearts(hearts - 1);
        setMessage('Incorrect! Try again.');
        if (hearts - 1 === 0) {
          setMessage('Game Over! You have no hearts left.');
          setTaskStarted(false);
        }
      }
    } catch (error) {
      console.error('Error validating captcha:', error);
    }
    setUserInput('');
  };

  // Handle successful completion
  const handleSuccess = async () => {
    const completionTime = 300 - timeLeft; // Calculate time taken
    const randomKey = generateRandomKey(); // Generate a random key
    const completionDate = new Date().toISOString(); // Get the current date and time

    // Save completion data to the backend
    try {
      const response = await fetch('/.netlify/functions/save-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: randomKey,
          date: completionDate,
          timeTaken: completionTime,
        }),
      });

      if (response.ok) {
        setTaskCompleted(true);
        setCompletionTime(completionTime);
        setRandomKey(randomKey);
        console.log('Completion data saved successfully');
      } else {
        console.error('Failed to save completion data');
      }
    } catch (error) {
      console.error('Error saving completion data:', error);
    }
  };

  // Generate a random key
  const generateRandomKey = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase(); // Random 8-character key
  };

  // Start the task
  const startTask = () => {
    setTaskStarted(true);
    setTimeLeft(300); // Reset timer
    setHearts(3); // Reset hearts
    setTaskCompleted(false); // Reset completion status
    setCompletionTime(null); // Reset completion time
    setRandomKey(null); // Reset random key
    setCaptchaCount(0); // Reset captcha count
    setMessage(''); // Clear message
    fetchCaptcha(); // Fetch the first captcha
  };

  // Timer logic
  useEffect(() => {
    if (taskStarted && timeLeft > 0 && hearts > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || hearts === 0) {
      setTaskStarted(false); // Stop the task if time runs out or hearts are depleted
    }
  }, [taskStarted, timeLeft, hearts]);

  return (
    <section id="complete-captchas">
      <h2>Complete Captchas</h2>
      <p>Earn $$$ for every 20 captchas you solve! Follow these steps:</p>
      <ol>
        <li>Start the task by clicking the button below.</li>
        <li>Solve 20 captchas. You have 3 hearts—lose one for each incorrect answer.</li>
        <li>If you complete the task successfully, you'll receive a reward key!</li>
      </ol>

      {!taskStarted && !taskCompleted && (
        <button className="script-button" onClick={startTask}>
          Start Task
        </button>
      )}

      {taskStarted && !taskCompleted && (
        <div className="task-status">
          <p>Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
          <p>Hearts: {hearts}</p>
          <p>Captchas Solved: {captchaCount}/20</p>
          {captchaImage && <img src={captchaImage} alt="Captcha" className="captcha-image" />}
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type the text in the image"
            className="captcha-input"
          />
          <button className="script-button" onClick={validateCaptcha}>
            Submit
          </button>
          {message && <p className="message">{message}</p>}
        </div>
      )}

      {taskCompleted && (
        <div className="task-completed">
          <h3>🎉 Congratulations! 🎉</h3>
          <p>You completed the task in {Math.floor(completionTime / 60)}:{String(completionTime % 60).padStart(2, '0')}!</p>
          <p>Your random key: <strong>{randomKey}</strong></p>
        </div>
      )}

      {!taskStarted && !taskCompleted && (timeLeft === 0 || hearts === 0) && (
        <div className="task-failed">
          <h3>😢 Task Failed</h3>
          <p>{timeLeft === 0 ? "Time's up!" : "You ran out of hearts!"}</p>
          <button className="script-button" onClick={startTask}>
            Try Again
          </button>
        </div>
      )}
    </section>
  );
}

export default CompleteCaptchas;