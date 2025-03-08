import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { setupWhiteboardServer } from './whiteboard.js';
import Whiteboard from './models/Whiteboard.js'; // Import Whiteboard Model

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// Set up Socket.IO for whiteboard collaboration
setupWhiteboardServer(server);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Create a new whiteboard
app.post('/api/whiteboards', async (req, res) => {
  try {
    const { name, elements } = req.body;
    const newWhiteboard = new Whiteboard({ name, elements });
    await newWhiteboard.save();
    res.status(201).json(newWhiteboard);
  } catch (error) {
    res.status(500).json({ message: 'Error creating whiteboard', error });
  }
});

// Get all whiteboards
app.get('/api/whiteboards', async (req, res) => {
  try {
    const whiteboards = await Whiteboard.find();
    res.json(whiteboards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching whiteboards', error });
  }
});

// Get a specific whiteboard
app.get('/api/whiteboards/:id', async (req, res) => {
  try {
    const whiteboard = await Whiteboard.findById(req.params.id);
    if (!whiteboard) {
      return res.status(404).json({ message: 'Whiteboard not found' });
    }
    res.json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching whiteboard', error });
  }
});

// Update a whiteboard
app.put('/api/whiteboards/:id', async (req, res) => {
  try {
    const { name, elements } = req.body;
    const updatedWhiteboard = await Whiteboard.findByIdAndUpdate(
      req.params.id,
      { name, elements },
      { new: true }
    );
    res.json(updatedWhiteboard);
  } catch (error) {
    res.status(500).json({ message: 'Error updating whiteboard', error });
  }
});

// Delete a whiteboard
app.delete('/api/whiteboards/:id', async (req, res) => {
  try {
    await Whiteboard.findByIdAndDelete(req.params.id);
    res.json({ message: 'Whiteboard deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting whiteboard', error });
  }
});

// Serve static files if needed (for deployment)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
