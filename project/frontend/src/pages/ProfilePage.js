import React, { useState } from 'react';
import { toast } from 'react-toastify';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const ProfilePage = () => {
  const { user, updateUser, isAdmin } = useAuth();

  // ── Profile edit state ────────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    imageUrl: user?.imageUrl || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // ── Password change state ─────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) { toast.error('Name cannot be empty'); return; }

    setProfileLoading(true);
    try {
      const updated = await authService.updateProfile({
        name: profileForm.name,
        imageUrl: profileForm.imageUrl,
      });
      updateUser(updated);
      toast.success('Profile updated ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const validatePw = () => {
    const e = {};
    if (!pwForm.currentPassword) e.currentPassword = 'Required';
    if (!pwForm.newPassword) e.newPassword = 'Required';
    else if (pwForm.newPassword.length < 6) e.newPassword = 'At least 6 characters';
    if (pwForm.newPassword !== pwForm.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = validatePw();
    if (Object.keys(errs).length) { setPwErrors(errs); return; }

    setPwLoading(true);
    try {
      await authService.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Password changed ✅');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const PLACEHOLDER = 'https://via.placeholder.com/80?text=' + (user?.name?.[0] || 'U');

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">👤 My Profile</h1>

        {/* ── Account Info Card ──────────────────────────────────────────── */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <img
              src={user?.imageUrl || PLACEHOLDER}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
              onError={e => { e.target.src = PLACEHOLDER; }}
            />
            <div>
              <p className="text-xl font-bold text-gray-900">{user?.name}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                  ${isAdmin ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {isAdmin ? '👑 ADMIN' : '👤 USER'}
                </span>
                <span className="text-xs text-gray-400 capitalize">
                  via {user?.provider?.toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Read-only info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Member Since</p>
              <p className="font-medium">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Login Provider</p>
              <p className="font-medium capitalize">{user?.provider?.toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* ── Edit Profile Form ──────────────────────────────────────────── */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">✏️ Edit Profile</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                className="input-field"
                value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input
                className="input-field bg-gray-50 cursor-not-allowed"
                value={user?.email || ''}
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="label">Profile Image URL</label>
              <input
                className="input-field"
                value={profileForm.imageUrl}
                onChange={e => setProfileForm({ ...profileForm, imageUrl: e.target.value })}
                placeholder="https://..."
              />
              {profileForm.imageUrl && (
                <img
                  src={profileForm.imageUrl}
                  alt="preview"
                  className="mt-2 w-16 h-16 rounded-full object-cover border"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              )}
            </div>
            <button type="submit" className="btn-primary" disabled={profileLoading}>
              {profileLoading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* ── Change Password Form (LOCAL users only) ────────────────────── */}
        {user?.provider === 'LOCAL' && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🔒 Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {[
                ['currentPassword', 'Current Password'],
                ['newPassword',     'New Password'],
                ['confirmPassword', 'Confirm New Password'],
              ].map(([id, label]) => (
                <div key={id}>
                  <label className="label">{label}</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                    value={pwForm[id]}
                    onChange={e => setPwForm({ ...pwForm, [id]: e.target.value })}
                  />
                  {pwErrors[id] && <p className="error-msg">{pwErrors[id]}</p>}
                </div>
              ))}
              <button type="submit" className="btn-primary" disabled={pwLoading}>
                {pwLoading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {user?.provider !== 'LOCAL' && (
          <div className="card p-6 bg-gray-50">
            <p className="text-gray-500 text-sm">
              🔒 Password management is not available for social login accounts.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
