import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/taskModal.js";

// Create task
export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, status, priority } = req.body;

    if (!title || title.trim() === "") {
      res.status(400).json({ message: "Title is required" });
    }

    if (!description || description.trim() === "") {
      res.status(400).json({ message: "Description is Empty" });
    }

    const task = new TaskModel({
      title,
      description,
      dueDate,
      status,
      priority,
      user: req.user._id,
    });

    await task.save();

    res.status(201).json({ task });
  } catch {
    console.log({ message: err.message });
    res.status(400).json({ message: "Task not created" });
  }
});

//Get all tasks
export const getTasks = asyncHandler(async (req, res) => {
  console.log("Get Tasks");
  try {
    const useId = req.user._id;

    if (!useId) {
      res.status(400).json({ message: "User not found" });
    }

    const tasks = await TaskModel.find({ user: useId });

    if (!tasks) {
      res.status(400).json({ message: "Tasks not found" });
    }
    res.status(200).json({ length: tasks.length, tasks: tasks });
  } catch (err) {
    console.log({ message: err.message });
    res.status(400).json({ message: err.message });
  }
});

//Get a single task

export const getTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const task = await TaskModel.findById(id);

    if (!task) {
      res.status(400).json({ message: "Task not found" });
    }

    if (!task.user.equals(userId)) {
      res
        .status(400)
        .json({ message: "You are not authorized to view this task" });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.log({ message: error.message });
    res.status(400).json({ message: error.message });
  }
});

//Update task
export const updateTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Please provide a Task Id to update the task" });
    }

    const task = await TaskModel.findById(id);

    if(!task) {
      res.status(400).json({ message: "Task not found" });
    }
    //Check if the user is authorized to update the task
    if (!task.user.equals(userId)) {
      res
        .status(400)
        .json({ message: "You are not authorized to view this task" });
    }

    const { title, description, dueDate, status, priority, completed } = req.body;

    //update the task with new details if provided
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.completed = completed || task.completed;

    await task.save();

    res.status(200).json({ task });

  } catch (err) {
    console.log({ message: err.message });
    res.status(400).json({ message: "Task not updated" });
  }
});

//Delete task
export const deleteTask = asyncHandler(async (req, res) => { 

  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Please provide a Task Id to delete the task" });
    }

    const task = await TaskModel.findById(id);

    if(!task) {
      res.status(400).json({ message: "Task not found" });
    }

    //Check if the user is authorized to delete the task
    if (!task.user.equals(userId)) {
      res.status(400).json({ message: "You are not authorized to delete this task" });
    }

    await TaskModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Task deleted successfully" });

  } catch (err) {
    console.log({ message: err.message });
    res.status(400).json({ message: "Task not deleted" });
  }

});