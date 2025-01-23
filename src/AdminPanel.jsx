import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import './AdminPanel.css';
import { initializeApp } from "firebase/app";

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

const AdminPanel = () => {
  const [systemStatus, setSystemStatus] = useState("online");
  const [requests, setRequests] = useState([]);

  const database = getDatabase(app);

  // Fetch system status and requests
  useEffect(() => {
    const tasksRef = ref(database, "tasks");

    // Listen for tasks changes
    onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val();
      console.log("Fetched tasks data:", tasksData);

      if (tasksData) {
        const tasksList = Object.keys(tasksData).map((taskId) => ({
          id: taskId,
          ...tasksData[taskId],
        }));
        console.log("Processed tasks list:", tasksList);
        setRequests(tasksList);
      } else {
        console.log("No tasks found.");
        setRequests([]);
      }
    }, (error) => {
      console.error("Error fetching tasks:", error);
    });
  }, [database]);

  // Toggle system status
  const toggleSystemStatus = async () => {
    const newStatus = systemStatus === "online" ? "offline" : "online";
    await update(ref(database, "systemStatus"), { value: newStatus });
    setSystemStatus(newStatus);
  };

  // Update request status
  const updateRequestStatus = async (requestId, newStatus) => {
    await update(ref(database, `tasks/${requestId}`), { status: newStatus });
  };

  // Add email and password to a request
  const addCredentialsToRequest = async (requestId, email, password) => {
    await update(ref(database, `tasks/${requestId}`), { email, password, status: "ready" });
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      {/* Toggle System Status */}
      <div className="system-status">
        <h2>System Status: {systemStatus}</h2>
        <button onClick={toggleSystemStatus}>
          Turn {systemStatus === "online" ? "Offline" : "Online"}
        </button>
      </div>

      {/* Tasks Table */}
      <h2>Tasks</h2>
      <table>
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Status</th>
            <th>Email</th>
            <th>Password</th>
            <th>IP</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.status}</td>
              <td>{task.email}</td>
              <td>{task.password}</td>
              <td>{task.ip}</td>
              <td>{new Date(task.createdAt).toLocaleString()}</td>
              <td>
                {/* Update Status Dropdown */}
                <select
                  value={task.status}
                  onChange={(e) => updateRequestStatus(task.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                </select>

                {/* Add Email and Password */}
                <input
                  type="text"
                  placeholder="Email"
                  onBlur={(e) =>
                    addCredentialsToRequest(task.id, e.target.value, task.password)
                  }
                />
                <input
                  type="text"
                  placeholder="Password"
                  onBlur={(e) =>
                    addCredentialsToRequest(task.id, task.email, e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;