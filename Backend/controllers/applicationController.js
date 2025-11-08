const Application = require('../models/Application');
const Job = require('../models/Job');

exports.apply = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    if (!jobId) return res.status(400).json({ message: 'Missing jobId' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existing = await Application.findOne({ job: jobId, seeker: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already applied' });

    const app = await Application.create({
      job: jobId,
      seeker: req.user._id,
      coverLetter,
      status: 'applied'
    });

    const populated = await Application.findById(app._id)
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name website' }
      })
      .populate('seeker', 'name email');

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not apply' });
  }
};

exports.list = async (req, res) => {
  try {
    let apps;
    if (req.user.role === 'employer') {
      const jobs = await Job.find({ employer: req.user._id }).select('_id');
      const jobIds = jobs.map(j => j._id);
      apps = await Application.find({ job: { $in: jobIds } }).populate('job seeker').sort({ createdAt: -1 });
    } else {
      apps = await Application.find({ seeker: req.user._id }).populate({ path: 'job', populate: { path: 'company', select: 'name' } }).sort({ createdAt: -1 });
    }
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch applications' });
  }
};

exports.get = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate({ path: 'job', populate: { path: 'company' } }).populate('seeker', 'name email');
    if (!app) return res.status(404).json({ message: 'Application not found' });

    if (req.user.role === 'seeker' && app.seeker._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (req.user.role === 'employer') {
      const job = await Job.findById(app.job._id);
      if (job.employer.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    const job = await Job.findById(app.job);
    const allowedByEmployer = req.user.role === 'employer' && job.employer.toString() === req.user._id.toString();
    const allowedBySeeker = req.user.role === 'seeker' && app.seeker.toString() === req.user._id.toString();

    if (!allowedByEmployer && !allowedBySeeker && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status, coverLetter } = req.body;
    if (status) app.status = status;
    if (coverLetter) app.coverLetter = coverLetter;
    await app.save();

    const populated = await Application.findById(app._id).populate({ path: 'job', populate: { path: 'company' } }).populate('seeker', 'name email');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not update application' });
  }
};

exports.delete = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    // Check authorization
    const job = await Job.findById(app.job);
    const allowedByEmployer = req.user.role === 'employer' && job && job.employer.toString() === req.user._id.toString();
    const allowedBySeeker = req.user.role === 'seeker' && app.seeker.toString() === req.user._id.toString();

    if (!allowedByEmployer && !allowedBySeeker && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error('Delete application error:', err);
    res.status(500).json({ message: 'Could not delete application' });
  }
};