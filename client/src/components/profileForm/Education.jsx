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

const Education = () => {
  const [educationList, setEducationList] = useState([]);

  const form = useForm({
    defaultValues: {
      degree: '',
      institution: '',
      field: '',
      startDate: '',
      endDate: '',
      grade: '',
    },
  });

  const onSubmit = (data) => {
    const educationData = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    };
    setEducationList([...educationList, educationData]);
    form.reset();
    console.log('Education:', [...educationList, educationData]);
  };

  const removeEducation = (index) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Education</h2>
        <p className="text-gray-600 mb-6">
          Add your educational background and qualifications
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="degree"
            rules={{ required: 'Degree is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Bachelor of Science, Master of Business Administration" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="institution"
            rules={{ required: 'Institution is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., University of Delhi, IIT Bombay" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="field"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field of Study</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Computer Science, Business Administration" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave empty if currently studying
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade/CGPA</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., 3.8/4.0, First Class, 85%" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Add Education
          </Button>
        </form>
      </Form>

      {educationList.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Added Education</h3>
          <div className="space-y-4">
            {educationList.map((edu, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{edu.degree}</h4>
                    <p className="text-gray-700 mt-1">{edu.institution}</p>
                    {edu.field && (
                      <p className="text-gray-600 mt-1 text-sm">
                        <span className="font-medium">Field:</span> {edu.field}
                      </p>
                    )}
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      {(edu.startDate || edu.endDate) && (
                        <p>
                          <span className="font-medium">Duration:</span>{' '}
                          {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          {' - '}
                          {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                        </p>
                      )}
                      {edu.grade && (
                        <p>
                          <span className="font-medium">Grade:</span> {edu.grade}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEducation(index)}
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

export default Education;
