import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob, updateJob } from '../../api/jobApi';
import { AuthContext } from '../../context/AuthContext';

export default function JobForm({ existingJob, onSuccess }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    title: existingJob?.title || '',
    description: existingJob?.description || '',
    location: {
      city: existingJob?.location?.city || '',
      state: existingJob?.location?.state || '',
      region: existingJob?.location?.region || ''
    },
    salary: existingJob?.salary || '',
    type: existingJob?.type || 'Full-time',
    category: existingJob?.category || 'Technology',
    status: existingJob?.status || 'active',
    experience: {
      min: existingJob?.experience?.min || 0,
      max: existingJob?.experience?.max || 0,
      level: existingJob?.experience?.level || 'Entry'
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested location fields
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setForm({
        ...form,
        location: {
          ...form.location,
          [field]: value
        }
      });
    }
    // Handle nested experience fields
    else if (name.startsWith('experience.')) {
      const field = name.split('.')[1];
      setForm({
        ...form,
        experience: {
          ...form.experience,
          [field]: field === 'min' || field === 'max' ? Number(value) : value
        }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'employer') {
      alert('Only employers can create or edit jobs');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Submitting job form:', existingJob ? 'UPDATE' : 'CREATE');
      console.log('Form data:', form);
      
      if (existingJob) {
        console.log('Updating job ID:', existingJob._id);
        console.log('Sending update data:', form);
        
        // Only send fields that exist in form
        const updateData = {};
        if (form.title) updateData.title = form.title;
        if (form.description) updateData.description = form.description;
        if (form.type) updateData.type = form.type;
        if (form.salary) updateData.salary = Number(form.salary);
        if (form.category) updateData.category = form.category;
        if (form.status) updateData.status = form.status;
        
        // Handle location - only if it has valid values
        if (form.location && (form.location.city || form.location.state)) {
          updateData.location = form.location;
        }
        
        // Handle experience - send as proper object
        if (form.experience && (form.experience.min || form.experience.max || form.experience.level)) {
          updateData.experience = {
            min: Number(form.experience.min) || 0,
            max: Number(form.experience.max) || 0,
            level: form.experience.level || 'Entry'
          };
        }
        
        console.log('Cleaned update data:', updateData);
        const response = await updateJob(existingJob._id, updateData);
        console.log('Update response:', response);
        alert('✅ Job updated successfully!');
      } else {
        console.log('Creating new job');
        const response = await createJob(form);
        console.log('Create response:', response);
        alert('✅ Job created successfully!');
      }
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('❌ Job save error:', err);
      console.error('Error response:', err.response);
      
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to save job';
      setError(errorMessage);
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>{existingJob ? 'Edit Job' : 'Create New Job'}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="card-body">
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '0.25rem' }}>
            {error}
          </div>
        )}
        
        <div className="form-group">
          <label className="form-label">Job Title</label>
          <input 
            name="title" 
            placeholder="e.g. Senior Software Engineer" 
            value={form.title} 
            onChange={handleChange} 
            className="form-input"
            required 
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Job Description</label>
          <textarea 
            name="description" 
            placeholder="Describe the role and what the candidate will be doing..." 
            value={form.description} 
            onChange={handleChange} 
            className="form-textarea"
            required 
            disabled={loading}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">City</label>
            <input 
              name="location.city" 
              placeholder="e.g. San Francisco" 
              value={form.location.city} 
              onChange={handleChange} 
              className="form-input"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">State</label>
            <input 
              name="location.state" 
              placeholder="e.g. CA" 
              value={form.location.state} 
              onChange={handleChange} 
              className="form-input"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Region</label>
            <input 
              name="location.region" 
              placeholder="e.g. West Coast" 
              value={form.location.region} 
              onChange={handleChange} 
              className="form-input"
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Salary (USD)</label>
          <input 
            name="salary" 
            placeholder="e.g. 80000" 
            type="number" 
            value={form.salary} 
            onChange={handleChange} 
            className="form-input"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Job Type</label>
          <select 
            name="type" 
            value={form.type} 
            onChange={handleChange}
            className="form-select"
            disabled={loading}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Min Experience (years)</label>
            <input 
              name="experience.min" 
              placeholder="e.g. 3" 
              type="number"
              value={form.experience.min} 
              onChange={handleChange} 
              className="form-input"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Max Experience (years)</label>
            <input 
              name="experience.max" 
              placeholder="e.g. 7" 
              type="number"
              value={form.experience.max} 
              onChange={handleChange} 
              className="form-input"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Experience Level</label>
            <select 
              name="experience.level" 
              value={form.experience.level} 
              onChange={handleChange}
              className="form-select"
              disabled={loading}
            >
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior Level</option>
              <option value="Lead">Lead/Staff</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              name="category" 
              value={form.category} 
              onChange={handleChange}
              className="form-select"
              disabled={loading}
            >
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Design">Design</option>
              <option value="Operations">Operations</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Status</label>
            <select 
              name="status" 
              value={form.status} 
              onChange={handleChange}
              className="form-select"
              disabled={loading}
            >
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (existingJob ? 'Updating...' : 'Creating...') : (existingJob ? 'Update Job' : 'Create Job')}
          </button>
          <button 
            type="button" 
            onClick={onSuccess} 
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
