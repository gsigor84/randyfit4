"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaTrash } from "react-icons/fa";
import { useClient } from "../ClientContext"; // Ensure correct path

const taskOptions = [
  "Prepare new training programs",
  "Update pricing & packages",
  "Follow up with existing clients",
  "Review client progress",
  "Create a meal plan for a client",
  "Adjust macros for a client’s meal plan",
  "Send motivational messages to clients",
  "Suggest supplements for a client’s goal",
  "Schedule client check-ins for next week",
  "Create a fat-loss-focused HIIT routine",
];

export default function Tasks() {
  const client = useClient();
  const router = useRouter();

  const [selectedTask, setSelectedTask] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [priority, setPriority] = useState("High");
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from API when component loads
  useEffect(() => {
    if (client) {
      fetch(`/api/tasks?id=${client._id}`)
        .then((res) => res.json())
        .then((data) => setTasks(data))
        .catch((err) => console.error("Error fetching tasks:", err));
    }
  }, [client]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleAddTask = async () => {
    if (!selectedTask || !taskDate) {
      alert("Please select a task and a due date.");
      return;
    }

    const newTask = { task: selectedTask, date: taskDate, priority };

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: client._id, ...newTask }),
      });

      if (!response.ok) throw new Error("Failed to add task");

      setTasks((prevTasks) => [...prevTasks, newTask]); // Update UI
      setSelectedTask("");
      setTaskDate("");
      setPriority("High");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (taskToDelete) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: client._id, task: taskToDelete }),
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prevTasks) => prevTasks.filter((task) => task.task !== taskToDelete));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-[#010326] mb-4">Client Tasks</h2>

      {/* Task Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Task Dropdown */}
        <select
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="">Choose a task</option>
          {taskOptions.map((task, index) => (
            <option key={index} value={task}>
              {task}
            </option>
          ))}
        </select>

        {/* Task Date */}
        <div className="relative">
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <FaCalendarAlt className="absolute right-3 top-4 text-gray-500" />
        </div>

        {/* Task Priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Add Task Button */}
      <button
        onClick={handleAddTask}
        className="w-full bg-[#07B0F2] text-white py-3 rounded-lg hover:bg-[#005f99] transition-all"
      >
        Add Task
      </button>

      {/* Task List */}
      <div className="mt-6">
        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map((task, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <div>
                  <p className="font-semibold text-[#010326]">{task.task}</p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold text-[#07B0F2]">{formatDate(task.date)}</span> |
                    Priority:{" "}
                    <span
                      className={`font-semibold ${task.priority === "High"
                          ? "text-red-500"
                          : task.priority === "Medium"
                            ? "text-orange-500"
                            : "text-green-500"
                        }`}
                    >
                      {task.priority}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.task)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center mt-4">No tasks yet. Add some above!</p>
        )}
      </div>
    </div>
  );
}
