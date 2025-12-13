import React, { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useFormData } from '../../pages/ProfileForm';

const Skills = () => {
  const { formData, updateFormData } = useFormData();
  const [skills, setSkills] = useState(formData.skills || []);
  const [certifications, setCertifications] = useState([]);
  const [certInput, setCertInput] = useState("");

  // Update context whenever skills change
  useEffect(() => {
    updateFormData('skills', skills);
  }, [skills]);

  const form = useForm({
    defaultValues: {
      name: "",
      level: "beginner",
      yearsOfExperience: 0,
      lastUsed: "",
      certifications: [],
    },
  });

  const addCertification = () => {
    if (certInput.trim()) {
      setCertifications([...certifications, certInput.trim()]);
      setCertInput("");
    }
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    const skillData = {
      ...data,
      certifications,
      yearsOfExperience: Number(data.yearsOfExperience),
      lastUsed: data.lastUsed ? new Date(data.lastUsed) : undefined,
    };
    setSkills([...skills, skillData]);
    form.reset();
    setCertifications([]);
    console.log("Skills:", [...skills, skillData]);
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-[28px] font-bold text-[#333] mb-2">Skills</h2>
        <p className="text-[14px] text-[#666]">
          Add your professional skills and expertise
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Skill name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., JavaScript, Python, Project Management"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            rules={{ required: "Skill level is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proficiency Level *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    placeholder="0"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  How many years have you worked with this skill?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastUsed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Used</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    className="py-[13px] px-5 bg-[#eee] rounded-lg border-none text-[#333] font-medium text-base"
                  />
                </FormControl>
                <FormDescription>
                  When did you last use this skill?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <FormLabel>Certifications</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Input
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  placeholder="Add certification name"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCertification();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addCertification}
                  className="px-4 bg-white border-2 border-[#7494ec] text-[#7494ec] rounded-lg hover:bg-[#7494ec] hover:text-white transition-colors font-semibold"
                >
                  Add
                </button>
              </div>
            </FormControl>
            <FormDescription>
              Enter the certifications related to this skill
            </FormDescription>

            {certifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="bg-[#7494ec]/10 text-[#7494ec] px-3 py-1 rounded-full text-sm flex items-center gap-2 font-medium"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
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
            Add Skill
          </button>
        </form>
      </Form>

      {skills.length > 0 && (
        <div className="mt-8 pt-6 border-t-2 border-[#eee]">
          <h3 className="text-[22px] font-semibold text-[#7494ec] mb-4">
            Added Skills
          </h3>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="border-2 border-[#eee] rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{skill.name}</h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Level:</span>{" "}
                        <span className="capitalize">{skill.level}</span>
                      </p>
                      {skill.yearsOfExperience > 0 && (
                        <p>
                          <span className="font-medium">Experience:</span>{" "}
                          {skill.yearsOfExperience} years
                        </p>
                      )}
                      {skill.lastUsed && (
                        <p>
                          <span className="font-medium">Last Used:</span>{" "}
                          {new Date(skill.lastUsed).toLocaleDateString()}
                        </p>
                      )}
                      {skill.certifications.length > 0 && (
                        <div className="mt-2">
                          <span className="font-medium">Certifications:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {skill.certifications.map((cert, certIndex) => (
                              <span
                                key={certIndex}
                                className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
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

export default Skills;
