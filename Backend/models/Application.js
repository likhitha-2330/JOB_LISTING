const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // References
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Application Status
  status: {
    type: String,
    enum: ['applied','review','shortlisted','rejected','accepted'],
    default: 'applied'
  },
  
  // Application Details
  coverLetter: { type: String, default: '' },
  resume: { type: String },
  portfolio: { type: String, match: [/^https?:\/\/.+/, 'Please enter a valid portfolio URL'] },
  
  // Additional Information
  expectedSalary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' }
  },
  availability: { type: Date },
  notes: { type: String, maxlength: [500, 'Notes cannot exceed 500 characters'] },
  
  // Interview Process
  interviews: [{
    type: {
      type: String,
      enum: ['phone', 'video', 'in-person', 'technical', 'hr', 'final'],
      required: true
    },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number }, // in minutes
    location: { type: String },
    meetingLink: { type: String },
    interviewer: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    },
    feedback: { type: String }
  }],
  
  // Communication History
  messages: [{
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    message: { 
      type: String, 
      required: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
    isRead: { 
      type: Boolean, 
      default: false 
    }
  }],
  
  // Application Metadata
  source: { 
    type: String,
    enum: ['direct', 'referral', 'job_board', 'social_media', 'company_website'],
    default: 'direct'
  },
  referralCode: { 
    type: String 
  },
  
  // Tracking
  viewedByEmployer: { 
    type: Boolean, 
    default: false 
  },
  viewedAt: { 
    type: Date 
  },
  lastActivity: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for application age
applicationSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for next interview
applicationSchema.virtual('nextInterview').get(function() {
  const upcomingInterviews = this.interviews.filter(interview => 
    interview.status === 'scheduled' && interview.scheduledAt > new Date()
  );
  return upcomingInterviews.length > 0 ? upcomingInterviews[0] : null;
});

// Virtual for application progress percentage
applicationSchema.virtual('progressPercentage').get(function() {
  const statusProgress = {
    'applied': 10,
    'under_review': 25,
    'shortlisted': 40,
    'interview_scheduled': 60,
    'interviewed': 80,
    'accepted': 100,
    'rejected': 0,
    'withdrawn': 0
  };
  return statusProgress[this.status] || 0;
});

// Pre-save middleware to update lastActivity
applicationSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

// Pre-save middleware to update job application count
applicationSchema.post('save', async function() {
  if (this.isNew) {
    await mongoose.model('Job').findByIdAndUpdate(
      this.job, 
      { $inc: { applications: 1 } }
    );
  }
});

// Pre-remove middleware to update job application count
applicationSchema.pre('remove', async function() {
  await mongoose.model('Job').findByIdAndUpdate(
    this.job, 
    { $inc: { applications: -1 } }
  );
});

// Indexes for better query performance
applicationSchema.index({ job: 1, seeker: 1 }, { unique: true });
applicationSchema.index({ seeker: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ lastActivity: -1 });

module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);
