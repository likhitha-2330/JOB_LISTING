import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileApi from "../../api/profileApi";
import { useAuth } from "../../context/AuthContext";

export default function ProfileSimple() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await profileApi.getMyProfile();
      setProfile(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Profile load error:", err);
      
      if (err.response?.status === 401) {
        // Token invalid - clear and redirect to login
        localStorage.clear();
        navigate('/login');
        return;
      }
      
      if (err.response?.status === 404) {
        // Profile doesn't exist - try to create
        await createDefaultProfile();
      } else {
        // Other errors - just show empty state
        setLoading(false);
      }
    }
  };

  const createDefaultProfile = async () => {
    try {
      const defaultData = user?.role === 'employer'
        ? { name: user?.name || 'Company Name', description: 'Add your company description' }
        : { headline: 'Job Seeker', bio: 'Add your bio here', skills: [] };
      
      const res = await profileApi.updateMyProfile(defaultData);
      setProfile(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Profile creation error:", err);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      } else {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    // Don't show error screen, just redirect or show empty
    return null;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No profile found</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render based on role
  if (user?.role === 'employer') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{profile.name}</h1>
              {profile.industry && <p className="text-indigo-600 mb-2">{profile.industry}</p>}
              {profile.size && <p className="text-gray-500 mb-4">{profile.size} employees</p>}
            </div>
            <button 
              onClick={() => navigate('/profile/edit')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Edit Profile
            </button>
          </div>
          {profile.description && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-gray-700">{profile.description}</p>
            </div>
          )}
          {profile.website && (
            <div>
              <h3 className="font-semibold mb-2">Website</h3>
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600">
                {profile.website}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Seeker profile - LinkedIn-style
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header Card - Profile Summary */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl h-32"></div>
      <div className="bg-white rounded-b-2xl shadow-lg p-8 -mt-16">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Photo Placeholder */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
            {user?.name?.charAt(0)}
          </div>
          
          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
            {profile.headline && (
              <p className="text-xl text-gray-700 mb-3">{profile.headline}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.location}
                </div>
              )}
              {user?.email && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {user.email}
                </div>
              )}
              {profile.availability && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {profile.availability}
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{profile.experience?.length || 0}</div>
                <div className="text-xs text-gray-500">Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{profile.education?.length || 0}</div>
                <div className="text-xs text-gray-500">Education</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{profile.skills?.length || 0}</div>
                <div className="text-xs text-gray-500">Skills</div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => navigate('/profile/edit')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Edit Profile
            </button>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium text-center">
                View Resume
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* Main Content - 2/3 width */}
        <div className="md:col-span-2 space-y-6">
          {/* About Section */}
          {profile.bio && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                About
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{profile.bio}</p>
            </div>
          )}

          {/* Experience Section */}
          {profile.experience && profile.experience.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Work Experience
              </h2>
              <div className="space-y-6">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="flex gap-4 border-l-2 border-indigo-200 pl-4 pb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                      💼
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-indigo-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                        {exp.currentlyWorking ? ' Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                      {exp.description && (
                        <p className="text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {profile.education && profile.education.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                Education
              </h2>
              <div className="space-y-6">
                {profile.education.map((edu, index) => (
                  <div key={index} className="flex gap-4 border-l-2 border-purple-200 pl-4 pb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">
                      🎓
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{edu.school}</h3>
                      <p className="text-purple-600 font-medium">{edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                      </p>
                      {edu.description && (
                        <p className="text-gray-700 mt-2">{edu.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Skills Section */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Job Preferences */}
          {(profile.desiredJobTypes || profile.openToRelocate || profile.availability) && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Job Preferences
              </h2>
              <div className="space-y-3 text-sm">
                {profile.desiredJobTypes && profile.desiredJobTypes.length > 0 && (
                  <div>
                    <p className="text-gray-500 mb-1">Looking for:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.desiredJobTypes.map((type, i) => (
                        <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.availability && (
                  <div>
                    <p className="text-gray-500">Availability:</p>
                    <p className="text-gray-900 font-medium">{profile.availability}</p>
                  </div>
                )}
                {profile.openToRelocate !== undefined && (
                  <div>
                    <p className="text-gray-500">Open to relocate:</p>
                    <p className="text-gray-900 font-medium">{profile.openToRelocate ? 'Yes' : 'No'}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Links */}
          {(profile.portfolioUrl || profile.resumeUrl) && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Links
              </h2>
              <div className="space-y-2">
                {profile.portfolioUrl && (
                  <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Portfolio
                  </a>
                )}
                {profile.resumeUrl && (
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Resume/CV
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
