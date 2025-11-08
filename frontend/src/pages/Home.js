import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${searchQuery}&location=${locationQuery}`);
  };

  const categories = [
    { name: 'Technology', icon: '💻', count: '2,340 jobs', color: 'from-blue-500 to-cyan-500' },
    { name: 'Design', icon: '🎨', count: '890 jobs', color: 'from-pink-500 to-rose-500' },
    { name: 'Marketing', icon: '📢', count: '1,240 jobs', color: 'from-purple-500 to-indigo-500' },
    { name: 'Finance', icon: '💰', count: '670 jobs', color: 'from-green-500 to-emerald-500' },
    { name: 'Healthcare', icon: '🏥', count: '1,580 jobs', color: 'from-red-500 to-orange-500' },
    { name: 'Education', icon: '📚', count: '540 jobs', color: 'from-yellow-500 to-amber-500' },
  ];

  const featuredCompanies = [
    { name: 'TechCorp', logo: '🏢', jobs: 23 },
    { name: 'InnovateLab', logo: '🚀', jobs: 15 },
    { name: 'Global Dynamics', logo: '🌐', jobs: 31 },
    { name: 'DesignHub', logo: '🎯', jobs: 12 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Find Your Dream Job
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
              Thousands of jobs from top companies. Start your career journey today.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 shadow-lg"
                >
                  Search Jobs
                </button>
              </div>
            </form>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">12K+</div>
              <div className="text-indigo-200 mt-1">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">8K+</div>
              <div className="text-indigo-200 mt-1">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">50K+</div>
              <div className="text-indigo-200 mt-1">Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">2K+</div>
              <div className="text-indigo-200 mt-1">New Jobs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Job Categories
            </h2>
            <p className="text-lg text-gray-600">
              Explore jobs by category
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => navigate(`/jobs?category=${category.name}`)}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100"
              >
                <div className={`text-4xl mb-3 p-4 rounded-xl bg-gradient-to-br ${category.color} bg-opacity-10 inline-block`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Companies
            </h2>
            <p className="text-lg text-gray-600">
              Top companies hiring right now
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredCompanies.map((company, index) => (
              <button
                key={index}
                onClick={() => navigate('/jobs')}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all border border-gray-200 hover:border-indigo-300"
              >
                <div className="text-5xl mb-4">{company.logo}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{company.name}</h3>
                <p className="text-sm text-indigo-600 font-medium">{company.jobs} open positions</p>
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/jobs')}
              className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition"
            >
              View All Jobs
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get hired in 3 easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Profile</h3>
              <p className="text-gray-600">
                Sign up and create your professional profile with your skills and experience
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Find Jobs</h3>
              <p className="text-gray-600">
                Search through thousands of jobs and apply to positions that match your skills
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Hired</h3>
              <p className="text-gray-600">
                Connect with employers, attend interviews, and land your dream job
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {user ? 'Ready to Find Your Next Opportunity?' : 'Start Your Career Journey Today'}
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            {user ? 'Browse thousands of jobs from top companies' : 'Join thousands of professionals finding their dream jobs'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg transform hover:scale-105"
                >
                  Sign Up Free
                </button>
                <button
                  onClick={() => navigate('/jobs')}
                  className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition"
                >
                  Browse Jobs
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/jobs')}
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg transform hover:scale-105"
              >
                Explore Jobs Now
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
