import React, { useEffect, useState } from "react";
import { icons } from "../../assets/assets"
import { useAuth } from "../../Context/AuthContext"
import { BASE_URL } from "../../config/config.js"

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const { uid } = useAuth()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${BASE_URL}/tasks/${uid}`);
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error("Error while fetching tasks:", error.message);
      }
    };

    fetchTasks();
  }, [uid]);

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${uid}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const openTask = (index) => {
    setExpandedTask((prev) => (prev === index ? null : index));
  };

  const toggleComplete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${uid}/${id}/toggle`, {
        method: "PUT"
      });

      if (!response.ok) throw new Error("Failed to update");

      const data = await response.json();

      setTasks(prev =>
        prev.map(t =>
          t._id === id ? { ...t, completed: data.task.completed } : t
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#f3e8d1] min-h-screen p-6 font-lato">
      <h1 className="text-3xl font-bold mb-6">Tasks & Workflow</h1>

      {tasks.length === 0 ? (
        <p className="text-gray-600 italic">No tasks found.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task, index) => (
            <li
              key={task._id}
              className="bg-[#fcc433] p-4 rounded-md shadow-sm flex justify-between items-center transition hover:shadow-md"
            >
              <div>
                <p className="font-semibold capitalize text-lg">{task.task}</p>
                <p className="text-sm text-gray-700">{task.urgency}</p>

                {expandedTask === index && (
                  <p className="mt-2 text-gray-800 transition-all duration-300">
                    {task.description || "No description provided."}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {/* Tick Button */}
                <button
                  onClick={() => toggleComplete(task._id)}
                  className="p-2 rounded-full hover:bg-green-100 transition"
                >
                  {task.completed ? (
                    <span className="text-green-700 text-xl">✔</span>
                  ) : (
                    <span className="text-gray-600 text-xl">☐</span>
                  )}
                </button>

                {/* Expand Button */}
                <button
                  onClick={() => openTask(index)}
                  className="p-2 rounded-full hover:bg-black/10 transition"
                  aria-label="Toggle task details"
                >
                  {expandedTask === index ? (
                    <span className="text-xl">⬇</span>
                  ) : (
                    <span className="text-xl">➜</span>
                  )}
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTask(task._id)}
                  className="p-2 rounded-full hover:bg-red-100 transition"
                >
                  <icons.MdDelete size={22} className="text-red-600" />
                </button>
              </div>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Tasks;
