import React, { useState, useEffect } from "react";
import "./CreateAccounts.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA24WbDDSI6ZaDhjG5e5e2WREVgJmOl1-4",
  authDomain: "netcontent-98e69.firebaseapp.com",
  projectId: "netcontent-98e69",
  storageBucket: "netcontent-98e69.firebasestorage.app",
  messagingSenderId: "595148978494",
  appId: "1:595148978494:web:73b4a841ad384cf4a2546f",
  measurementId: "G-CDQRMK1WJZ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function CreateAccounts() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [taskData, setTaskData] = useState({ email: "", password: "" });
  const [taskId, setTaskId] = useState(null);
  const [systemStatus, setSystemStatus] = useState("offline"); // Track system status

  // Fetch system status
  useEffect(() => {
    const systemStatusRef = ref(database, "systemStatus/value");
    onValue(systemStatusRef, (snapshot) => {
      setSystemStatus(snapshot.val());
    });
  }, [database]);

  // Function to fetch user's IP address
  const fetchUserIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return "Unknown";
    }
  };

  const generateTaskData = async () => {
    setIsLoading(true);
    setMessage("Waiting for email and password...");

    try {
      const userIP = await fetchUserIP(); // Fetch user's IP
      const taskRef = push(ref(database, 'tasks'));
      const taskId = taskRef.key;
      setTaskId(taskId);

      // Add task with IP and date
      set(ref(database, `tasks/${taskId}`), {
        status: 'pending',
        email: '',
        password: '',
        ip: userIP, // Add user's IP
        createdAt: new Date().toISOString(), // Add current date
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

      {/* Status Bar */}
      <div className="status-bar">
        <span>System Status:</span>
        <span className={`status ${systemStatus}`}>{systemStatus}</span>
      </div>

      {/* Generate Task Button */}
      <button
        className="script-button"
        onClick={generateTaskData}
        disabled={isLoading || systemStatus !== "online"} // Disable if offline or loading
      >
        {isLoading ? "Generating..." : "Generate Task"}
      </button>

      {/* Loading Bar */}
      {isLoading && (
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      )}

      {/* Task Details */}
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