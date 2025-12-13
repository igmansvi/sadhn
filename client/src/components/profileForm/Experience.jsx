import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Work Experience</h2>
        <p className="text-gray-600 mb-6">
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
                    <Input type="date" {...field} />
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
              <Button
                type="button"
                onClick={addSkill}
                variant="outline"
              >
                Add
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Add Experience
          </Button>
        </form>
      </Form>

      {experiences.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Added Experience</h3>
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
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
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeExperience(index)}
                  >
                    Remove
                  </Button>
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
