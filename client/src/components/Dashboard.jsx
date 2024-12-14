import React from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ArrowDownAZ } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Pencil } from "lucide-react";
import { useEffect } from "react";
import { taskFail, taskRequest, taskSuccess } from "@/Reducers/task";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EditTaskModal from "./EditTaskModal";
import { useState } from "react";
import AddTask from "./AddTask";

const getTasks = async (dispatch, keyword = "", timeSort, status) => {
  try {
    dispatch(taskRequest());

    let queryParams = [];

    if (keyword) queryParams.push(`keyword=${encodeURIComponent(keyword)}`);

    if (status) queryParams.push(`status=${encodeURIComponent(status)}`);

    if (timeSort) queryParams.push(`sort=${encodeURIComponent(timeSort)}`);

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    const link = `/api/tasks${queryString}`;
    console.log(link);
    const { data } = await axios.get(link);

    dispatch(taskSuccess(data));
  } catch (error) {
    dispatch(taskFail(error.response.data.message));
  }
};

const Dashboard = () => {
  const [timeSort, setTimeSort] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [loading, setloading] = React.useState(false);
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isAddTask, setIsAddTask] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();

  const handleEditClick = (taskId) => {
    setEditingTaskId(taskId);
  };

  const handleCloseModal = () => {
    setEditingTaskId(null);
  };

  const handleAddClick = (taskId) => {
    setIsAddTask(true);
  };

  const handleClose = () => {
    setIsAddTask(false);
  };

  const { tasks } = useSelector((state) => state.task);

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
      return;
    }
    setloading(true);
    // if (error) toast.error(error);
    getTasks(dispatch, keyword, timeSort, status);
    setloading(false);
  }, [dispatch, keyword, timeSort, status]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can modify this format as needed
  };

  const handleCheckboxChange = (taskId) => {
    setSelectedTaskIds(
      (prev) =>
        prev.includes(taskId)
          ? prev.filter((id) => id !== taskId) // Remove if already selected
          : [...prev, taskId] // Add if not selected
    );
  };

  // console.log(selectedTaskIds)

  const handleDeleteSelected = async () => {
    if (selectedTaskIds.length === 0) {
      alert("Please select tasks to delete!");
      return;
    }

    try {
      await axios.delete("/api/tasks/deleteTask", {
        data: { taskIds: selectedTaskIds },
      });
      alert("Tasks deleted successfully!");
      setSelectedTaskIds([]);
    } catch (error) {
      console.error("Error deleting tasks:", error);
      alert("Failed to delete tasks.");
    }
  };

  const handleAllCheckbox = async () => {
    if (selectedTaskIds.length !== tasks.length)
      setSelectedTaskIds(tasks.map((task) => task._id));
    else setSelectedTaskIds([]);
  };
  return (
    <div className="shadow-md p-10 flex flex-col">
      <h1 className="font-bold text-2xl pb-2">Task list</h1>
      <div className="flex max-sm:flex-col max-sm:gap-5 items-center justify-between my-2">
        <div className="items-center justify-center">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleAddClick}
              className="flex items-center justify-center gap-1 border text-indigo-700 border-indigo-700 p-1.5 rounded-sm"
            >
              <div className="">
                <Plus size={18} />{" "}
              </div>
              <p className="font-bold pr-1">Add task</p>
            </button>
            {isAddTask && <AddTask onClose={handleClose} />}
            <button
              onClick={handleDeleteSelected}
              className="flex items-center justify-center gap-1 border text-red-700 border-red-700 p-1.5 rounded-sm"
            >
              <div className="">
                <Trash2 size={18} />{" "}
              </div>
              <p className="font-bold pr-1">Delete selected</p>
            </button>
          </div>
        </div>
        <div className="flex max-sm:gap-0 items-center justify-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full max-sm:px-1 p-2 bg-slate-400">
                <div className="">
                  <ArrowDownAZ size={18} />{" "}
                </div>
                <p className="font-bold pr-1">Sort</p>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort With Time</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={timeSort}
                onValueChange={setTimeSort}
              >
                <DropdownMenuRadioItem value="startDate_asc">
                  Start time: ASC
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="startDate_desc">
                  Start time: DESC
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="endDate_asc">
                  End time: ASC
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="endDate_desc">
                  End time: DESC
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  onClick={() => setTimeSort("")}
                  className="text-red-600 border-t-2 rounded-none font-semibold border-slate-200"
                >
                  Remove Sort
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="p-2 max-sm:px-1 rounded-full border border-slate-500"
              >
                <p className="font-bold text-slate-500">Priority</p>
                <div className="">
                  <ChevronDown size={18} color="gray" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
              <DropdownMenuRadioGroup
                value={timeSort}
                onValueChange={setTimeSort}
              >
                <DropdownMenuRadioItem value="priority_asc">
                  1
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="2">2</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="3">3</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="4">4</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="priority_desc">
                  5
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  onClick={() => setTimeSort("")}
                  className="text-red-600 border-t-2 rounded-none font-semibold border-slate-200"
                >
                  Remove Filter
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="p-2 rounded-full max-sm:px-1 border border-indigo-700"
              >
                <p className="font-bold text-indigo-700">Status: Finished</p>
                <div className="">
                  <ChevronDown size={18} color="gray" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
              <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
                <DropdownMenuRadioItem value="pending">
                  Pending
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="finished">
                  Finished
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  onClick={() => setStatus("")}
                  className="text-red-600 border-t-2 rounded-none font-semibold border-slate-200"
                >
                  Remove Filter
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-300">
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-300 text-gray-700">
              <th className="p-2 border border-gray-300">
                <input type="checkbox" onChange={handleAllCheckbox} />
              </th>
              <th className="p-2 border border-gray-300 text-left">Task ID</th>
              <th className="p-2 border border-gray-300 text-left">Title</th>
              <th className="p-2 border border-gray-300 text-center">
                Priority
              </th>
              <th className="p-2 border border-gray-300 text-center">Status</th>
              <th className="p-2 border border-gray-300 text-left">
                Start Time
              </th>
              <th className="p-2 border border-gray-300 text-left">End Time</th>
              <th className="p-2 border border-gray-300 text-center">
                Total time to finish (hrs)
              </th>
              <th className="p-2 border border-gray-300 text-center">Edit</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <tr
                  key={task._id}
                  className="hover:bg-slate-200 text-gray-600 even:bg-gray-100"
                >
                  <td className="p-2 border border-gray-300 text-center">
                    <input
                      type="checkbox"
                      checked={selectedTaskIds.includes(task._id)}
                      onChange={() => handleCheckboxChange(task._id)}
                    />
                  </td>
                  <td className="p-2 border border-gray-300">{task._id}</td>
                  <td className="p-2 border border-gray-300">{task.title}</td>
                  <td className="p-2 border border-gray-300 text-center">
                    {task.priority}
                  </td>
                  <td className="p-2 border border-gray-300 text-center">
                    {task.status}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {formatDate(task.startTime)}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {formatDate(task.endTime)}
                  </td>
                  <td className="p-2 border border-gray-300 text-center">
                    {task.totalTimeToFinish}
                  </td>
                  <td className="p-2 border border-gray-300 text-center">
                    <Pencil
                      className="text-blue-600 cursor-pointer"
                      size={18}
                      onClick={() => handleEditClick(task._id)}
                    />
                  </td>
                  {editingTaskId === task._id && (
                    <EditTaskModal task={task} onClose={handleCloseModal} />
                  )}{" "}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
