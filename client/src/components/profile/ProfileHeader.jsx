import React, { useState } from "react";
import { MapPin, Phone, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const CircularProgress = ({ percentage, name, avatar }) => {
  const size = 95;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="block"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2563eb"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
            {getInitials(name)}
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileHeader = ({ profile, updateProfile }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  console.log('ProfileHeader - profile.name:', profile.name);
  console.log('ProfileHeader - full profile:', profile);

  const [formData, setFormData] = useState({
    headline: profile.headline,
    summary: profile.summary,
    phone: profile.phone,
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditOpen(false);
  };

  const handleOpen = () => {
    setFormData({
      headline: profile.headline,
      summary: profile.summary,
      phone: profile.phone,
    });
    setIsEditOpen(true);
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center gap-6">
            <CircularProgress
              percentage={profile.profileCompletion}
              name={profile.name}
              avatar={profile.avatar}
            />

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {profile.name || 'User'}
                </h1>

                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium uppercase">
                  {profile.profileType}
                </span>

                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                  {profile.profileCompletion}% Complete
                </span>
              </div>

              <p className="text-gray-600 text-sm mt-1">{profile.headline}</p>

              <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {profile.location.city}, {profile.location.state}
                </span>

                <span className="flex items-center gap-1">
                  <Phone size={12} />
                  {profile.phone}
                </span>
              </div>
            </div>

            <button
              onClick={handleOpen}
              className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium"
            >
              <Edit2 size={14} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headline
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) =>
                  setFormData({ ...formData, headline: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About
              </label>
              <textarea
                rows={4}
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileHeader;
