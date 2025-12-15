import { useState, useEffect } from 'react';
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
import { useFormData } from '../../pages/ProfileForm';

const Profile = () => {
  const { formData, updateFormData } = useFormData();
  const savedData = formData.profile || {};
  
  const [languages, setLanguages] = useState(savedData.languages || []);
  const [preferredLocations, setPreferredLocations] = useState(savedData.preferredLocations || []);
  const [otherLinks, setOtherLinks] = useState(savedData.otherLinks || []);
  const [languageName, setLanguageName] = useState('');
  const [languageProficiency, setLanguageProficiency] = useState('basic');
  const [locationInput, setLocationInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const form = useForm({
    defaultValues: savedData.profileType ? savedData : {
      profileType: 'learner',
      headline: '',
      summary: '',
      city: '',
      state: '',
      country: '',
      phone: '',
      website: '',
      github: '',
      linkedin: '',
      jobTypes: [],
      workMode: [],
      minSalary: '',
      maxSalary: '',
      currency: 'INR',
      availableFrom: '',
      willingToRelocate: false,
      isPublic: true,
    },
  });

  // Save form data to context whenever it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData('profile', {
        ...value,
        languages,
        preferredLocations,
        otherLinks,
      });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, languages, preferredLocations, otherLinks]);

  // Update arrays in context when they change
  useEffect(() => {
    const currentValues = form.getValues();
    updateFormData('profile', {
      ...currentValues,
      languages,
      preferredLocations,
      otherLinks,
    });
  }, [languages, preferredLocations, otherLinks]);

  const addLanguage = () => {
    if (languageName.trim()) {
      setLanguages([...languages, { name: languageName.trim(), proficiency: languageProficiency }]);
      setLanguageName('');
      setLanguageProficiency('basic');
    }
  };

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const addLocation = () => {
    if (locationInput.trim()) {
      setPreferredLocations([...preferredLocations, locationInput.trim()]);
      setLocationInput('');
    }
  };

  const removeLocation = (index) => {
    setPreferredLocations(preferredLocations.filter((_, i) => i !== index));
  };

  const addLink = () => {
    if (linkInput.trim()) {
      setOtherLinks([...otherLinks, linkInput.trim()]);
      setLinkInput('');
    }
  };

  const removeLink = (index) => {
    setOtherLinks(otherLinks.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    const profileData = {
      ...data,
      location: {
        city: data.city,
        state: data.state,
        country: data.country,
      },
      portfolio: {
        website: data.website,
        github: data.github,
        linkedin: data.linkedin,
        other: otherLinks,
      },
      languages,
      preferences: {
        jobTypes: data.jobTypes,
        workMode: data.workMode,
        expectedSalary: {
          min: data.minSalary ? Number(data.minSalary) : undefined,
          max: data.maxSalary ? Number(data.maxSalary) : undefined,
          currency: data.currency,
        },
        availableFrom: data.availableFrom ? new Date(data.availableFrom) : undefined,
        willingToRelocate: data.willingToRelocate,
        preferredLocations,
      },
      isPublic: data.isPublic,
    };
    console.log('Profile Data:', profileData);
    // Here you would typically send this to your backend
  };

  const profileType = form.watch('profileType');

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-[28px] font-bold text-[#333] mb-2">Profile Information</h2>
        <p className="text-[14px] text-[#666]">
          Complete your profile to get better opportunities
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Type */}
          <FormField
            control={form.control}
            name="profileType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Type *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full py-[13px] px-5 bg-[#eee] rounded-lg border-none outline-none text-[#333] font-medium"
                  >
                    <option value="learner">Learner</option>
                    <option value="employer">Employer</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Basic Information */}
          <div className="space-y-5">
            <h3 className="text-[20px] font-semibold text-[#7494ec] border-b-2 border-[#7494ec] pb-2">Basic Information</h3>
            
            <FormField
              control={form.control}
              name="headline"
              rules={{ maxLength: { value: 120, message: 'Headline must be 120 characters or less' } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Headline</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Full Stack Developer | React & Node.js Expert" 
                      {...field} 
                      maxLength={120}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/120 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              rules={{ maxLength: { value: 2000, message: 'Summary must be 2000 characters or less' } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Summary</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows="6"
                      placeholder="Tell us about yourself, your experience, and career goals..."
                      className="w-full py-[13px] px-5 bg-[#eee] rounded-lg border-none outline-none text-[#333] font-medium placeholder:text-[#888] resize-none"
                      maxLength={2000}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/2000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="string" 
                      placeholder="+91 1234567890" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Location */}
          <div className="space-y-5">
            <h3 className="text-[20px] font-semibold text-[#7494ec] border-b-2 border-[#7494ec] pb-2">Location</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bangalore" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Karnataka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Portfolio Links */}
          <div className="space-y-5">
            <h3 className="text-[20px] font-semibold text-[#7494ec] border-b-2 border-[#7494ec] pb-2">Portfolio & Social Links</h3>
            
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormControl>
                    <Input 
                      type="url" 
                      placeholder="https://linkedin.com/in/yourprofile" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Profile</FormLabel>
                  <FormControl>
                    <Input 
                      type="url" 
                      placeholder="https://github.com/yourusername" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Website</FormLabel>
                  <FormControl>
                    <Input 
                      type="url" 
                      placeholder="https://yourwebsite.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Other Links</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Add portfolio, blog, or other links"
                  type="url"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addLink();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addLink}
                  className="px-4 py-2 bg-white border-2 border-[#7494ec] text-[#7494ec] rounded-lg hover:bg-[#7494ec] hover:text-white transition-colors font-semibold"
                >
                  Add
                </button>
              </div>
              {otherLinks.length > 0 && (
                <div className="space-y-2 mt-2">
                  {otherLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex-1 text-sm">
                        {link}
                      </a>
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-5">
            <h3 className="text-[20px] font-semibold text-[#7494ec] border-b-2 border-[#7494ec] pb-2">Languages</h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  value={languageName}
                  onChange={(e) => setLanguageName(e.target.value)}
                  placeholder="Language name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addLanguage();
                    }
                  }}
                />
                <select
                  value={languageProficiency}
                  onChange={(e) => setLanguageProficiency(e.target.value)}
                  className="py-[13px] px-5 bg-[#eee] rounded-lg border-none outline-none text-[#333] font-medium"
                >
                  <option value="basic">Basic</option>
                  <option value="conversational">Conversational</option>
                  <option value="fluent">Fluent</option>
                  <option value="native">Native</option>
                </select>
                <button
                  type="button"
                  onClick={addLanguage}
                  className="px-4 py-2 bg-white border-2 border-[#7494ec] text-[#7494ec] rounded-lg hover:bg-[#7494ec] hover:text-white transition-colors font-semibold"
                >
                  Add Language
                </button>
              </div>
              {languages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {languages.map((lang, index) => (
                    <div
                      key={index}
                      className="bg-[#7494ec]/10 text-[#7494ec] px-3 py-1 rounded-full text-sm flex items-center gap-2 font-medium"
                    >
                      {lang.name} ({lang.proficiency})
                      <button
                        type="button"
                        onClick={() => removeLanguage(index)}
                        className="text-[#7494ec] hover:text-[#6383db] font-bold text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Job Preferences (for learners) */}
          {profileType === 'learner' && (
            <div className="space-y-5">
              <h3 className="text-[20px] font-semibold text-[#7494ec] border-b-2 border-[#7494ec] pb-2">Job Preferences</h3>
              
              <FormField
                control={form.control}
                name="jobTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Job Types</FormLabel>
                    <div className="space-y-2">
                      {['full-time', 'part-time', 'contract', 'internship', 'freelance'].map((type) => (
                        <label key={type} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={type}
                            checked={field.value?.includes(type)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(field.value || []), type]
                                : (field.value || []).filter((v) => v !== type);
                              field.onChange(newValue);
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="capitalize">{type.replace('-', ' ')}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Work Mode</FormLabel>
                    <div className="space-y-2">
                      {['remote', 'onsite', 'hybrid'].map((mode) => (
                        <label key={mode} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={mode}
                            checked={field.value?.includes(mode)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(field.value || []), mode]
                                : (field.value || []).filter((v) => v !== mode);
                              field.onChange(newValue);
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="capitalize">{mode}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Expected Salary Range</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="minSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Minimum" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Maximum" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full py-[13px] px-5 bg-[#eee] rounded-lg border-none outline-none text-[#333] font-medium"
                          >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="availableFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available From</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="py-[13px] px-5 bg-[#eee] rounded-lg border-none text-[#333] font-medium text-base"
                      />
                    </FormControl>
                    <FormDescription>
                      When can you start working?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="willingToRelocate"
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
                      Willing to relocate
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormLabel>Preferred Locations</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Add preferred city/location"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLocation();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addLocation}
                    className="px-4 py-2 bg-white border-2 border-[#7494ec] text-[#7494ec] rounded-lg hover:bg-[#7494ec] hover:text-white transition-colors font-semibold"
                  >
                    Add
                  </button>
                </div>
                {preferredLocations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {preferredLocations.map((location, index) => (
                      <div
                        key={index}
                        className="bg-[#7494ec]/10 text-[#7494ec] px-3 py-1 rounded-full text-sm flex items-center gap-2 font-medium"
                      >
                        {location}
                        <button
                          type="button"
                          onClick={() => removeLocation(index)}
                          className="text-[#7494ec] hover:text-[#6383db] font-bold text-lg leading-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Privacy & Resume */}
          <div className="space-y-5">
            <h3 className="text-[20px] font-semibold text-[#7494ec] border-b-2 border-[#7494ec] pb-2">Privacy & Resume</h3>
            
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-5 h-5 text-[#7494ec] border-gray-300 rounded focus:ring-[#7494ec]"
                    />
                  </FormControl>
                  <div className="flex-1">
                    <FormLabel className="!mt-0 cursor-pointer font-semibold">
                      Make my profile public
                    </FormLabel>
                    <FormDescription className="text-xs mt-1">
                      Allow employers to find and view your profile
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Upload Resume/CV</FormLabel>
              <div className="border-2 border-dashed border-[#7494ec] rounded-lg p-6 text-center hover:bg-[#7494ec]/5 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        alert('File size must be less than 5MB');
                        return;
                      }
                      setUploadedFile(file);
                      console.log('Resume uploaded:', file.name);
                      // Handle file upload here
                    }
                  }}
                  className="hidden"
                  id="resume-upload"
                />
                {!uploadedFile ? (
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <i className="bx bx-cloud-upload text-4xl text-[#7494ec]"></i>
                    <span className="text-[#333] font-medium">Click to upload your resume</span>
                    <span className="text-xs text-[#666]">Supported formats: PDF, DOC, DOCX (Max 5MB)</span>
                  </label>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3 bg-[#7494ec]/10 px-4 py-3 rounded-lg w-full max-w-md">
                      <i className="bx bxs-file-pdf text-3xl text-[#7494ec]"></i>
                      <div className="flex-1 text-left">
                        <p className="text-[#333] font-medium text-sm truncate">{uploadedFile.name}</p>
                        <p className="text-xs text-[#666]">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedFile(null)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <i className="bx bx-trash text-xl"></i>
                      </button>
                    </div>
                    <label
                      htmlFor="resume-upload"
                      className="text-[#7494ec] hover:underline cursor-pointer text-sm font-medium"
                    >
                      Upload a different file
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-[#7494ec] rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)] border-none cursor-pointer text-base text-white font-semibold hover:bg-[#6383db] transition-colors"
          >
            Save Profile
          </button>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
