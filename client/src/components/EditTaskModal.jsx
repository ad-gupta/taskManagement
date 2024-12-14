import axios from "axios";
import React, { useState } from "react";

const EditTaskModal = ({ task, onClose }) => {
  const [title, setTitle] = useState(task.title || "");
  const [priority, setPriority] = useState(task.priority || 1);
  const [status, setStatus] = useState(task.status || "Pending");
  const [startTime, setStartTime] = useState(task.startTime || "");
  const [endTime, setEndTime] = useState(task.endTime || "");
  const [totalTimeToFinish, setTotalTimeToFinish] = useState(task.totalTimeToFinish || 0);

  const onUpdate = async () => {
    try {
      const { data } = await axios.put(`/api/tasks/updateTask/${task._id}`, {
        title,
        priority,
        status,
        startTime,
        endTime,
        totalTimeToFinish,
      });
      console.log("Task updated successfully", data);
      onClose(null);
    } catch (error) {
      console.error("Failed to update task", error);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };
  
  console.log(task)

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit task</h2>
        <p className="text-sm text-gray-500 mb-4 font-semibold">Task ID: {task._id}</p>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full border-gray-300 border-2 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter task title"
            />
          </div>

          {/* Priority and Status */}
          <div className="flex justify-between">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 border-2 border-gray-300 rounded-md p-2 w-36 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="flex items-center mt-1 space-x-2">
                <span
                  className={`cursor-pointer ${
                    status === "Pending"
                      ? "text-blue-500 font-semibold"
                      : "text-gray-500"
                  }`}
                  onClick={() => setStatus("Pending")}
                >
                  Pending
                </span>
                <div
                  className={`w-10 h-6 rounded-full flex items-center cursor-pointer ${
                    status === "Finished" ? "bg-green-500" : "bg-gray-400"
                  }`}
                  onClick={() =>
                    setStatus(status === "Pending" ? "Finished" : "Pending")
                  }
                >
                  <div
                    className={`h-4 w-4 bg-white rounded-full shadow-md transform duration-300 ${
                      status === "Finished" ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </div>
                <span
                  className={`cursor-pointer ${
                    status === "Finished"
                      ? "text-green-500 font-semibold"
                      : "text-gray-400"
                  }`}
                  onClick={() => setStatus("Finished")}
                >
                  Finished
                </span>
              </div>
            </div>
          </div>

          {/* Start Time and End Time */}
          <div className="flex items-center gap-1">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start time
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-44 border-2 border-gray-400 rounded-full p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End time
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 border-2 border-gray-400 rounded-full w-44 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={()=> onClose(null)}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
