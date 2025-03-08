
import mongoose from 'mongoose';

const whiteboardSchema = new mongoose.Schema({
  name: String,
  elements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Element' }]
});

const Whiteboard = mongoose.model('Whiteboard', whiteboardSchema);

export default Whiteboard;