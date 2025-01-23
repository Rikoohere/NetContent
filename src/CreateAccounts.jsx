import React, { useState, useEffect } from "react";
import "./CreateAccounts.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyBoPAyG-HKt-eVh-v70fFwRAZmG-8Cbur0",
  authDomain: "adcontent-2b1fd.firebaseapp.com",
  databaseURL: "https://adcontent-2b1fd-default-rtdb.firebaseio.com",
  projectId: "adcontent-2b1fd",
  storageBucket: "adcontent-2b1fd.firebasestorage.app",
  messagingSenderId: "29738593443",
  appId: "1:29738593443:web:2b5bb38e0b215eaa28a316"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function CreateAccounts() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [taskData, setTaskData] = useState({ email: "", password: "" });
  const [taskId, setTaskId] = useState(null);

  const generateTaskData = async () => {
    setIsLoading(true);
    setMessage("Waiting for email and password...");

    try {
      const taskRef = push(ref(database, 'tasks'));
      const taskId = taskRef.key;
      setTaskId(taskId);

      set(ref(database, `tasks/${taskId}`), {
        status: 'pending',
        email: '',
        password: ''
      });

      pollForAccountDetails(taskId);
    } catch (error) {
      console.error("Error generating task:", error);
      setMessage("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const pollForAccountDetails = (taskId) => {
    const taskRef = ref(database, `tasks/${taskId}`);

    onValue(taskRef, (snapshot) => {
      const taskData = snapshot.val();
      if (taskData && taskData.email && taskData.password) {
        setIsLoading(false);
        setTaskData({ email: taskData.email, password: taskData.password });
        setMessage("Email and password received!");
      }
    }, {
      onlyOnce: false // Keep listening for changes
    });
  };

  const handleSubmit = async () => {
    if (!taskId) return;

    try {
      await set(ref(database, `tasks/${taskId}/status`), 'ready');
      setMessage("Task submitted successfully!");
    } catch (error) {
      console.error("Error submitting task:", error);
      setMessage("An error occurred. Please try again.");
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
        {isLoading ? "Generating..." : "Generate Task"}
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
    </section>
  );
}

export default CreateAccounts;