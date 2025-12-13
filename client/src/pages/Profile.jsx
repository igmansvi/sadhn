import { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/profile/Sidebar';
import ProfileHeader from '../components/profile/ProfileHeader';
import OverviewSection from '../components/profile/OverviewSection';
import SkillsSection from '../components/profile/SkillsSection';
import EducationSection from '../components/profile/EducationSection';
import JobPreferencesSection from '../components/profile/JobPreferencesSection';
import ActivitySection from '../components/profile/ActivitySection';
import SettingsSection from '../components/profile/SettingsSection';

const initialProfileData = {
  "user": "67a1b9c52f9a1f0001abc123",
  "name": "Kamakshi Aggarwal",
  "email": "kamakshi.agg@example.com",
  "avatar": "",
  "profileType": "learner",
  "headline": "MERN Stack Developer | Passionate About Building Scalable Web Apps",
  "summary": "Motivated learner with strong foundational skills in MERN stack. Passionate about developing clean UI, solving problems, and completing real-world projects. Seeking internship opportunities to grow skills and contribute to impactful products.",
  "location": {
    "city": "Gurgaon",
    "state": "Haryana",
    "country": "India"
  },
  "phone": "+91 9876543210",
  "skills": [
    {
      "name": "JavaScript",
      "level": "advanced",
      "yearsOfExperience": 2,
      "lastUsed": "2024-11-01",
      "certifications": ["JavaScript Algorithms and Data Structures - freeCodeCamp"]
    },
    {
      "name": "React",
      "level": "intermediate",
      "yearsOfExperience": 1,
      "lastUsed": "2024-12-20",
      "certifications": ["Frontend Development with React - Infosys Springboard"]
    },
    {
      "name": "Node.js",
      "level": "intermediate",
      "yearsOfExperience": 1,
      "lastUsed": "2024-10-10",
      "certifications": []
    },
    {
      "name": "MongoDB",
      "level": "beginner",
      "yearsOfExperience": 0.5,
      "lastUsed": "2024-12-01",
      "certifications": ["MongoDB Basics – MongoDB University"]
    }
  ],
  "experience": [
    {
      "title": "Frontend Developer Intern",
      "company": "TechWave Pvt Ltd",
      "location": "Gurgaon, India",
      "startDate": "2024-06-01",
      "endDate": "2024-09-01",
      "isCurrent": false,
      "description": "Worked on developing UI components, improving responsiveness, and integrating frontend with backend APIs.",
      "skills": ["HTML", "CSS", "React", "JavaScript"]
    }
  ],
  "education": [
    {
      "degree": "B.Tech in Computer Science and Engineering",
      "institution": "Lovely Professional University",
      "field": "Computer Science",
      "startDate": "2022-08-01",
      "endDate": "2026-06-01",
      "grade": "8.5 CGPA"
    }
  ],
  "certifications": [
    {
      "name": "Infosys React Developer Certificate",
      "issuer": "Infosys Springboard",
      "issueDate": "2024-09-01",
      "expiryDate": null,
      "credentialId": "SP-REACT-92344",
      "url": "https://springboard.infosys.com/certificate/react"
    },
    {
      "name": "Full Stack Web Development",
      "issuer": "Udemy",
      "issueDate": "2023-03-10",
      "expiryDate": null,
      "credentialId": "UDEMY-FSWD-99181",
      "url": "https://udemy.com/certificate/fullstack"
    }
  ],
  "languages": [
    { "name": "English", "proficiency": "fluent" },
    { "name": "Hindi", "proficiency": "native" }
  ],
  "portfolio": {
    "website": "https://kamakshi.dev",
    "github": "https://github.com/Kamakshi0101",
    "linkedin": "https://www.linkedin.com/in/kamakshi-agg",
    "other": ["https://dribbble.com/kamakshi"]
  },
  "preferences": {
    "jobTypes": ["internship"],
    "workMode": ["remote", "hybrid"],
    "expectedSalary": {
      "min": 15000,
      "max": 30000,
      "currency": "INR"
    },
    "availableFrom": "2025-02-01",
    "willingToRelocate": true,
    "preferredLocations": ["Gurgaon", "Bangalore", "Noida"]
  },
  "resume": {
    "url": "https://drive.google.com/your-resume.pdf",
    "uploadedAt": "2024-12-05"
  },
  "profileCompletion": 82,
  "isPublic": true
};

const Profile = () => {
  const [profile, setProfile] = useState(initialProfileData);
  const [activeSection, setActiveSection] = useState('overview');
  
  const overviewRef = useRef(null);
  const skillsRef = useRef(null);
  const educationRef = useRef(null);
  const jobPreferencesRef = useRef(null);
  const activityRef = useRef(null);
  const settingsRef = useRef(null);

  const sectionRefs = {
    overview: overviewRef,
    skills: skillsRef,
    education: educationRef,
    jobPreferences: jobPreferencesRef,
    activity: activityRef,
    settings: settingsRef
  };

  const scrollToSection = (section) => {
    sectionRefs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updateSkill = (index, updatedSkill) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? updatedSkill : skill)
    }));
  };

  const deleteSkill = (index) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addSkill = (newSkill) => {
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateEducation = (index, updatedEducation) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => i === index ? updatedEducation : edu)
    }));
  };

  const deleteEducation = (index) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addEducation = (newEducation) => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updatePreferences = (updates) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates }
    }));
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader profile={profile} updateProfile={updateProfile} />
      
      <div className="grid grid-cols-[260px_1fr] max-w-7xl mx-auto gap-6 py-6 px-4">
        <Sidebar 
          activeSection={activeSection} 
          scrollToSection={scrollToSection}
          profile={profile}
        />
        
        <div className="space-y-4">
          <div id="overview" ref={overviewRef}>
            <OverviewSection profile={profile} />
          </div>
          
          <div id="skills" ref={skillsRef}>
            <SkillsSection 
              profile={profile} 
              updateSkill={updateSkill}
              deleteSkill={deleteSkill}
              addSkill={addSkill}
            />
          </div>
          
          <div id="education" ref={educationRef}>
            <EducationSection 
              profile={profile}
              updateEducation={updateEducation}
              deleteEducation={deleteEducation}
              addEducation={addEducation}
            />
          </div>
          
          <div id="jobPreferences" ref={jobPreferencesRef}>
            <JobPreferencesSection 
              profile={profile}
              updatePreferences={updatePreferences}
            />
          </div>
          
          <div id="activity" ref={activityRef}>
            <ActivitySection profile={profile} />
          </div>
          
          <div id="settings" ref={settingsRef}>
            <SettingsSection 
              profile={profile}
              updateProfile={updateProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
