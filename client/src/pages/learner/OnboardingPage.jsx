import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setProfile } from "@/store/slices/profileSlice";
import { profileService } from "@/lib/services/profileService";
import {
    SKILL_LEVELS,
    EMPLOYMENT_TYPES,
    WORK_MODES,
    EXPERIENCE_LEVELS,
    LANGUAGE_PROFICIENCY,
} from "@/lib/constants";
import {
    User,
    Briefcase,
    GraduationCap,
    Award,
    MapPin,
    Target,
    ChevronRight,
    ChevronLeft,
    Plus,
    X,
    Check,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STEPS = [
    { id: 1, title: "Basic Info", icon: User },
    { id: 2, title: "Skills", icon: Award },
    { id: 3, title: "Experience", icon: Briefcase },
    { id: 4, title: "Education", icon: GraduationCap },
    { id: 5, title: "Preferences", icon: Target },
];

export default function OnboardingPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(1);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        headline: "",
        summary: "",
        phone: "",
        location: { city: "", state: "", country: "" },
        skills: [],
        experience: [],
        education: [],
        languages: [],
        portfolio: { website: "", github: "", linkedin: "" },
        preferences: {
            jobTypes: [],
            workMode: [],
            expectedSalary: { min: "", max: "", currency: "INR" },
            willingToRelocate: false,
            preferredLocations: [],
        },
    });

    const [tempSkill, setTempSkill] = useState({ name: "", level: "intermediate", yearsOfExperience: 0 });
    const [tempExperience, setTempExperience] = useState({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
    });
    const [tempEducation, setTempEducation] = useState({
        degree: "",
        institution: "",
        field: "",
        startDate: "",
        endDate: "",
    });
    const [tempLanguage, setTempLanguage] = useState({ name: "", proficiency: "conversational" });
    const [locationInput, setLocationInput] = useState("");

    const updateFormData = (field, value) => {
        setFormData((prev) => {
            const keys = field.split(".");
            if (keys.length === 1) {
                return { ...prev, [field]: value };
            }
            const newData = { ...prev };
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    const addSkill = () => {
        if (!tempSkill.name.trim()) return;
        if (formData.skills.some((s) => s.name.toLowerCase() === tempSkill.name.toLowerCase())) {
            toast.error("Skill already added");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            skills: [...prev.skills, { ...tempSkill }],
        }));
        setTempSkill({ name: "", level: "intermediate", yearsOfExperience: 0 });
    };

    const removeSkill = (index) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index),
        }));
    };

    const addExperience = () => {
        if (!tempExperience.title || !tempExperience.company) return;
        setFormData((prev) => ({
            ...prev,
            experience: [...prev.experience, { ...tempExperience }],
        }));
        setTempExperience({
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            isCurrent: false,
            description: "",
        });
    };

    const removeExperience = (index) => {
        setFormData((prev) => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index),
        }));
    };

    const addEducation = () => {
        if (!tempEducation.degree || !tempEducation.institution) return;
        setFormData((prev) => ({
            ...prev,
            education: [...prev.education, { ...tempEducation }],
        }));
        setTempEducation({
            degree: "",
            institution: "",
            field: "",
            startDate: "",
            endDate: "",
        });
    };

    const removeEducation = (index) => {
        setFormData((prev) => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index),
        }));
    };

    const addLanguage = () => {
        if (!tempLanguage.name.trim()) return;
        if (formData.languages.some((l) => l.name.toLowerCase() === tempLanguage.name.toLowerCase())) {
            toast.error("Language already added");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            languages: [...prev.languages, { ...tempLanguage }],
        }));
        setTempLanguage({ name: "", proficiency: "conversational" });
    };

    const removeLanguage = (index) => {
        setFormData((prev) => ({
            ...prev,
            languages: prev.languages.filter((_, i) => i !== index),
        }));
    };

    const addPreferredLocation = () => {
        if (!locationInput.trim()) return;
        if (formData.preferences.preferredLocations.includes(locationInput.trim())) return;
        updateFormData("preferences.preferredLocations", [
            ...formData.preferences.preferredLocations,
            locationInput.trim(),
        ]);
        setLocationInput("");
    };

    const removePreferredLocation = (loc) => {
        updateFormData(
            "preferences.preferredLocations",
            formData.preferences.preferredLocations.filter((l) => l !== loc)
        );
    };

    const toggleJobType = (type) => {
        const current = formData.preferences.jobTypes;
        if (current.includes(type)) {
            updateFormData("preferences.jobTypes", current.filter((t) => t !== type));
        } else {
            updateFormData("preferences.jobTypes", [...current, type]);
        }
    };

    const toggleWorkMode = (mode) => {
        const current = formData.preferences.workMode;
        if (current.includes(mode)) {
            updateFormData("preferences.workMode", current.filter((m) => m !== mode));
        } else {
            updateFormData("preferences.workMode", [...current, mode]);
        }
    };

    const validateStep = () => {
        switch (currentStep) {
            case 1:
                if (!formData.headline.trim()) {
                    toast.error("Please enter a professional headline");
                    return false;
                }
                return true;
            case 2:
                if (formData.skills.length === 0) {
                    toast.error("Please add at least one skill");
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;

        setSaving(true);
        try {
            const payload = {
                ...formData,
                profileType: "learner",
                preferences: {
                    ...formData.preferences,
                    expectedSalary: {
                        min: Number(formData.preferences.expectedSalary.min) || undefined,
                        max: Number(formData.preferences.expectedSalary.max) || undefined,
                        currency: formData.preferences.expectedSalary.currency,
                    },
                },
            };

            const response = await profileService.createProfile(payload);
            dispatch(setProfile(response.data));
            toast.success("Profile created successfully!");
            navigate("/learner/explore");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create profile");
        } finally {
            setSaving(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                    <div key={step.id} className="flex items-center">
                        <div
                            className={cn(
                                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                                isActive && "border-primary bg-primary text-primary-foreground",
                                isCompleted && "border-primary bg-primary text-primary-foreground",
                                !isActive && !isCompleted && "border-muted-foreground/30"
                            )}
                        >
                            {isCompleted ? (
                                <Check className="h-5 w-5" />
                            ) : (
                                <Icon className="h-5 w-5" />
                            )}
                        </div>
                        {index < STEPS.length - 1 && (
                            <div
                                className={cn(
                                    "w-12 h-0.5 mx-2",
                                    isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="headline">Professional Headline *</Label>
                <Input
                    id="headline"
                    value={formData.headline}
                    onChange={(e) => updateFormData("headline", e.target.value)}
                    placeholder="e.g., Full Stack Developer | React & Node.js Expert"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="summary">About You</Label>
                <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => updateFormData("summary", e.target.value)}
                    rows={4}
                    placeholder="Tell employers about yourself, your experience, and what you're looking for..."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                />
            </div>

            <div className="space-y-4">
                <Label>Location</Label>
                <div className="grid grid-cols-3 gap-4">
                    <Input
                        value={formData.location.city}
                        onChange={(e) => updateFormData("location.city", e.target.value)}
                        placeholder="City"
                    />
                    <Input
                        value={formData.location.state}
                        onChange={(e) => updateFormData("location.state", e.target.value)}
                        placeholder="State"
                    />
                    <Input
                        value={formData.location.country}
                        onChange={(e) => updateFormData("location.country", e.target.value)}
                        placeholder="Country"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <Label>Portfolio Links</Label>
                <div className="grid gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground w-20">LinkedIn</span>
                        <Input
                            value={formData.portfolio.linkedin}
                            onChange={(e) => updateFormData("portfolio.linkedin", e.target.value)}
                            placeholder="https://linkedin.com/in/yourprofile"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground w-20">GitHub</span>
                        <Input
                            value={formData.portfolio.github}
                            onChange={(e) => updateFormData("portfolio.github", e.target.value)}
                            placeholder="https://github.com/yourusername"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground w-20">Website</span>
                        <Input
                            value={formData.portfolio.website}
                            onChange={(e) => updateFormData("portfolio.website", e.target.value)}
                            placeholder="https://yourportfolio.com"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="space-y-4">
                <Label>Add Your Skills *</Label>
                <div className="flex gap-2">
                    <Input
                        value={tempSkill.name}
                        onChange={(e) => setTempSkill((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Skill name (e.g., React, Python)"
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    />
                    <Select
                        value={tempSkill.level}
                        onValueChange={(v) => setTempSkill((prev) => ({ ...prev, level: v }))}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SKILL_LEVELS.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="number"
                        min="0"
                        max="50"
                        className="w-24"
                        value={tempSkill.yearsOfExperience}
                        onChange={(e) =>
                            setTempSkill((prev) => ({ ...prev, yearsOfExperience: Number(e.target.value) }))
                        }
                        placeholder="Years"
                    />
                    <Button type="button" onClick={addSkill}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {formData.skills.length > 0 && (
                <div className="space-y-2">
                    <Label>Added Skills</Label>
                    <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="gap-2 py-1.5 px-3">
                                <span className="font-medium">{skill.name}</span>
                                <span className="text-muted-foreground">• {skill.level}</span>
                                {skill.yearsOfExperience > 0 && (
                                    <span className="text-muted-foreground">• {skill.yearsOfExperience}y</span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeSkill(index)}
                                    className="ml-1 hover:text-destructive"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4 pt-4 border-t">
                <Label>Languages</Label>
                <div className="flex gap-2">
                    <Input
                        value={tempLanguage.name}
                        onChange={(e) => setTempLanguage((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Language (e.g., English, Hindi)"
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                    />
                    <Select
                        value={tempLanguage.proficiency}
                        onValueChange={(v) => setTempLanguage((prev) => ({ ...prev, proficiency: v }))}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {LANGUAGE_PROFICIENCY.map((p) => (
                                <SelectItem key={p.value} value={p.value}>
                                    {p.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="button" onClick={addLanguage}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                {formData.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formData.languages.map((lang, index) => (
                            <Badge key={index} variant="outline" className="gap-2 py-1.5 px-3">
                                {lang.name} • {lang.proficiency}
                                <button
                                    type="button"
                                    onClick={() => removeLanguage(index)}
                                    className="ml-1 hover:text-destructive"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="space-y-4">
                <Label>Add Work Experience</Label>
                <div className="grid gap-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            value={tempExperience.title}
                            onChange={(e) =>
                                setTempExperience((prev) => ({ ...prev, title: e.target.value }))
                            }
                            placeholder="Job Title *"
                        />
                        <Input
                            value={tempExperience.company}
                            onChange={(e) =>
                                setTempExperience((prev) => ({ ...prev, company: e.target.value }))
                            }
                            placeholder="Company *"
                        />
                    </div>
                    <Input
                        value={tempExperience.location}
                        onChange={(e) =>
                            setTempExperience((prev) => ({ ...prev, location: e.target.value }))
                        }
                        placeholder="Location"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs">Start Date</Label>
                            <Input
                                type="date"
                                value={tempExperience.startDate}
                                onChange={(e) =>
                                    setTempExperience((prev) => ({ ...prev, startDate: e.target.value }))
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">End Date</Label>
                            <Input
                                type="date"
                                value={tempExperience.endDate}
                                onChange={(e) =>
                                    setTempExperience((prev) => ({ ...prev, endDate: e.target.value }))
                                }
                                disabled={tempExperience.isCurrent}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="isCurrent"
                            checked={tempExperience.isCurrent}
                            onCheckedChange={(checked) =>
                                setTempExperience((prev) => ({ ...prev, isCurrent: checked, endDate: "" }))
                            }
                        />
                        <Label htmlFor="isCurrent" className="text-sm">
                            I currently work here
                        </Label>
                    </div>
                    <Textarea
                        value={tempExperience.description}
                        onChange={(e) =>
                            setTempExperience((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Describe your role and achievements..."
                        rows={3}
                    />
                    <Button type="button" onClick={addExperience} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                    </Button>
                </div>
            </div>

            {formData.experience.length > 0 && (
                <div className="space-y-3">
                    <Label>Added Experience</Label>
                    {formData.experience.map((exp, index) => (
                        <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-medium">{exp.title}</h4>
                                <p className="text-sm text-muted-foreground">{exp.company}</p>
                                <p className="text-xs text-muted-foreground">
                                    {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeExperience(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-sm text-muted-foreground">
                You can skip this step and add experience later from your profile.
            </p>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <div className="space-y-4">
                <Label>Add Education</Label>
                <div className="grid gap-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            value={tempEducation.degree}
                            onChange={(e) =>
                                setTempEducation((prev) => ({ ...prev, degree: e.target.value }))
                            }
                            placeholder="Degree *"
                        />
                        <Input
                            value={tempEducation.institution}
                            onChange={(e) =>
                                setTempEducation((prev) => ({ ...prev, institution: e.target.value }))
                            }
                            placeholder="Institution *"
                        />
                    </div>
                    <Input
                        value={tempEducation.field}
                        onChange={(e) =>
                            setTempEducation((prev) => ({ ...prev, field: e.target.value }))
                        }
                        placeholder="Field of Study"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs">Start Date</Label>
                            <Input
                                type="date"
                                value={tempEducation.startDate}
                                onChange={(e) =>
                                    setTempEducation((prev) => ({ ...prev, startDate: e.target.value }))
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">End Date</Label>
                            <Input
                                type="date"
                                value={tempEducation.endDate}
                                onChange={(e) =>
                                    setTempEducation((prev) => ({ ...prev, endDate: e.target.value }))
                                }
                            />
                        </div>
                    </div>
                    <Button type="button" onClick={addEducation} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                    </Button>
                </div>
            </div>

            {formData.education.length > 0 && (
                <div className="space-y-3">
                    <Label>Added Education</Label>
                    {formData.education.map((edu, index) => (
                        <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-medium">{edu.degree}</h4>
                                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                                {edu.field && (
                                    <p className="text-xs text-muted-foreground">{edu.field}</p>
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeEducation(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-sm text-muted-foreground">
                You can skip this step and add education later from your profile.
            </p>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-6">
            <div className="space-y-4">
                <Label>Preferred Job Types</Label>
                <div className="flex flex-wrap gap-2">
                    {EMPLOYMENT_TYPES.map((type) => (
                        <Badge
                            key={type.value}
                            variant={formData.preferences.jobTypes.includes(type.value) ? "default" : "outline"}
                            className="cursor-pointer py-1.5 px-3"
                            onClick={() => toggleJobType(type.value)}
                        >
                            {type.label}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <Label>Preferred Work Mode</Label>
                <div className="flex flex-wrap gap-2">
                    {WORK_MODES.map((mode) => (
                        <Badge
                            key={mode.value}
                            variant={formData.preferences.workMode.includes(mode.value) ? "default" : "outline"}
                            className="cursor-pointer py-1.5 px-3"
                            onClick={() => toggleWorkMode(mode.value)}
                        >
                            {mode.label}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <Label>Expected Salary (Annual)</Label>
                <div className="grid grid-cols-3 gap-4">
                    <Input
                        type="number"
                        value={formData.preferences.expectedSalary.min}
                        onChange={(e) => updateFormData("preferences.expectedSalary.min", e.target.value)}
                        placeholder="Min"
                    />
                    <Input
                        type="number"
                        value={formData.preferences.expectedSalary.max}
                        onChange={(e) => updateFormData("preferences.expectedSalary.max", e.target.value)}
                        placeholder="Max"
                    />
                    <Select
                        value={formData.preferences.expectedSalary.currency}
                        onValueChange={(v) => updateFormData("preferences.expectedSalary.currency", v)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INR">INR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4">
                <Label>Preferred Locations</Label>
                <div className="flex gap-2">
                    <Input
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        placeholder="Add a city (e.g., Bangalore, Mumbai)"
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPreferredLocation())}
                    />
                    <Button type="button" onClick={addPreferredLocation}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                {formData.preferences.preferredLocations.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formData.preferences.preferredLocations.map((loc) => (
                            <Badge key={loc} variant="secondary" className="gap-1">
                                <MapPin className="h-3 w-3" />
                                {loc}
                                <button
                                    type="button"
                                    onClick={() => removePreferredLocation(loc)}
                                    className="ml-1 hover:text-destructive"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Checkbox
                    id="relocate"
                    checked={formData.preferences.willingToRelocate}
                    onCheckedChange={(checked) => updateFormData("preferences.willingToRelocate", checked)}
                />
                <Label htmlFor="relocate" className="text-sm">
                    I am willing to relocate for the right opportunity
                </Label>
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return renderStep1();
            case 2:
                return renderStep2();
            case 3:
                return renderStep3();
            case 4:
                return renderStep4();
            case 5:
                return renderStep5();
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
                    <p className="text-muted-foreground">
                        Let's set up your job profile to find the best matches for you
                    </p>
                </div>

                {renderStepIndicator()}

                <Card>
                    <CardHeader>
                        <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                        <CardDescription>
                            Step {currentStep} of {STEPS.length}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderCurrentStep()}

                        <div className="flex justify-between mt-8 pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>

                            {currentStep < STEPS.length ? (
                                <Button type="button" onClick={nextStep}>
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button type="button" onClick={handleSubmit} disabled={saving}>
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating Profile...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4 mr-2" />
                                            Complete Profile
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
