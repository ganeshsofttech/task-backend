const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
