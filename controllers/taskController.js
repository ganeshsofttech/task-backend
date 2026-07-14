const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? Task.find() : Task.find({ assignedUser: req.user.id });
    const tasks = await query.populate('assignedUser', 'name email');
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.createTask = async (req, res) => {
  try {
    if (req.user.role !== 'admin' || !req.body.assignedUser) req.body.assignedUser = req.user.id;
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Not found' });
    if (task.assignedUser.toString() !== req.user.id && req.user.role !== 'admin') return res.status(401).json({ success: false, error: 'Not authorized' });
    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: task });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Not found' });
    if (task.assignedUser.toString() !== req.user.id && req.user.role !== 'admin') return res.status(401).json({ success: false, error: 'Not authorized' });
    await task.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};
