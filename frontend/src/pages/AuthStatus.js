import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthStatus() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const tokenPreview = token ? token.substring(0, 20) + '...' : null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">🔐 Auth Status</h1>
          
          <div className="space-y-4">
            {/* Token Status */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-lg mb-2">Token Status</h3>
              {token ? (
                <div>
                  <p className="text-green-600 font-medium">✅ Token Present</p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{tokenPreview}</p>
                </div>
              ) : (
                <p className="text-red-600 font-medium">❌ No Token Found</p>
              )}
            </div>

            {/* User Status */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-lg mb-2">User Status</h3>
              {user ? (
                <div className="space-y-1">
                  <p className="text-green-600 font-medium">✅ User Logged In</p>
                  <p className="text-sm"><strong>Name:</strong> {user.name}</p>
                  <p className="text-sm"><strong>Email:</strong> {user.email}</p>
                  <p className="text-sm"><strong>Role:</strong> {user.role}</p>
                  <p className="text-sm"><strong>ID:</strong> {user._id}</p>
                </div>
              ) : (
                <p className="text-red-600 font-medium">❌ No User Data</p>
              )}
            </div>

            {/* LocalStorage Check */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-lg mb-2">LocalStorage Check</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>token:</strong>{' '}
                  {localStorage.getItem('token') ? '✅ Exists' : '❌ Missing'}
                </p>
                <p>
                  <strong>user:</strong>{' '}
                  {localStorage.getItem('user') ? '✅ Exists' : '❌ Missing'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {token && user ? (
                <>
                  <button
                    onClick={() => navigate('/profile')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Go to Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      window.location.reload();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Go to Login
                  </button>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Clear Storage
                  </button>
                </>
              )}
            </div>

            {/* Console Test */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Run Console Test</h3>
              <button
                onClick={() => {
                  console.log('=== AUTH STATUS TEST ===');
                  console.log('Token from localStorage:', localStorage.getItem('token'));
                  console.log('User from localStorage:', localStorage.getItem('user'));
                  console.log('Token from context:', token);
                  console.log('User from context:', user);
                  alert('Check browser console (F12) for details');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Log to Console
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
