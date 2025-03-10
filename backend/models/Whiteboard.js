import mongoose from 'mongoose';

const whiteboardSchema = new mongoose.Schema({
  boardId: { type: String, required: true, unique: true },
  name: String,
  elements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Element' }],
});

const Whiteboard = mongoose.model('Whiteboard', whiteboardSchema);

export default Whiteboard;