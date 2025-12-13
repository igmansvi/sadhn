import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [certInput, setCertInput] = useState("");

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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Skills</h2>
        <p className="text-gray-600 mb-6">
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
                  <Input type="date" {...field} />
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
              <Button
                type="button"
                onClick={addCertification}
                variant="outline"
              >
                Add
              </Button>
            </div>
            {certifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
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
            Add Skill
          </Button>
        </form>
      </Form>

      {skills.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Added Skills</h3>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
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
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSkill(index)}
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

export default Skills;
