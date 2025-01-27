import React, { useState, useEffect } from 'react';
import './CompleteCaptchas.css';

function CompleteCaptchas() {
  const [timeLeft, setTimeLeft] = useState(300);
  const [hearts, setHearts] = useState(3);
  const [taskStarted, setTaskStarted] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [completionTime, setCompletionTime] = useState(null);
  const [randomKey, setRandomKey] = useState(null);
  const [captchaImage, setCaptchaImage] = useState('');
  const [userInput, setUserInput] = useState('');
  const [captchaCount, setCaptchaCount] = useState(0);
  const [message, setMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');

  // Dynamically load scripts
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    const loadAllScripts = async () => {
      try {
        await loadScript('//rethinkexercisesupplement.com/6ddfa8e1642a53b4630f866b9c6a3245/invoke.js');
        await loadScript('//rethinkexercisesupplement.com/76/d0/01/76d0017fad4877df067daab7a903e5cf.js');
        console.log('Scripts loaded successfully');
      } catch (error) {
        console.error(error);
      }
    };

    loadAllScripts();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const response = await fetch('/.netlify/functions/captcha');
      const data = await response.json();
      setCaptchaImage(`data:image/svg+xml;base64,${btoa(data.body)}`);
      setCaptchaToken(data.token);
    } catch (error) {
      console.error('Error fetching captcha:', error);
    }
  };

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
          token: captchaToken,
        }),
      });
      const result = await response.json();
      if (result.success) {
        const newCaptchaCount = captchaCount + 1;
        setCaptchaCount(newCaptchaCount);
        if (newCaptchaCount === 20) {
          handleSuccess();
        } else {
          fetchCaptcha();
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

  const handleSuccess = async () => {
    const completionTime = 300 - timeLeft;
    const randomKey = generateRandomKey();
    try {
      const response = await fetch('/.netlify/functions/save-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: randomKey,
          date: new Date().toISOString(),
          timeTaken: completionTime,
        }),
      });

      if (response.ok) {
        setTaskCompleted(true);
        setCompletionTime(completionTime);
        setRandomKey(randomKey);
      } else {
        console.error('Failed to save completion data');
      }
    } catch (error) {
      console.error('Error saving completion data:', error);
    }
  };

  const generateRandomKey = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const startTask = () => {
    setTaskStarted(true);
    setTimeLeft(300);
    setHearts(3);
    setTaskCompleted(false);
    setCompletionTime(null);
    setRandomKey(null);
    setCaptchaCount(0);
    setMessage('');
    fetchCaptcha();
  };

  useEffect(() => {
    if (taskStarted && timeLeft > 0 && hearts > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || hearts === 0) {
      setTaskStarted(false);
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
