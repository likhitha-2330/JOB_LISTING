import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import applicationApi from '../api/applicationApi';

/**
 * Custom hook to track user's job applications
 * Returns applied job IDs and helper functions
 */
export function useApplications() {
  const { user } = useAuth();
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'seeker') {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadApplications = async () => {
    try {
      const res = await applicationApi.getApplications();
      const applications = res.data || [];
      
      // Extract job IDs from applications
      const jobIds = applications.map(app => {
        // Handle both populated and unpopulated job references
        return typeof app.job === 'string' ? app.job : app.job?._id;
      }).filter(Boolean);
      
      setAppliedJobIds(new Set(jobIds));
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasApplied = (jobId) => {
    return appliedJobIds.has(jobId);
  };

  const markAsApplied = (jobId) => {
    setAppliedJobIds(prev => new Set([...prev, jobId]));
  };

  return {
    appliedJobIds,
    hasApplied,
    markAsApplied,
    loading,
    refresh: loadApplications
  };
}
