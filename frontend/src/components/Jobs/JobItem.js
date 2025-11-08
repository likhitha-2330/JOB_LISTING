import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyJob } from '../../api/applicationApi';
import { AuthContext } from '../../context/AuthContext';
import { formatLocation } from '../../utils/formatLocation';

export default function JobItem({ job }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'seeker') {
      alert('Only job seekers can apply for jobs');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await applyJob(job._id);
      alert('Applied successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to apply for job';
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        navigate('/login');
      } else if (err.response?.status === 400 && errorMessage.includes('Already applied')) {
        alert('You have already applied for this job');
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-card card">
      <div className="card-body">
        <h3 className="job-title">{job.title}</h3>
        <p className="job-company">{job.employer.company || job.employer.name}</p>
        <p className="job-location">📍 {formatLocation(job.location)}</p>
        <p className="job-description">{job.description}</p>
        
        <div className="job-meta">
          {job.salary && (
            <div className="job-meta-item">
              💰 ${job.salary?.toLocaleString()}
            </div>
          )}
          {job.type && (
            <div className="job-meta-item">
              ⏰ {job.type}
            </div>
          )}
          {job.experience && (
            <div className="job-meta-item">
              📈 {job.experience} years experience
            </div>
          )}
        </div>
        
        {user?.role === 'seeker' && (
          <div className="job-actions">
            {error && (
              <div className="alert alert-danger" style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
            <button 
              onClick={handleApply} 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Applying...' : 'Apply Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
