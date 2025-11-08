import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { applyJob } from '../../api/applicationApi';
import { AuthContext } from '../../context/AuthContext';
import { formatLocation } from '../../utils/formatLocation';
import { useApplications } from '../../hooks/useApplications';

export default function JobCard({ job }) {
  const { user } = useContext(AuthContext);
  const { hasApplied, markAsApplied } = useApplications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  
  const isApplied = hasApplied(job._id);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'seeker') {
      alert('Only job seekers can apply for jobs');
      return;
    }
    
    if (isApplied) {
      navigate('/applications');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await applyJob(job._id);
      markAsApplied(job._id);
      alert('Applied successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to apply for job';
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        navigate('/login');
      } else if (err.response?.status === 400 && errorMessage.includes('Already applied')) {
        markAsApplied(job._id);
        alert('You have already applied for this job');
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save/unsave functionality
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    
    if (salary.min && salary.max) {
      return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k`;
    } else if (salary.min) {
      return `$${(salary.min / 1000).toFixed(0)}k+`;
    } else if (salary.max) {
      return `Up to $${(salary.max / 1000).toFixed(0)}k`;
    }
    return 'Salary not specified';
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-all border border-gray-100 relative">
      {isApplied && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
            ✓ Applied
          </span>
        </div>
      )}
      
      <Link to={`/jobs/${job._id}`} className="block mb-3">
        <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition mb-1 pr-20">
          {job.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">{job.company?.name}</span>
          <span>•</span>
          <span>{formatLocation(job.location)}</span>
        </div>
        {formatSalary(job.salary) !== 'Salary not specified' && (
          <div className="mt-2 text-sm font-semibold text-indigo-600">
            {formatSalary(job.salary)}
          </div>
        )}
      </Link>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex gap-2 text-xs">
          {job.type && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
              {job.type}
            </span>
          )}
        </div>
        
        {user?.role === 'seeker' && (
          <button 
            onClick={handleApply} 
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isApplied
                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 shadow-md'
            }`}
          >
            {loading ? 'Processing...' : isApplied ? 'View Application' : 'Apply Now'}
          </button>
        )}
        
        {!user && (
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 transition-all shadow-md"
          >
            Apply Now
          </button>
        )}
      </div>
    </article>
  );
}
