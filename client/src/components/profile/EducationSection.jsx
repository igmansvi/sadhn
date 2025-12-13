import React, { useState, Fragment } from 'react';
import { GraduationCap, Edit2, Trash2, Plus } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

const EducationModal = ({ isOpen, onClose, onSave, title, formData, setFormData }) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-30" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
              <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
                {title}
              </Dialog.Title>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., B.Tech in Computer Science"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., University Name"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade/CGPA</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 8.5 CGPA"
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
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

const EducationSection = ({ profile, updateEducation, deleteEducation, addEducation }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    field: '',
    startDate: '',
    endDate: '',
    grade: ''
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(profile.education[index]);
    setIsEditOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      degree: '',
      institution: '',
      field: '',
      startDate: '',
      endDate: '',
      grade: ''
    });
    setIsAddOpen(true);
  };

  const handleSaveEdit = () => {
    updateEducation(editIndex, formData);
    setIsEditOpen(false);
  };

  const handleSaveAdd = () => {
    addEducation(formData);
    setIsAddOpen(false);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      deleteEducation(index);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Education</h2>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus size={14} />
          Add Education
        </button>
      </div>

      <div className="space-y-3">
        {profile.education.map((edu, index) => (
          <div key={index} className="rounded-xl border border-gray-200 shadow-sm bg-white p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex gap-3 flex-1">
                <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{edu.institution}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span>{edu.field}</span>
                    <span>•</span>
                    <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                      {edu.grade}
                    </span>
                  </div>
                </div>
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
          </div>
        ))}
      </div>

      <EducationModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Education"
        formData={formData}
        setFormData={setFormData}
      />

      <EducationModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleSaveAdd}
        title="Add Education"
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default EducationSection;
