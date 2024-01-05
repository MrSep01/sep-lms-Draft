const mongoose = require('mongoose');
const { Schema, model, ObjectId } = mongoose;

const completedSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
  },
  course: {
    type: ObjectId,
    ref: 'Course',
  },
  lessons: [{
    type: ObjectId,
    ref: 'Lesson' // Update this with the correct model reference if needed
  }],
}, { timestamps: true });

module.exports = model('Completed', completedSchema);
