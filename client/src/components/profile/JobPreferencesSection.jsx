import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Edit2, X, Plus } from 'lucide-react';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const JobPreferencesSection = ({ profile, updatePreferences }) => {
  const [salaryRange, setSalaryRange] = useState([
    profile.preferences.expectedSalary.min,
    profile.preferences.expectedSalary.max
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [availableDate, setAvailableDate] = useState(profile.preferences.availableFrom);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleJobTypeChange = (type) => {
    const current = profile.preferences.jobTypes;
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    updatePreferences({ jobTypes: updated });
  };

  const handleWorkModeChange = (mode) => {
    const current = profile.preferences.workMode;
    const updated = current.includes(mode)
      ? current.filter(m => m !== mode)
      : [...current, mode];
    updatePreferences({ workMode: updated });
  };

  const handleSalaryChange = (e, type) => {
    const value = parseInt(e.target.value);
    const newRange = type === 'min'
      ? [value, salaryRange[1]]
      : [salaryRange[0], value];
    setSalaryRange(newRange);
    updatePreferences({
      expectedSalary: {
        ...profile.preferences.expectedSalary,
        [type]: value
      }
    });
  };

  const handleRelocationToggle = (value) => {
    updatePreferences({ willingToRelocate: value });
  };

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      const updatedLocations = [...profile.preferences.preferredLocations, newLocation.trim()];
      updatePreferences({ preferredLocations: updatedLocations });
      setNewLocation('');
      setShowLocationModal(false);
    }
  };

  const handleRemoveLocation = (index) => {
    const updatedLocations = profile.preferences.preferredLocations.filter((_, i) => i !== index);
    updatePreferences({ preferredLocations: updatedLocations });
  };

  const handleDateSave = () => {
    updatePreferences({ availableFrom: availableDate });
    setShowDateModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Job Preferences</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
        >
          <Edit2 size={14} />
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Job Types */}
        <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Preferred Role</h3>
          <div className="space-y-2">
            {['internship', 'full-time', 'part-time', 'contract'].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={profile.preferences.jobTypes.includes(type)}
                  onChange={() => handleJobTypeChange(type)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 disabled:opacity-50 cursor-pointer"
                />
                <span className="text-sm text-gray-700 capitalize group-hover:text-gray-900">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Work Mode */}
        <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Work Mode</h3>
          <div className="space-y-2">
            {['remote', 'hybrid', 'on-site'].map((mode) => (
              <label key={mode} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={profile.preferences.workMode.includes(mode)}
                  onChange={() => handleWorkModeChange(mode)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 disabled:opacity-50 cursor-pointer"
                />
                <span className="text-sm text-gray-700 capitalize group-hover:text-gray-900">{mode}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Expected Salary with Slider */}
      <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Expected Salary (INR)</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Range:</span>
            <span className="font-semibold text-gray-900">
              ₹{salaryRange[0].toLocaleString()} - ₹{salaryRange[1].toLocaleString()}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Minimum</label>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={salaryRange[0]}
                onChange={(e) => handleSalaryChange(e, 'min')}
                disabled={!isEditing}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                style={{
                  background: isEditing ? `linear-gradient(to right, #2563eb 0%, #2563eb ${(salaryRange[0] / 100000) * 100}%, #e5e7eb ${(salaryRange[0] / 100000) * 100}%, #e5e7eb 100%)` : '#e5e7eb'
                }}
              />
              <span className="text-xs text-gray-500">₹{salaryRange[0].toLocaleString()}</span>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Maximum</label>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={salaryRange[1]}
                onChange={(e) => handleSalaryChange(e, 'max')}
                disabled={!isEditing}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                style={{
                  background: isEditing ? `linear-gradient(to right, #2563eb 0%, #2563eb ${(salaryRange[1] / 100000) * 100}%, #e5e7eb ${(salaryRange[1] / 100000) * 100}%, #e5e7eb 100%)` : '#e5e7eb'
                }}
              />
              <span className="text-xs text-gray-500">₹{salaryRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferred Locations */}
      <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Preferred Locations</h3>
          </div>
          {isEditing && (
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              <Plus size={14} />
              Add
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.preferences.preferredLocations.map((location, index) => (
            <span key={index} className="group relative px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
              {location}
              {isEditing && (
                <button
                  onClick={() => handleRemoveLocation(index)}
                  className="ml-1.5 text-blue-500 hover:text-blue-700"
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">Available From</h3>
            </div>
            {isEditing && (
              <button
                onClick={() => { setAvailableDate(profile.preferences.availableFrom); setShowDateModal(true); }}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit2 size={14} />
              </button>
            )}
          </div>
          <p className="text-gray-700 text-sm">{formatDate(profile.preferences.availableFrom)}</p>
        </div>

        <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Willing to Relocate</h3>
              <p className="text-xs text-gray-500">Toggle to change</p>
            </div>
            <Switch
              checked={profile.preferences.willingToRelocate}
              onCheckedChange={handleRelocationToggle}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      {/* Add Location Modal */}
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Location</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Mumbai, Delhi"
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Date Modal */}
      <Dialog open={showDateModal} onOpenChange={setShowDateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Available From</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={availableDate}
                onChange={(e) => setAvailableDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDateSave}
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

export default JobPreferencesSection;
