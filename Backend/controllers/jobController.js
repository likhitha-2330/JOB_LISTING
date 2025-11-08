const Job = require('../models/Job');
const Application = require('../models/Application');

// Get jobs for logged-in employer only
exports.myJobs = async (req, res) => {
  try {
    console.log('📋 MyJobs endpoint hit');
    console.log('User:', req.user ? req.user.email : 'NO USER');
    console.log('User ID:', req.user?._id);
    console.log('User Role:', req.user?.role);
    
    if (!req.user) {
      console.log('❌ No user in request');
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    console.log('Querying jobs with employer:', req.user._id);
    const jobs = await Job.find({ employer: req.user._id })
      .populate('company', 'name website location')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${jobs.length} jobs for this employer`);
    if (jobs.length > 0) {
      jobs.forEach((job, i) => {
        console.log(`  ${i + 1}. ${job.title} (ID: ${job._id})`);
      });
    }
    
    res.json({ data: jobs, meta: { total: jobs.length } });
  } catch (err) {
    console.error('❌ Error fetching employer jobs:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ message: 'Could not fetch your jobs', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = req.body || {};
    payload.employer = req.user._id;
    payload.postedBy = req.user._id;
    const job = await Job.create(payload);
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create job' });
  }
};

exports.list = async (req, res) => {
  try {
    const { search, location, employmentType, company, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (location) filter['location.city'] = { $regex: location, $options: 'i' };
    if (employmentType) filter.type = employmentType;
    if (company) filter.company = company;

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const [jobs, total] = await Promise.all([
      Job.find(filter).populate('company', 'name website location').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Job.countDocuments(filter)
    ]);

    res.json({ data: jobs, meta: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not list jobs' });
  }
};

exports.getById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company', 'name website location description');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    console.log('✏️ Update request:', req.params.id, 'by user:', req.user.email);
    console.log('Update data received:', JSON.stringify(req.body, null, 2));
    
    const job = await Job.findById(req.params.id);
    if (!job) {
      console.log('❌ Job not found');
      return res.status(404).json({ message: 'Job not found' });
    }
    
    console.log('Current job data:', {
      employer: job.employer,
      company: job.company,
      location: job.location
    });
    
    // Check authorization
    const isOwner = job.employer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    console.log('Authorization:', { isOwner, isAdmin, jobEmployer: job.employer.toString(), userId: req.user._id.toString() });
    
    if (!isOwner && !isAdmin) {
      console.log('❌ Not authorized');
      return res.status(403).json({ message: 'You can only edit jobs you created' });
    }
    
    // Prepare updates - only include fields that should be updated
    const allowedFields = ['title', 'description', 'location', 'salary', 'type', 'category', 'status'];
    const updates = {};
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        // Skip empty arrays for qualifications/responsibilities
        if (Array.isArray(req.body[field]) && req.body[field].length === 0) {
          continue;
        }
        updates[field] = req.body[field];
      }
    }
    
    // Only update experience if it's a proper object
    if (req.body.experience && typeof req.body.experience === 'object' && !Array.isArray(req.body.experience)) {
      if (req.body.experience.min !== undefined || req.body.experience.max !== undefined || req.body.experience.level) {
        updates.experience = req.body.experience;
      }
    }
    
    // Ensure employer and company stay the same
    updates.employer = job.employer;
    updates.company = job.company;
    
    console.log('Applying updates to fields:', Object.keys(updates));
    
    // Use findByIdAndUpdate to avoid potential validation issues
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('company', 'name website location');
    
    console.log('✅ Job updated successfully');
    res.json(updatedJob);
  } catch (err) {
    console.error('❌ Update error:', err.message);
    console.error('Error name:', err.name);
    if (err.errors) {
      console.error('Validation errors:', Object.keys(err.errors));
      Object.keys(err.errors).forEach(key => {
        console.error(`  - ${key}:`, err.errors[key].message);
      });
    }
    console.error('Full error:', err);
    
    res.status(500).json({ 
      message: 'Could not update job', 
      error: err.message,
      details: err.errors ? Object.keys(err.errors).map(k => `${k}: ${err.errors[k].message}`) : []
    });
  }
};

exports.remove = async (req, res) => {
  try {
    console.log('🗑️ Delete request:', req.params.id, 'by user:', req.user.email);
    
    const job = await Job.findById(req.params.id);
    if (!job) {
      console.log('❌ Job not found');
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check authorization
    const isOwner = job.employer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    console.log('Authorization check:', {
      jobEmployer: job.employer.toString(),
      userId: req.user._id.toString(),
      isOwner,
      isAdmin
    });
    
    if (!isOwner && !isAdmin) {
      console.log('❌ Not authorized');
      return res.status(403).json({ 
        message: 'You can only delete jobs you created'
      });
    }
    
    // Delete all applications first
    const appCount = await Application.deleteMany({ job: req.params.id });
    console.log(`🗑️ Deleted ${appCount.deletedCount} applications`);
    
    // Delete the job
    await Job.findByIdAndDelete(req.params.id);
    
    console.log('✅ Job deleted successfully');
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ message: 'Could not delete job', error: err.message });
  }
};
