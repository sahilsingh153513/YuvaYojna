import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const mentorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  company: {
    type: String,
    // required: [true, 'Company is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  position: {
    type: String,
    // required: [true, 'Position is required'],
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  experience: {
    type: String,
    // required: [true, 'Experience is required'],
    enum: [
      '0-2 years',
      '1-3 years',
      '3-5 years',
      '5-10 years',
      '6-10 years',
      '10+ years',
      '11-15 years',
      '16-20 years',
      '20+ years'
    ]
  },
  expertise: [{
    type: String,
    // required: true,
    trim: true
  }],
  location: {
    type: String,
    // required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  bio: {
    type: String,
    // required: [true, 'Bio is required'],
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  linkedin: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(v);
      },
      message: 'Please enter a valid LinkedIn URL'
    }
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid website URL'
    }
  },
  availability: {
    type: String,
    required: [true, 'Availability is required'],
    enum: ['Mornings', 'Afternoons', 'Evenings', 'Weekends', 'Flexible', 'part-time', 'full-time', 'project-based', 'on-demand']
  },
  languages: [{
    type: String,
    required: true,
    trim: true
  }],
  hourlyRate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: [0, 'Hourly rate cannot be negative']
  },
  timezone: {
    type: String,
    required: [true, 'Timezone is required'],
    trim: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalSessions: {
    type: Number,
    default: 0,
    min: 0
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
mentorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
mentorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
mentorSchema.methods.toJSON = function() {
  const mentor = this.toObject();
  delete mentor.password;
  return mentor;
};

if (process.env.NODE_ENV !== 'production' && mongoose.models.Mentor) {
  delete mongoose.models.Mentor;
}

const Mentor = mongoose.models.Mentor || mongoose.model('Mentor', mentorSchema);

export default Mentor;
