export const ROLES = {
  LEARNER: "learner",
  EMPLOYER: "employer",
  ADMIN: "admin",
};

export const ROLES_LIST = [
  { value: "learner", label: "Learner" },
  { value: "employer", label: "Employer" },
  { value: "admin", label: "Admin" },
];

export const JOB_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  CLOSED: "closed",
  ARCHIVED: "archived",
};

export const JOB_STATUS_LIST = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "archived", label: "Archived" },
];

export const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

export const WORK_MODES = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
];

export const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
  { value: "executive", label: "Executive" },
];

export const APPLICATION_STATUS = {
  APPLIED: "applied",
  REVIEWING: "reviewing",
  SHORTLISTED: "shortlisted",
  INTERVIEW_SCHEDULED: "interview-scheduled",
  INTERVIEWED: "interviewed",
  OFFERED: "offered",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
  ACCEPTED: "accepted",
};

export const APPLICATION_STATUS_LIST = [
  { value: "applied", label: "Applied" },
  { value: "reviewing", label: "Under Review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview-scheduled", label: "Interview Scheduled" },
  { value: "interviewed", label: "Interviewed" },
  { value: "offered", label: "Offered" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "accepted", label: "Accepted" },
];

export const APPLICATION_STATUS_LABELS = {
  applied: { label: "Applied", color: "bg-blue-100 text-blue-800" },
  reviewing: { label: "Under Review", color: "bg-yellow-100 text-yellow-800" },
  shortlisted: { label: "Shortlisted", color: "bg-purple-100 text-purple-800" },
  "interview-scheduled": {
    label: "Interview Scheduled",
    color: "bg-indigo-100 text-indigo-800",
  },
  interviewed: { label: "Interviewed", color: "bg-cyan-100 text-cyan-800" },
  offered: { label: "Offered", color: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
  withdrawn: { label: "Withdrawn", color: "bg-gray-100 text-gray-800" },
  accepted: { label: "Accepted", color: "bg-emerald-100 text-emerald-800" },
};

export const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

export const ARTICLE_CATEGORIES = [
  { value: "career-advice", label: "Career Advice" },
  { value: "industry-trends", label: "Industry Trends" },
  { value: "skill-development", label: "Skill Development" },
  { value: "interview-tips", label: "Interview Tips" },
  { value: "workplace-culture", label: "Workplace Culture" },
  { value: "technology", label: "Technology" },
  { value: "job-market", label: "Job Market" },
  { value: "other", label: "Other" },
];

export const NEWS_CATEGORIES = [
  { value: "announcement", label: "Announcement" },
  { value: "update", label: "Platform Update" },
  { value: "policy", label: "Policy" },
  { value: "event", label: "Event" },
  { value: "achievement", label: "Achievement" },
  { value: "general", label: "General" },
];

export const NEWS_PRIORITIES = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const PROGRAM_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export const PROGRAM_CATEGORIES = [
  { value: "programming", label: "Programming" },
  { value: "web-development", label: "Web Development" },
  { value: "data-science", label: "Data Science" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "cloud-computing", label: "Cloud Computing" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "devops", label: "DevOps" },
  { value: "design", label: "Design" },
  { value: "business", label: "Business" },
  { value: "marketing", label: "Marketing" },
  { value: "soft-skills", label: "Soft Skills" },
  { value: "other", label: "Other" },
];

export const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
];

export const LANGUAGE_PROFICIENCY = [
  { value: "basic", label: "Basic" },
  { value: "conversational", label: "Conversational" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" },
];

export const AVAILABILITY_STATUS = [
  { value: "available", label: "Available" },
  { value: "open", label: "Open to Opportunities" },
  { value: "not-looking", label: "Not Looking" },
  { value: "employed", label: "Employed" },
];
