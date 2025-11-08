import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profileApi from '../api/profileApi';
import { useAuth } from '../context/AuthContext';

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await profileApi.getMyProfile();
        if (!mounted) return;
        const data = res.data || {};
        if (user.role === 'employer') {
          setForm({
            name: data.name || '',
            website: data.website || '',
            description: data.description || '',
            industry: data.industry || '',
            size: data.size || '',
            headquarters: {
              city: data.headquarters?.city || '',
              state: data.headquarters?.state || ''
            }
          });
        } else {
          setForm({
            headline: data.headline || '',
            bio: data.bio || '',
            location: data.location || '',
            skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
            availability: data.availability || 'negotiable',
            desiredJobTypes: Array.isArray(data.desiredJobTypes) ? data.desiredJobTypes.join(', ') : '',
            portfolioUrl: data.portfolioUrl || '',
            resumeUrl: data.resumeUrl || ''
          });
        }
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user.role]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('headquarters.')) {
      const key = name.split('.')[1];
      setForm(prev => ({ ...prev, headquarters: { ...(prev.headquarters || {}), [key]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMsg('');
    try {
      let payload;
      if (user.role === 'employer') {
        payload = { ...form };
      } else {
        payload = {
          ...form,
          // normalize comma separated lists to arrays with trimmed lowercase where enums required
          skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
          desiredJobTypes: form.desiredJobTypes ? form.desiredJobTypes.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [],
          availability: (form.availability || 'negotiable').toLowerCase()
        };
      }
      await profileApi.updateMyProfile(payload);
      setMsg('Profile saved successfully');
      setTimeout(() => navigate('/profile'), 600);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200 text-sm">{error}</div>
        )}
        {msg && (
          <div className="mb-4 p-3 rounded bg-green-50 text-green-700 border border-green-200 text-sm">{msg}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {user.role === 'employer' ? (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Company Name</label>
                <input name="name" value={form.name} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Website</label>
                <input name="website" value={form.website} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Industry</label>
                <input name="industry" value={form.industry} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Size</label>
                <input name="size" value={form.size} onChange={onChange} className="w-full border rounded-lg px-3 py-2" placeholder="e.g. 51-200" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Headquarters City</label>
                  <input name="headquarters.city" value={form.headquarters?.city || ''} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Headquarters State</label>
                  <input name="headquarters.state" value={form.headquarters?.state || ''} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={onChange} className="w-full border rounded-lg px-3 py-2 h-28" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Headline</label>
                <input name="headline" value={form.headline} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Location</label>
                <input name="location" value={form.location} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Skills (comma separated)</label>
                <input name="skills" value={form.skills} onChange={onChange} className="w-full border rounded-lg px-3 py-2" placeholder="React, Node.js, TypeScript" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Availability</label>
                  <select name="availability" value={form.availability} onChange={onChange} className="w-full border rounded-lg px-3 py-2">
                    <option value="immediate">immediate</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="negotiable">negotiable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Desired Job Types (comma separated)</label>
                  <input name="desiredJobTypes" value={form.desiredJobTypes} onChange={onChange} className="w-full border rounded-lg px-3 py-2" placeholder="full-time, remote" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Portfolio URL</label>
                <input name="portfolioUrl" value={form.portfolioUrl} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Resume URL</label>
                <input name="resumeUrl" value={form.resumeUrl} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">About</label>
                <textarea name="bio" value={form.bio} onChange={onChange} className="w-full border rounded-lg px-3 py-2 h-28" />
              </div>
            </>
          )}

          <div className="pt-2 flex gap-3">
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate('/profile')} className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
