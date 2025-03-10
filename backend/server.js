import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { setupWhiteboardServer } from './whiteboard.js';
import Whiteboard from './models/Whiteboard.js'; 
import { clerkClient } from '@clerk/clerk-sdk-node';
import Element from './models/Element.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true
  }
));
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
    const {boardId, name, elements } = req.body;
    const newWhiteboard = new Whiteboard({ boardId,name, elements });
    await newWhiteboard.save();
    console.log('Whiteboard created:', newWhiteboard);
    res.status(201).json(newWhiteboard);
  } catch (error) {
    res.status(500).json({ message: 'Error creating whiteboard', error });
  }
});
app.post('/api/save-board', async (req, res) => {
  try {
    const { boardId, name, elements } = req.body;

    // Validate required fields
    if (!boardId) {
      return res.status(400).json({ success: false, message: "Board ID is required." });
    }

    // Validate elements (ensure it's an array)
    if (!Array.isArray(elements)) {
      return res.status(400).json({ success: false, message: "Elements must be an array." });
    }

    // Save each element to the Element collection
    const savedElements = await Element.insertMany(elements);

    // Find the existing board by ID
    let board = await Whiteboard.findOne({ boardId });

    if (board) {
      // Update existing board
      board.elements = savedElements.map(el => el._id); // Store ObjectIds
      board.name = name; // Update the name if needed
      await board.save();
      return res.json({ success: true, message: "Board updated successfully." });
    } else {
      // Create a new board if it doesn't exist
      board = new Whiteboard({ boardId, name, elements: savedElements.map(el => el._id) });
      await board.save();
      return res.json({ success: true, message: "New board created and saved." });
    }
  } catch (error) {
    console.error("Error saving board:", error);
    res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
});
// Get all whiteboards
app.get('/api/whiteboards', async (req, res) => {
  try {
    const userFullName = req.headers["user"];
    const whiteboards = await Whiteboard.find({ name: userFullName });
    res.status(201).json(whiteboards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching whiteboards', error });
  }
});

// Get a specific whiteboard
app.get('/api/whiteboards/:id', async (req, res) => {
  try {
    const whiteboard = await Whiteboard.find({boardId: req.params.id});
    console.log(whiteboard);
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
    const {boardId, name, elements } = req.body;
    const updatedWhiteboard = await Whiteboard.findAndUpdate(
      
      {boardId, name, elements },
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
