import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApplications } from '../../api/applicationApi';
import { AuthContext } from '../../context/AuthContext';
import { formatLocation } from '../../utils/formatLocation';

export default function SeekerDashboard() {
  const { token, user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        setLoading(true);
        setError('');
        const { data } = await getApplications();
        setApplications(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load applications');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [token, navigate]);

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Applications</h1>
          <p className="dashboard-subtitle">Track your job applications and their status</p>
        </div>
        
        {loading ? (
          <div className="text-center">
            <div className="card">
              <div className="card-body">
                <p>Loading applications...</p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="card">
              <div className="card-body">
                <div className="alert alert-danger" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '0.25rem' }}>
                  {error}
                </div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center">
            <div className="card">
              <div className="card-body">
                <h3 className="mb-2">No Applications Yet</h3>
                <p className="text-secondary mb-4">Start applying to jobs to see them here.</p>
                <a href="/" className="btn btn-primary">Browse Jobs</a>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {applications.map((app) => (
              <div key={app._id} className="application-item">
                <div className="application-header">
                  <div>
                    <h3 className="application-job">{app.job.title}</h3>
                    <p className="job-company">{app.job.employer?.company || app.job.employer?.name}</p>
                    <p className="job-location">📍 {formatLocation(app.job.location)}</p>
                  </div>
                  <div className={`application-status ${app.status}`}>
                    {app.status}
                  </div>
                </div>
                
                <div className="job-description">
                  {app.job.description}
                </div>
                
                {app.job.salary && (
                  <div className="job-meta">
                    <div className="job-meta-item">
                      💰 ${app.job.salary.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
