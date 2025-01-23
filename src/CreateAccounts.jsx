import React, { useState, useEffect } from "react";
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
      // Call the Netlify function to create a task
      const response = await fetch("/.netlify/functions/create-task", {
        method: "POST",
      });

      const result = await response.json();
      if (result.success) {
        setTaskId(result.taskId);
        pollForAccountDetails(result.taskId); // Start polling for email and password
      } else {
        setMessage("Failed to generate task. Please try again.");
      }
    } catch (error) {
      console.error("Error generating task:", error);
      setMessage("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const pollForAccountDetails = (taskId) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/.netlify/functions/get-task?taskId=${taskId}`
        );
        const result = await response.json();

        if (result.success && result.email && result.password) {
          clearInterval(interval); // Stop polling
          setIsLoading(false);
          setTaskData({ email: result.email, password: result.password });
          setMessage("Email and password received!");
        }
      } catch (error) {
        console.error("Error polling for account details:", error);
        clearInterval(interval); // Stop polling on error
        setIsLoading(false);
        setMessage("An error occurred while fetching account details.");
      }
    }, 5000); // Poll every 5 seconds
  };

  const handleSubmit = async () => {
    if (!taskId) return;

    try {
      const response = await fetch("/.netlify/functions/confirm-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, ...taskData }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage("Task submitted successfully!");
      } else {
        setMessage(result.message || "Failed to submit task. Please try again.");
      }
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
