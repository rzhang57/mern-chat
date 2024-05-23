const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Message text is required'], // Marking the field as required
    validate: {
      validator: function(value) {
        // Custom validator function to check if the text field is not empty
        return value.trim().length > 0; // Check if the trimmed value has a length greater than 0
      },
      message: 'Message text cannot be empty' // Custom error message for validation failure
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);
