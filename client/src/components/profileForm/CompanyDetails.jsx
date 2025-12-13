import React from 'react';
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

const CompanyDetails = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      industry: '',
      size: '',
      website: '',
      description: '',
    },
  });

  const onSubmit = (data) => {
    const companyData = {
      ...data,
    };
    console.log('Company Details:', companyData);
    // Here you would typically send this to your backend
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-[28px] font-bold text-[#333] mb-2">Company Details</h2>
        <p className="text-[14px] text-[#666]">
          Tell us about your company
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Tech Solutions Inc."
                    {...field}
                    className="py-[13px] px-5 bg-[#eee] rounded-lg border-none text-[#333] font-medium placeholder:text-[#888]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Information Technology, Healthcare, Finance"
                    {...field}
                    className="py-[13px] px-5 bg-[#eee] rounded-lg border-none text-[#333] font-medium placeholder:text-[#888]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Size</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full py-[13px] px-5 bg-[#eee] rounded-lg border-none outline-none text-[#333] font-medium"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </FormControl>
                <FormDescription>
                  Select the number of employees in your company
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Website</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://www.yourcompany.com"
                    {...field}
                    className="py-[13px] px-5 bg-[#eee] rounded-lg border-none text-[#333] font-medium placeholder:text-[#888]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Description</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows="6"
                    placeholder="Describe your company, its mission, values, and what makes it unique..."
                    className="w-full py-[13px] px-5 bg-[#eee] rounded-lg border-none outline-none text-[#333] font-medium placeholder:text-[#888] resize-none"
                  />
                </FormControl>
                <FormDescription>
                  Provide a brief overview of your company
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="w-full h-12 bg-[#7494ec] rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)] border-none cursor-pointer text-base text-white font-semibold hover:bg-[#6383db] transition-colors"
          >
            Save Company Details
          </button>
        </form>
      </Form>
    </div>
  );
};

export default CompanyDetails;
