const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Please add a task title'], trim: true, maxlength: [100, 'Title cannot exceed 100 chars'] },
  description: { type: String, required: [true, 'Please add a description'] },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  assignedUser: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Task', TaskSchema);
