import React from 'react';
import { Globe, Github, Linkedin, Link2, FileText, Award, Languages } from 'lucide-react';

const OverviewSection = ({ profile }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{profile.summary}</p>
      </div>

      <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Skills</h3>
        <div className="flex flex-wrap gap-2">
          {profile.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
        {profile.education.map((edu, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center shrink-0">
              <Award size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{edu.degree}</p>
              <p className="text-sm text-gray-600">{edu.institution}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)} • {edu.grade}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Experience */}
      {profile.experience.length > 0 && (
        <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience</h3>
          {profile.experience.map((exp, index) => (
            <div key={index}>
              <p className="font-semibold text-gray-900 text-sm">{exp.title}</p>
              <p className="text-sm text-gray-600">{exp.company} • {exp.location}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
              </p>
              <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {exp.skills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h3>
        <div className="space-y-3">
          {profile.certifications.slice(0, 2).map((cert, index) => (
            <div key={index} className="border-l-2 border-blue-600 pl-3">
              <p className="font-semibold text-gray-900 text-sm">{cert.name}</p>
              <p className="text-xs text-gray-600">{cert.issuer}</p>
              <p className="text-xs text-gray-500 mt-0.5">Issued: {formatDate(cert.issueDate)}</p>
              {cert.url && (
                <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                  <Link2 size={12} />
                  View Credential
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {profile.languages.map((lang, index) => (
            <div key={index} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2">
              <Languages size={14} className="text-gray-500" />
              <span className="font-medium text-gray-900 text-sm">{lang.name}</span>
              <span className="text-xs text-gray-500">({lang.proficiency})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio */}
      <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Links</h3>
        <div className="space-y-2">
          {profile.portfolio.website && (
            <a href={profile.portfolio.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
              <Globe size={16} />
              {profile.portfolio.website}
            </a>
          )}
          {profile.portfolio.github && (
            <a href={profile.portfolio.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
              <Github size={16} />
              {profile.portfolio.github}
            </a>
          )}
          {profile.portfolio.linkedin && (
            <a href={profile.portfolio.linkedin} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
              <Linkedin size={16} />
              {profile.portfolio.linkedin}
            </a>
          )}
          {profile.portfolio.other && profile.portfolio.other.map((link, index) => (
            <a key={index} href={link} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
              <Link2 size={16} />
              {link}
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Uploaded on {formatDate(profile.resume.uploadedAt)}
            </p>
          </div>
          <a
            href={profile.resume.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <FileText size={16} />
            View Resume
          </a>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
