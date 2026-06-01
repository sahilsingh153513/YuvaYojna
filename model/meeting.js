import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  // Meeting Details
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Participants
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  userId: {
    type: String, // Can be ObjectId if you have a User model
    required: true
  },
  studentName: {
    type: String,
    trim: true
  },
  studentEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  // Scheduling
  scheduledDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // Format: "HH:MM"
    required: true
  },
  endTime: {
    type: String, // Format: "HH:MM"
    required: true
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
    enum: [30, 60, 90, 120]
  },
  
  // Meeting Type
  meetingType: {
    type: String,
    required: true,
    enum: ['video', 'phone', 'in-person'],
    default: 'video'
  },
  
  // Meeting Link/Details
  meetingLink: {
    type: String,
    trim: true
  },
  meetingLocation: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rescheduled'],
    default: 'pending'
  },
  
  // Messages/Notes
  requestMessage: {
    type: String,
    trim: true
  },
  mentorNotes: {
    type: String,
    trim: true
  },
  userNotes: {
    type: String,
    trim: true
  },
  
  // Pricing
  hourlyRate: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
   
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Meeting Feedback
  mentorRating: {
    type: Number,
    min: 1,
    max: 5
  },
  userRating: {
    type: Number,
    min: 1,
    max: 5
  },
  mentorFeedback: {
    type: String,
    trim: true
  },
  userFeedback: {
    type: String,
    trim: true
  }
});

// Update the updatedAt field before saving
meetingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total cost before saving
meetingSchema.pre('save', function(next) {
  if (this.duration && this.hourlyRate) {
    this.totalCost = (this.duration / 60) * this.hourlyRate;
  }
  next();
});

// Virtual for formatted date
meetingSchema.virtual('formattedDate').get(function() {
  return this.scheduledDate.toLocaleDateString();
});

// Virtual for formatted time range
meetingSchema.virtual('formattedTimeRange').get(function() {
  return `${this.startTime} - ${this.endTime}`;
});

// Index for efficient queries
meetingSchema.index({ mentorId: 1, scheduledDate: 1 });
meetingSchema.index({ userId: 1, scheduledDate: 1 });
meetingSchema.index({ status: 1 });

const Meeting = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);

export default Meeting;
