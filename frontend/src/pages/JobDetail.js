import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import jobApi from "../api/jobApi";
import applicationApi from "../api/applicationApi";
import { formatLocation } from "../utils/formatLocation";
import { useApplications } from "../hooks/useApplications";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasApplied, markAsApplied } = useApplications();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);
  
  const isApplied = hasApplied(id);

  useEffect(() => {
    async function load() {
      try {
        const res = await jobApi.getById(id);
        setJob(res.data);
      } catch (err) {
        setError("Could not load job.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

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
    
    setApplying(true);
    setError(null);
    try {
      await applicationApi.applyJob(id, "Excited to apply via portal.");
      markAsApplied(id);
      alert('Application submitted successfully!');
      navigate("/applications");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Apply failed";
      setError(errorMessage);
      
      if (err.response?.status === 400 && errorMessage.includes('Already applied')) {
        markAsApplied(id);
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!job) return <div className="p-6">Job not found</div>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{job.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 mb-2">
              <span className="font-semibold text-lg">{job.company?.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {formatLocation(job.location)}
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              {job.employmentType && (
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                  {job.employmentType}
                </span>
              )}
              {job.type && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                  {job.type}
                </span>
              )}
            </div>
          </div>
          
          {isApplied && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-green-700">Applied</span>
            </div>
          )}
        </div>
      </div>

      {/* Job Description Section */}
      <section className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: job.description }} />
      </section>

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky bottom-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {job.company?.website && (
              <button
                onClick={() => window.open(job.company.website, "_blank")}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 hover:border-indigo-500 hover:text-indigo-600 transition font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Company Website
              </button>
            )}
          </div>
          
          {user?.role === 'seeker' && (
            <button
              onClick={handleApply}
              disabled={applying}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                isApplied
                  ? 'bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 shadow-lg'
              }`}
            >
              {applying ? "Processing..." : isApplied ? "View My Application" : "Apply for this Job"}
            </button>
          )}
          
          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 transition-all shadow-lg"
            >
              Sign In to Apply
            </button>
          )}
        </div>
      </div>
    </main>
  );
}