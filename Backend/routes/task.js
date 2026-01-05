import { createTask, deleteTask, getTasks, toggleTaskComplete } from "../controllers/task.js";
import express from "express";

export const taskRouter = express.Router();
// create task
taskRouter.post('/:uid', createTask)
// get task
taskRouter.get('/:uid', getTasks)
// delete task
taskRouter.delete('/:uid/:id', deleteTask);
// toggle complete task
taskRouter.put('/:uid/:id/toggle', toggleTaskComplete)