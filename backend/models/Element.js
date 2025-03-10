import mongoose from 'mongoose';

const elementSchema = new mongoose.Schema({
  tool: String,
  points: [Number],
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  strokeWidth: Number,
  stroke: String,
  fill: String,
  text: String,
  fontSize: Number,
});

const Element = mongoose.model('Element', elementSchema);

export default Element;