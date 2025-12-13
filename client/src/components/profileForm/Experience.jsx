import { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useFormData } from '../../pages/ProfileForm';

const Experience = () => {
  const { formData, updateFormData } = useFormData();
  const [experiences, setExperiences] = useState(formData.experience || []);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  // Update context whenever experiences change
  useEffect(() => {
    updateFormData('experience', experiences);
  }, [experiences]);

  const form = useForm({
    defaultValues: {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    },
  });

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    const experienceData = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      isCurrent: data.isCurrent,
      skills: [...skills],
    };
    setExperiences([...experiences, experienceData]);
    form.reset();
    setSkills([]);
    console.log('Experiences:', [...experiences, experienceData]);
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const watchIsCurrent = form.watch('isCurrent');

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-[28px] font-bold text-[#333] mb-2">Work Experience</h2>
        <p className="text-[14px] text-[#666]">
          Add your professional work experience
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            rules={{ required: 'Job title is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Senior Software Engineer, Marketing Manager" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            rules={{ required: 'Company name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Google, Infosys" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Bangalore, India" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isCurrent"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer">
                  I currently work here
                </FormLabel>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              rules={{ required: 'Start date is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date *</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      className="py-[13px] px-5 bg-[#eee] rounded-lg border-none text-[#333] font-medium text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              rules={{
                validate: (value) => {
                  if (watchIsCurrent) return true;
                  if (!value) return 'End date is required';
                  return true;
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date {!watchIsCurrent && '*'}</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                      disabled={watchIsCurrent}
                      className="py-[13px] px-5 bg-[#eee] rounded-lg border-none text-[#333] font-medium text-base disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows="5"
                    placeholder="Describe your responsibilities and achievements..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <FormLabel>Skills Used</FormLabel>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-white border-2 border-[#7494ec] text-[#7494ec] rounded-lg hover:bg-[#7494ec] hover:text-white transition-colors font-semibold"
              >
                Add
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-[#7494ec]/10 text-[#7494ec] px-3 py-1 rounded-full text-sm flex items-center gap-2 font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-[#7494ec] hover:text-[#6383db] font-bold text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-[#7494ec] rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)] border-none cursor-pointer text-base text-white font-semibold hover:bg-[#6383db] transition-colors"
          >
            Add Experience
          </button>
        </form>
      </Form>

      {experiences.length > 0 && (
        <div className="mt-8 pt-6 border-t-2 border-[#eee]">
          <h3 className="text-[22px] font-semibold text-[#7494ec] mb-4">Added Experience</h3>
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="border-2 border-[#eee] rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{exp.title}</h4>
                    <p className="text-gray-700 mt-1">{exp.company}</p>
                    {exp.location && (
                      <p className="text-gray-600 text-sm">{exp.location}</p>
                    )}
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Duration:</span>{' '}
                        {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                      </p>
                      {exp.description && (
                        <p className="mt-2 text-gray-700">{exp.description}</p>
                      )}
                      {exp.skills && exp.skills.length > 0 && (
                        <div className="mt-2">
                          <span className="font-medium">Skills:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {exp.skills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;
