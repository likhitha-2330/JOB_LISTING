import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import jobApi from '../../api/jobApi';
import applicationApi from '../../api/applicationApi';
import { formatLocation } from '../../utils/formatLocation';
import JobForm from '../Jobs/JobForm';

export default function EmployerDashboard() {
  const { token, user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]); // always keep an array in state
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  // Normalize API responses to an array
  const normalizeList = (res) => {
    const payload = res?.data ?? res;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching YOUR jobs for user:', user?.email);
      console.log('Token exists:', !!localStorage.getItem('token'));
      const res = await jobApi.getMyJobs();
      console.log('Raw response:', res);
      const list = normalizeList(res);
      console.log('✅ Loaded', list.length, 'jobs that you created');
      setJobs(list);
      setError('');
    } catch (err) {
      console.error('❌ fetchJobs error:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      const errorMsg = err.response?.data?.message || err.message || 'Could not load jobs';
      setError(errorMsg);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await applicationApi.getApplications();
      setApplications(normalizeList(res));
    } catch (err) {
      console.error('fetchApplications error', err);
      setApplications([]);
    }
  };

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }
    fetchJobs();
    fetchApplications();
  }, [token, user, navigate]);

  // safeJobs always an array
  const safeJobs = Array.isArray(jobs) ? jobs : [];

  const handleDelete = async (id) => {
    const job = jobs.find(j => j._id === id);
    if (!job) {
      alert('Job not found');
      return;
    }
    
    if (!window.confirm(`Delete "${job.title}"?\n\nThis will also delete all ${applications.filter(app => app.job._id === id).length} applications for this job.`)) {
      return;
    }
    
    try {
      console.log('🗑️ Deleting job:', id);
      await jobApi.deleteJob(id);
      console.log('✅ Job deleted successfully');
      
      setJobs((prev) => prev.filter((j) => j._id !== id));
      setApplications((prev) => prev.filter((app) => app.job._id !== id));
      alert('✅ Job deleted successfully!');
    } catch (err) {
      console.error('❌ Delete error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to delete job';
      alert(`❌ ${errorMsg}\n\nPlease refresh the page and try again.`);
      fetchJobs(); // Refresh to sync state
    }
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedJob(null);
    fetchJobs();
  };

  const handleDeleteApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }
    
    try {
      await applicationApi.deleteApplication(appId);
      setApplications((prev) => prev.filter((app) => app._id !== appId));
      alert('Application removed successfully!');
    } catch (err) {
      console.error('delete application error', err);
      alert(err.response?.data?.message || 'Failed to delete application.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header" style={{ marginBottom: '24px' }}>
          <h1 className="dashboard-title" style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Employer Dashboard</h1>
          <p className="dashboard-subtitle" style={{ fontSize: '16px', color: '#666' }}>
            Manage your job postings and applications
            {user?.company?.name && (
              <span style={{ marginLeft: '8px', fontWeight: '600', color: '#4f46e5' }}>
                • {user.company.name}
              </span>
            )}
          </p>
          {user?.email && (
            <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
              Logged in as: {user.email}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center">
            <div className="card">
              <div className="card-body">
                <p>Loading dashboard...</p>
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
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{jobs.length}</div>
                <div className="stat-label">Active Jobs</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{applications.length}</div>
                <div className="stat-label">Total Applications</div>
              </div>
            </div>

        <div className="mb-4">
          <button 
            onClick={() => { setSelectedJob(null); setShowForm(true); }} 
            className="btn btn-primary"
          >
            Create New Job
          </button>
        </div>

        {showForm && (
          <div className="mb-5">
            <JobForm existingJob={selectedJob} onSuccess={handleFormSuccess} />
          </div>
        )}

        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '2px solid #e0e0e0'
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>My Posted Jobs</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
                Jobs you have created and are managing
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#4f46e5' }}>{jobs.length}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Total Jobs</p>
            </div>
          </div>
          
          {jobs.length === 0 ? (
            <div className="text-center">
              <div className="card">
                <div className="card-body">
                  <h3 className="mb-2">No Jobs Posted Yet</h3>
                  <p className="text-secondary mb-4">Create your first job posting to get started.</p>
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="btn btn-primary"
                  >
                    Post Your First Job
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {safeJobs.map(job => (
                <div key={job._id} className="job-card card" style={{ marginBottom: '20px', border: '1px solid #e0e0e0' }}>
                  <div className="card-body" style={{ padding: '20px' }}>
                    {/* Header with Title and Actions */}
                    <div className="flex justify-between items-start mb-3">
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '4px' }}>
                          <span style={{ 
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#4f46e5',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            ✓ Posted by You
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <h3 className="job-title" style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>{job.title}</h3>
                          <span style={{ 
                            padding: '4px 12px', 
                            borderRadius: '12px', 
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: job.status === 'active' ? '#d4edda' : '#f8d7da',
                            color: job.status === 'active' ? '#155724' : '#721c24'
                          }}>
                            {job.status || 'active'}
                          </span>
                        </div>
                        
                        {/* Job Meta Information */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px', color: '#666' }}>
                          <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            📍 {formatLocation(job.location)}
                          </p>
                          {job.salary && (
                            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              💰 ${job.salary.toLocaleString()}/year
                            </p>
                          )}
                          {job.type && (
                            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              💼 {job.type}
                            </p>
                          )}
                          {job.category && (
                            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              🏷️ {job.category}
                            </p>
                          )}
                        </div>
                        
                        {/* Posted Date */}
                        <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#888' }}>
                          📅 Posted: {new Date(job.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                          {job.updatedAt && job.updatedAt !== job.createdAt && (
                            <span> • Updated: {new Date(job.updatedAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}</span>
                          )}
                        </p>
                      </div>
                      
                      <div className="flex gap-2" style={{ marginLeft: '16px' }}>
                        <button 
                          onClick={() => handleEdit(job)} 
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px 16px', fontSize: '14px' }}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(job._id)} 
                          className="btn btn-danger btn-sm"
                          style={{ padding: '6px 16px', fontSize: '14px' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    
                    {/* Job Description Preview */}
                    <div 
                      className="job-description mb-4" 
                      style={{ 
                        marginTop: '16px', 
                        padding: '12px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px',
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}
                      dangerouslySetInnerHTML={{ __html: job.description?.substring(0, 200) + '...' }}
                    />

                    <div className="card-footer">
                      <h4 className="mb-3">Applications ({applications.filter(app => app.job._id === job._id).length})</h4>
                      
                      {applications.filter(app => app.job._id === job._id).length === 0 ? (
                        <p className="text-secondary">No applications yet.</p>
                      ) : (
                        <div>
                          {applications.filter(app => app.job._id === job._id).map(app => (
                            <div key={app._id} className="application-item" style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
                              <div className="application-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <h4 className="application-job" style={{ margin: '0 0 4px 0', fontWeight: '600' }}>{app.seeker.name}</h4>
                                  <p className="text-secondary" style={{ margin: 0, fontSize: '14px' }}>{app.seeker.email}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span className={`application-status ${app.status}`} style={{ 
                                    padding: '4px 12px', 
                                    borderRadius: '12px', 
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    backgroundColor: app.status === 'accepted' ? '#d4edda' : app.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                                    color: app.status === 'accepted' ? '#155724' : app.status === 'rejected' ? '#721c24' : '#856404'
                                  }}>
                                    {app.status}
                                  </span>
                                  <button 
                                    onClick={() => handleDeleteApplication(app._id)} 
                                    className="btn btn-danger btn-sm"
                                    style={{ fontSize: '12px', padding: '4px 8px' }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
}
