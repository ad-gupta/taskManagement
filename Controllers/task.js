import catchAsyncError from "../Middleware/catchAsyncError.js";
import Task from "../Models/task.js";
import ApiFeatures from "../utils/apiFeatures.js";
import ErrorHandler from "../utils/errorHandler.js";

export const addTask = catchAsyncError(async (req, res) => {
  const userId = req.user._id;

  const newTask = await Task.create({
    title: req.body.title,
    userId,
    priority: req.body.priority,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    status: req.body.status,
  });

  newTask.save();

  res.status(201).json({
    succuss: true,
    message: newTask,
  });
});

export const getAllMyTasks = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const apiFeature = new ApiFeatures(Task.find({userId}), req.query)
    .search()
    .filter()
    .sort();

  let tasks = await apiFeature.query;

  res.status(200).json({
    success: true,
    tasks,
  });
});

export const updateTask = catchAsyncError(async (req, res, next) => {
  let task = await Task.findById(req.params.id);
  const id1 = task.userId;
  const id2 = req.user._id;
  if (!task) return next(new ErrorHandler("task not found", 400));

  if (!id1.equals(id2))
    next(new ErrorHandler("You cannot edit others task", 400));
  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    task,
  });
});

export const deleteMytasks = catchAsyncError(async (req, res, next) => {
  const { taskIds } = req.body;

  if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
    return next(new ErrorHandler("No tasks provided to delete", 400));
  }

  const tasks = await Task.find({ _id: { $in: taskIds } });

  if (!tasks || tasks.length === 0) {
    return next(new ErrorHandler("No tasks found with the provided IDs", 404));
  }

  // Check if all tasks belong to the authenticated user
  const unauthorizedTasks = tasks.filter(
    (task) => !task.userId.equals(req.user._id)
  );

  if (unauthorizedTasks.length > 0) {
    return next(new ErrorHandler("You cannot delete tasks that are not yours", 403));
  }

  // Delete all authorized tasks
  await Task.deleteMany({ _id: { $in: taskIds } });

  res.status(200).json({
    success: true,
    message: `${tasks.length} task(s) deleted successfully`,
  });
});

