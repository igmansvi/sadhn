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

const Education = () => {
  const { formData, updateFormData } = useFormData();
  const [educationList, setEducationList] = useState(formData.education || []);

  // Update context whenever education list changes
  useEffect(() => {
    updateFormData('education', educationList);
  }, [educationList]);

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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-[28px] font-bold text-[#333] mb-2">Education</h2>
        <p className="text-[14px] text-[#666]">
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
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

          <button
            type="submit"
            className="w-full h-12 bg-[#7494ec] rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)] border-none cursor-pointer text-base text-white font-semibold hover:bg-[#6383db] transition-colors"
          >
            Add Education
          </button>
        </form>
      </Form>

      {educationList.length > 0 && (
        <div className="mt-8 pt-6 border-t-2 border-[#eee]">
          <h3 className="text-[22px] font-semibold text-[#7494ec] mb-4">Added Educations</h3>
          <div className="space-y-4">
            {educationList.map((edu, index) => (
              <div
                key={index}
                className="border-2 border-[#eee] rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
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
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
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

export default Education;
