import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileApi from "../../api/profileApi";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    async function load() {
      try {
        const res = await profileApi.getMyProfile();
        if (mounted) {
          setProfile(res.data);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        
        // If unauthorized (401), redirect to login
        if (err.response?.status === 401) {
          console.log("Unauthorized - redirecting to login");
          navigate('/login');
          return;
        }
        
        // If profile doesn't exist (404), try to auto-create it
        if (err.response?.status === 404) {
          console.log("Profile not found (404), attempting to create...");
          
          // Check if we have user info to create profile
          if (!user) {
            console.log("No user data available, redirecting to login");
            navigate('/login');
            return;
          }
          
          try {
            const defaultProfile = user.role === 'employer' 
              ? { name: user.name || 'Company Name', description: 'Tell us about your company' }
              : { headline: 'Professional seeking opportunities', bio: 'Tell us about yourself', skills: [] };
            
            console.log("Creating default profile:", defaultProfile);
            const created = await profileApi.updateMyProfile(defaultProfile);
            if (mounted) {
              setProfile(created.data);
              setError(null);
            }
          } catch (createErr) {
            console.error("Failed to create profile", createErr);
            if (createErr.response?.status === 401) {
              navigate('/login');
              return;
            }
            if (mounted) {
              setError("Could not create profile automatically. " + (createErr.response?.data?.message || createErr.message));
            }
          }
        } else {
          // Other errors
          if (mounted) {
            setError(err.response?.data?.message || err.message || "Failed to load profile");
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    load();
    return () => { mounted = false; };
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">❌ Error Loading Profile</h3>
          <p className="text-red-600 mb-4">{error}</p>
          
          <div className="bg-white border border-red-200 rounded p-3 mb-4 text-sm">
            <p className="font-semibold text-gray-700 mb-2">Debug Info:</p>
            <p className="text-gray-600">Token: {token ? '✅ Present' : '❌ Missing'}</p>
            <p className="text-gray-600">User: {user ? `✅ ${user.name}` : '❌ Missing'}</p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Re-Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md text-center">
          <p className="text-gray-600 mb-4">No profile found</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  // Render profile based on user role
  if (user.role === 'employer') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
            {profile.industry && (
              <p className="text-indigo-600 font-medium">{profile.industry}</p>
            )}
            {profile.size && (
              <p className="text-gray-500 text-sm mt-1">{profile.size} employees</p>
            )}
          </div>

          {profile.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700">{profile.description}</p>
            </div>
          )}

          {profile.website && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Website</h3>
              <a 
                href={profile.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700"
              >
                {profile.website}
              </a>
            </div>
          )}

          {profile.headquarters && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-700">
                {[profile.headquarters.city, profile.headquarters.state].filter(Boolean).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Seeker profile
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
          {profile.headline && (
            <p className="text-xl text-indigo-600 font-medium">{profile.headline}</p>
          )}
          {profile.location && (
            <p className="text-gray-500 mt-1">{profile.location}</p>
          )}
        </div>

        {profile.bio && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}

        {profile.skills?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {(!profile.skills || profile.skills.length === 0) && !profile.bio && (
          <div className="text-center py-8 text-gray-500">
            <p>Complete your profile to stand out to employers!</p>
          </div>
        )}
      </div>
    </div>
  );
}
