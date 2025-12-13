import React, { useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const SkillModal = ({ isOpen, onClose, onSave, title, formData, setFormData }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., React"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={formData.yearsOfExperience}
            onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Used</label>
          <input
            type="date"
            value={formData.lastUsed}
            onChange={(e) => setFormData({ ...formData, lastUsed: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </DialogContent>
  </Dialog>
);

const SkillsSection = ({ profile, updateSkill, deleteSkill, addSkill }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    level: 'beginner',
    yearsOfExperience: 0,
    lastUsed: '',
    certifications: []
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'advanced':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700';
      case 'beginner':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(profile.skills[index]);
    setIsEditOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      level: 'beginner',
      yearsOfExperience: 0,
      lastUsed: new Date().toISOString().split('T')[0],
      certifications: []
    });
    setIsAddOpen(true);
  };

  const handleSaveEdit = () => {
    updateSkill(editIndex, formData);
    setIsEditOpen(false);
  };

  const handleSaveAdd = () => {
    addSkill(formData);
    setIsAddOpen(false);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      deleteSkill(index);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus size={14} />
          Add Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {profile.skills.map((skill, index) => (
          <div key={index} className="rounded-xl border border-gray-200 shadow-sm bg-white p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">{skill.name}</h3>
                <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(skill.level)}`}>
                  {skill.level}
                </span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-1 text-xs mt-3">
              <div className="flex items-center justify-between text-gray-600">
                <span>Experience:</span>
                <span className="font-medium text-gray-900">{skill.yearsOfExperience} years</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Last Used:</span>
                <span className="font-medium text-gray-900">{formatDate(skill.lastUsed)}</span>
              </div>
            </div>

            {skill.certifications && skill.certifications.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1.5">Certifications:</p>
                <div className="flex flex-wrap gap-1.5">
                  {skill.certifications.map((cert, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <SkillModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Skill"
        formData={formData}
        setFormData={setFormData}
      />

      <SkillModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleSaveAdd}
        title="Add Skill"
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default SkillsSection;
