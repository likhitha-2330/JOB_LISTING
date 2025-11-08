const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  // User Reference (Employer who owns this company profile)
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  
  // Basic Information
  name: { 
    type: String, 
    required: [true, 'Company name is required'],
    trim: true
  },
  slug: { 
    type: String, 
    unique: true 
  },
  
  // Company Details
  description: { 
    type: String,
    maxlength: [2000, 'Company description cannot exceed 2000 characters']
  },
  industry: { 
    type: String,
    enum: ['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Sales', 'Design', 'Operations', 'Manufacturing', 'Retail', 'Other']
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  
  // Contact Information
  website: { 
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
  },
  email: { 
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: { 
    type: String,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  
  // Location
  headquarters: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, default: 'United States' },
    zipCode: { type: String }
  },
  
  // Social Media & Branding
  logo: { 
    type: String 
  },
  coverImage: { 
    type: String 
  },
  socialMedia: {
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    instagram: { type: String }
  },
  
  // Company Culture & Benefits
  culture: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  perks: [{
    type: String,
    trim: true
  }],
  
  // Company Stats
  foundedYear: { 
    type: Number 
  },
  revenue: { 
    type: String 
  },
  employees: { 
    type: Number 
  },
  
  // Verification & Status
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  // Analytics
  views: { 
    type: Number, 
    default: 0 
  },
  followers: { 
    type: Number, 
    default: 0 
  },
  
  // SEO
  metaDescription: { 
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full headquarters address
companySchema.virtual('fullAddress').get(function() {
  const parts = [
    this.headquarters.address,
    this.headquarters.city,
    this.headquarters.state,
    this.headquarters.zipCode,
    this.headquarters.country
  ];
  return parts.filter(Boolean).join(', ');
});

// Virtual for company age
companySchema.virtual('age').get(function() {
  if (!this.foundedYear) return null;
  return new Date().getFullYear() - this.foundedYear;
});

// Pre-save middleware to generate slug
companySchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Indexes for better query performance
companySchema.index({ name: 'text', description: 'text' });
companySchema.index({ industry: 1 });
companySchema.index({ size: 1 });
companySchema.index({ 'headquarters.city': 1, 'headquarters.state': 1 });
companySchema.index({ isVerified: 1, isActive: 1 });
companySchema.index({ followers: -1 });

module.exports = mongoose.model('Company', companySchema);
