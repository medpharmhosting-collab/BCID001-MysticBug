import { Task } from "../models/Tasks.js"
export const createTask = async (req, res) => {
  try {
    const { uid } = req.params;
    const { task, description, urgency } = req.body;
    if (!task || !description || !urgency) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newTask = new Task({ uid, task, description, urgency });
    await newTask.save();
    res.status(201).json({ message: "task created successfully" });
  } catch (error) {
    console.log("error while creating task:", error);
    res.status(500).json({ message: "server error" });
  }
}

export const getTasks = async (req, res) => {
  try {
    const { uid } = req.params;
    const tasks = await Task.find({ uid });
    res.status(200).json({ tasks })
  } catch (error) {
    console.log("error while fetching tasks:", error);
    res.status(500).json({ message: "server error" });
  }
}

export const deleteTask = async (req, res) => {
  try {
    const { id, uid } = req.params;
    await Task.findOneAndDelete({ _id: id, uid });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log("error deleting task:", error);
    res.status(500).json({ message: "server error" });
  }
}
export const toggleTaskComplete = async (req, res) => {
  try {
    const { id } = req.params
    const task = await Task.findOne({ _id: id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.completed = !task.completed;
    await task.save();

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}