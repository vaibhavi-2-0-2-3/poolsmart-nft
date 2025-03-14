
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RideSchema = new Schema({
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  departure: {
    location: {
      type: String,
      required: true
    },
    time: {
      type: Date,
      required: true
    }
  },
  destination: {
    location: {
      type: String,
      required: true
    },
    estimatedTime: {
      type: Date
    }
  },
  price: {
    type: Number,
    required: true
  },
  seatsTotal: {
    type: Number,
    required: true
  },
  seatsAvailable: {
    type: Number,
    required: true
  },
  passengers: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    seats: {
      type: Number,
      default: 1
    }
  }],
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ride', RideSchema);
