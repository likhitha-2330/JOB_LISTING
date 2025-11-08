const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Basic Job Information
  title: { 
    type: String, 
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Job description is required'],
    maxlength: [2000, 'Job description cannot exceed 2000 characters']
  },
  
  // Job Details
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: [true, 'Company name is required'] 
  },
  employer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Employer is required'] 
  },
  location: {
    city: { type: String, default: '' },
    state: { type: String, default: '' }, // made optional / default empty
    region: { type: String, default: '' }
  },
  
  // Compensation & Benefits
  salary: { type: Number },
  benefits: [{
    type: String,
    trim: true
  }],
  
  // Job Requirements
  type: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'], 
    required: [true, 'Job type is required'],
    default: 'Full-time'
  },
  experience: {
    min: { type: Number, default: 0 },
    max: { type: Number },
    level: { 
      type: String, 
      enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'],
      default: 'Mid'
    }
  },
  skills: [{
    name: { type: String, required: true, trim: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' }
  }],
  qualifications: [{
    type: String,
    trim: true
  }],
  responsibilities: [{
    type: String,
    trim: true
  }],
  
  // Application Details
  applicationDeadline: { 
    type: Date 
  },
  applicationProcess: {
    type: String,
    enum: ['Direct', 'External Link', 'Email'],
    default: 'Direct'
  },
  externalUrl: { 
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  
  // Job Status & Metadata
  status: { 
    type: String, 
    enum: ['draft', 'active', 'paused', 'closed', 'filled'], 
    default: 'draft' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  category: { 
    type: String,
    enum: ['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Sales', 'Design', 'Operations', 'Other']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Employer Reference
  employer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Employer is required'] 
  },
  
  // Analytics
  views: { 
    type: Number, 
    default: 0 
  },
  applications: { 
    type: Number, 
    default: 0 
  },
  
  // SEO & Search
  slug: { 
    type: String, 
    unique: true 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full location string
jobSchema.virtual('locationString').get(function() {
  const parts = [this.location.city, this.location.state, this.location.country];
  return parts.filter(Boolean).join(', ');
});

// Virtual for salary range string
jobSchema.virtual('salaryRange').get(function() {
  if (!this.salary.min && !this.salary.max) return null;
  
  const formatSalary = (amount) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
    }
    return `$${amount}`;
  };
  
  if (this.salary.min && this.salary.max) {
    return `${formatSalary(this.salary.min)} - ${formatSalary(this.salary.max)}`;
  } else if (this.salary.min) {
    return `${formatSalary(this.salary.min)}+`;
  } else if (this.salary.max) {
    return `Up to ${formatSalary(this.salary.max)}`;
  }
});

// Virtual for days since posted
jobSchema.virtual('daysAgo').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to generate slug
jobSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + this._id.toString().slice(-6);
  }
  next();
});

// Indexes for better query performance
jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ 'location.city': 1, 'location.state': 1 });
jobSchema.index({ type: 1, status: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ employer: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ 'salary.min': 1, 'salary.max': 1 });

module.exports = mongoose.models.Job || mongoose.model('Job', jobSchema);
