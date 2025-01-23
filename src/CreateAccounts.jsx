import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import "./CreateAccounts.css";

function CreateAccounts() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [taskData, setTaskData] = useState({ email: "", password: "" });
  const [taskId, setTaskId] = useState(null);

  const generateTaskData = async () => {
    setIsLoading(true);
    setMessage("Waiting for email and password...");

    try {
      // Create a task in Firestore
      const taskRef = doc(db, "tasks", `task-${Date.now()}`);
      const taskId = taskRef.id;

      await setDoc(taskRef, {
        email: null,
        password: null,
        createdAt: Date.now(),
        status: "pending",
      });

      setTaskId(taskId);
      pollForAccountDetails(taskId);
    } catch (error) {
      console.error("Error generating task:", error);
      setMessage("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const pollForAccountDetails = (taskId) => {
    const taskRef = doc(db, "tasks", taskId);

    const unsubscribe = onSnapshot(taskRef, (doc) => {
      const data = doc.data();
      if (data?.email && data?.password) {
        setTaskData({ email: data.email, password: data.password });
        setMessage("Email and password received!");
        setIsLoading(false);
        unsubscribe(); // Stop listening for updates
      }
    });
  };

  const handleSubmit = async () => {
    if (!taskId) return;

    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { status: "completed" });
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
