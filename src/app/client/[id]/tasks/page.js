"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt } from "react-icons/fa";

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

export default function Tasks({ clientId }) {
  const [selectedTask, setSelectedTask] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [priority, setPriority] = useState("High");
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  const handleAddTask = () => {
    if (!selectedTask || !taskDate) {
      alert("Please select a task and a due date.");
      return;
    }

    const newTask = {
      id: Date.now(),
      task: selectedTask,
      date: taskDate,
      priority,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setSelectedTask(""); // Reset dropdown
    setTaskDate(""); // Reset date input
    setPriority("High"); // Reset priority
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-[#010326] mb-4">Client Tasks</h2>

      {/* Task Selection Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Select Task:</label>
        <select
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg p-3 h-12"
        >
          <option value="">Choose a task</option>
          {taskOptions.map((task, index) => (
            <option key={index} value={task}>
              {task}
            </option>
          ))}
        </select>
      </div>

      {/* Task Date */}
      <div className="mb-4 flex flex-col">
        <label className="block text-gray-700 font-semibold">Due Date:</label>
        <div className="relative">
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg p-3 h-12"
          />
          <FaCalendarAlt className="absolute right-3 top-4 text-gray-500" />
        </div>
      </div>

      {/* Task Priority */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Priority:</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg p-3 h-12"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Add Task Button */}
      <button
        onClick={handleAddTask}
        className="w-full bg-[#07B0F2] text-white py-3 px-4 rounded-lg hover:bg-[#005f99] transition-all"
      >
        Add Task
      </button>

      {/* Task List */}
      <div className="mt-6">
        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-[#010326]">{task.task}</p>
                  <p className="text-gray-600 text-sm">
                    Due: {task.date} | Priority:{" "}
                    <span className="font-semibold text-[#F25922]">{task.priority}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                >
                  Delete
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
