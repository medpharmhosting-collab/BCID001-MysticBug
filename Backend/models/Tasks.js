import mongoose from "mongoose"

export const taskSchema = new mongoose.Schema({
  uid: {
    type: String
  },
  task: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['not_urgent', 'urgent'],
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
})
export const Task = mongoose.model("Task", taskSchema)