import React, { useState } from 'react';
import { Mail, Lock, Image, Bell, Globe, Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const SettingsSection = ({ profile, updateProfile }) => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: profile.email || '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [pictureUrl, setPictureUrl] = useState(profile.avatar || '');

  const handlePublicToggle = (value) => {
    updateProfile({ isPublic: value });
  };

  const handleEmailSave = () => {
    updateProfile({ email: emailForm.email });
    setShowEmailModal(false);
  };

  const handlePasswordSave = () => {
    if (passwordForm.new === passwordForm.confirm) {
      alert('Password updated successfully');
      setShowPasswordModal(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
    } else {
      alert('Passwords do not match');
    }
  };

  const handlePictureSave = () => {
    updateProfile({ avatar: pictureUrl });
    setShowPictureModal(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion would be processed here');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Settings</h2>

      {/* Account Settings */}
      <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Account Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Mail size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Email</p>
                <p className="text-xs text-gray-500">Change your email address</p>
              </div>
            </div>
            <button
              onClick={() => setShowEmailModal(true)}
              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium">
              Change
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Lock size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Password</p>
                <p className="text-xs text-gray-500">Update your password</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium">
              Change
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Image size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Profile Picture</p>
                <p className="text-xs text-gray-500">Upload or change your photo</p>
              </div>
            </div>
            <button
              onClick={() => { setPictureUrl(profile.avatar || ''); setShowPictureModal(true); }}
              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium">
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 shadow-sm bg-red-50 p-4">
        <h3 className="text-sm font-semibold text-red-600 mb-3">Danger Zone</h3>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Trash2 size={16} className="text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Delete Account</p>
              <p className="text-xs text-gray-600">Permanently delete your account and all data</p>
            </div>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Email Change Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Email</label>
              <input
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm({ email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new email"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Picture Modal */}
      <Dialog open={showPictureModal} onOpenChange={setShowPictureModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={pictureUrl}
                onChange={(e) => setPictureUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter image URL"
              />
            </div>
            {pictureUrl && (
              <div className="flex justify-center">
                <img src={pictureUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowPictureModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePictureSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsSection;
