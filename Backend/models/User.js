const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    // permissive regex to avoid rejecting common dev addresses
    match: [/.+@.+\..+/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: { 
    type: String, 
    enum: ['seeker', 'employer', 'admin'], 
    default: 'seeker'
  },
  
  // Profile Information
  avatar: { 
    type: String,
    default: null
  },
  phone: { 
    type: String,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  bio: { 
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  
  // Job Seeker Specific Fields
  resume: { 
    type: String 
  },
  skills: [{ 
    type: String,
    trim: true
  }],
  experience: [{
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    description: { type: String }
  }],
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false }
  }],
  location: {
    city: { type: String },
    state: { type: String },
    country: { type: String, default: 'United States' }
  },
  
  // Employer Specific Fields
  company: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
    // Optional - gets populated after Company profile is created
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  industry: { 
    type: String 
  },
  website: { 
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
  },
  companyDescription: { 
    type: String,
    maxlength: [1000, 'Company description cannot exceed 1000 characters']
  },
  
  // Account Status
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  lastLogin: { 
    type: Date 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name display
userSchema.virtual('displayName').get(function() {
  return this.name;
});

// Virtual for profile completeness
userSchema.virtual('profileCompleteness').get(function() {
  let score = 0;
  const fields = ['name', 'email', 'bio', 'avatar'];
  
  if (this.role === 'seeker') {
    fields.push('skills', 'experience', 'education', 'location');
  } else {
    fields.push('company', 'industry', 'companyDescription');
  }
  
  fields.forEach(field => {
    if (this[field] && (Array.isArray(this[field]) ? this[field].length > 0 : true)) {
      score++;
    }
  });
  
  return Math.round((score / fields.length) * 100);
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'location.city': 1, 'location.state': 1 });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
