import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { setProfile } from "@/store/slices/profileSlice";
import { logout } from "@/store/slices/authSlice";
import { profileService } from "@/lib/services/profileService";
import { authService } from "@/lib/services/authService";
import { SKILL_LEVELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { User, Briefcase, GraduationCap, Award, Plus, Pencil, Trash2, Save, MapPin, Phone, Globe, Linkedin, Github, X, Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sendingVerification, setSendingVerification] = useState(false);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await profileService.getMyProfile();
            const profileData = response.profile;
            dispatch(setProfile(profileData));
            reset({
                headline: profileData?.headline || "",
                summary: profileData?.summary || "",
                phone: profileData?.phone || "",
                location: profileData?.location || {},
                portfolio: profileData?.portfolio || {},
                skills: profileData?.skills || [],
            });
        } catch (err) {
            if (err.response?.status !== 404) {
                toast.error("Failed to load profile");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendVerificationEmail = async () => {
        setSendingVerification(true);
        try {
            await authService.sendVerificationEmail();
            toast.success("Verification email sent! Please check your inbox.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send verification email");
        } finally {
            setSendingVerification(false);
        }
    };

    const onSubmitBasic = async (data) => {
        setSaving(true);
        try {
            const payload = {
                headline: data.headline,
                summary: data.summary,
                phone: data.phone,
                location: data.location,
                portfolio: data.portfolio,
            };
            const response = profile
                ? await profileService.updateProfile(payload)
                : await profileService.createProfile(payload);
            dispatch(setProfile(response.profile));
            toast.success("Profile updated");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <Skeleton className="h-48" />
                <Skeleton className="h-64" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {!user?.isEmailVerified && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <div>
                            <p className="font-medium text-yellow-800">Email not verified</p>
                            <p className="text-sm text-yellow-700">Please verify your email to access all features.</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSendVerificationEmail}
                        disabled={sendingVerification}
                        className="border-yellow-400 text-yellow-800 hover:bg-yellow-100"
                    >
                        <Mail className="h-4 w-4 mr-2" />
                        {sendingVerification ? "Sending..." : "Send Verification Email"}
                    </Button>
                </div>
            )}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">Manage your professional information</p>
                {profile && (
                    <p className="text-sm text-muted-foreground mt-1">
                        Profile completion: <span className="font-medium">{profile.profileCompletion || 0}%</span>
                    </p>
                )}
            </div>

            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="basic">
                        <User className="h-4 w-4 mr-2" />
                        Basic Info
                    </TabsTrigger>
                    <TabsTrigger value="skills">
                        <Award className="h-4 w-4 mr-2" />
                        Skills
                    </TabsTrigger>
                    <TabsTrigger value="experience">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Experience
                    </TabsTrigger>
                    <TabsTrigger value="education">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Education
                    </TabsTrigger>
                    <TabsTrigger value="account">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Account
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmitBasic)} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" value={user?.name || ""} disabled className="bg-muted" />
                                        <p className="text-xs text-muted-foreground">Name is managed in account settings</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="headline">Professional Headline</Label>
                                        <Input
                                            id="headline"
                                            {...register("headline")}
                                            placeholder="e.g., Full Stack Developer | React Expert"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="summary">Summary</Label>
                                    <Textarea
                                        id="summary"
                                        {...register("summary")}
                                        rows={3}
                                        placeholder="Brief introduction about yourself"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="phone" {...register("phone")} className="pl-9" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="city" {...register("location.city")} className="pl-9" placeholder="City" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" {...register("location.state")} placeholder="State" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input id="country" {...register("location.country")} placeholder="Country" />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h4 className="font-medium">Social Links</h4>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="linkedin">LinkedIn</Label>
                                            <div className="relative">
                                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input id="linkedin" {...register("portfolio.linkedin", { pattern: { value: /^https?:\/\/.+/, message: "Please enter a valid URL starting with http:// or https://" } })} className="pl-9" placeholder="URL" />
                                            </div>
                                            {errors.portfolio?.linkedin && <p className="text-sm text-red-500">{errors.portfolio.linkedin.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="github">GitHub</Label>
                                            <div className="relative">
                                                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input id="github" {...register("portfolio.github")} className="pl-9" placeholder="URL" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="website">Portfolio Website</Label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input id="website" {...register("portfolio.website", { pattern: { value: /^https?:\/\/.+/, message: "Please enter a valid URL starting with http:// or https://" } })} className="pl-9" placeholder="URL" />
                                            </div>
                                            {errors.portfolio?.website && <p className="text-sm text-red-500">{errors.portfolio.website.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={saving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {saving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="skills">
                    <SkillsSection profile={profile} onUpdate={fetchProfile} />
                </TabsContent>

                <TabsContent value="experience">
                    <ExperienceSection profile={profile} onUpdate={fetchProfile} />
                </TabsContent>

                <TabsContent value="education">
                    <EducationSection profile={profile} onUpdate={fetchProfile} />
                </TabsContent>

                <TabsContent value="account">
                    <AccountSection />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function SkillsSection({ profile, onUpdate }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const { register, handleSubmit, reset, setValue, watch } = useForm();

    const openAdd = () => {
        reset({ name: "", level: "intermediate", yearsOfExperience: 0 });
        setEditing(null);
        setDialogOpen(true);
    };

    const openEdit = (skill, idx) => {
        reset(skill);
        setEditing(idx);
        setDialogOpen(true);
    };

    const onSubmit = async (data) => {
        setSaving(true);
        try {
            const skills = [...(profile?.skills || [])];
            const skillData = {
                name: data.name,
                level: data.level,
                yearsOfExperience: Number(data.yearsOfExperience) || 0,
            };

            if (editing !== null) {
                skills[editing] = skillData;
            } else {
                if (skills.some(s => s.name.toLowerCase() === skillData.name.toLowerCase())) {
                    toast.error("Skill already exists");
                    setSaving(false);
                    return;
                }
                skills.push(skillData);
            }
            await profileService.updateProfile({ skills });
            toast.success(editing !== null ? "Skill updated" : "Skill added");
            setDialogOpen(false);
            onUpdate();
        } catch (err) {
            toast.error("Failed to save skill");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (idx) => {
        try {
            const skills = [...(profile?.skills || [])];
            skills.splice(idx, 1);
            await profileService.updateProfile({ skills });
            toast.success("Skill removed");
            onUpdate();
        } catch (err) {
            toast.error("Failed to delete skill");
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <Button size="sm" onClick={openAdd}>
                    <Plus className="h-4 w-4 mr-1" /> Add Skill
                </Button>
            </CardHeader>
            <CardContent>
                {(profile?.skills || []).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, idx) => (
                            <Badge
                                key={idx}
                                variant="secondary"
                                className="gap-2 py-2 px-3 cursor-pointer hover:bg-secondary/80"
                                onClick={() => openEdit(skill, idx)}
                            >
                                <span>{skill.name}</span>
                                <span className="text-xs text-muted-foreground">({skill.level})</span>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleDelete(idx); }}
                                    className="ml-1 hover:bg-background rounded"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-6">No skills added yet</p>
                )}

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editing !== null ? "Edit" : "Add"} Skill</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="skillName">Skill Name *</Label>
                                <Input id="skillName" {...register("name", { required: true })} placeholder="e.g., React, Python" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="level">Proficiency Level</Label>
                                <Select
                                    value={watch("level") || "intermediate"}
                                    onValueChange={(value) => setValue("level", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SKILL_LEVELS.map((level) => (
                                            <SelectItem key={level.value} value={level.value}>
                                                {level.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                                <Input
                                    id="yearsOfExperience"
                                    type="number"
                                    min="0"
                                    max="50"
                                    {...register("yearsOfExperience")}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}

function ExperienceSection({ profile, onUpdate }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const { register, handleSubmit, reset, watch, setValue } = useForm();

    const openAdd = () => {
        reset({});
        setEditing(null);
        setDialogOpen(true);
    };

    const openEdit = (exp, idx) => {
        reset({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate).toISOString().split("T")[0] : "",
            endDate: exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : "",
        });
        setEditing(idx);
        setDialogOpen(true);
    };

    const onSubmit = async (data) => {
        setSaving(true);
        try {
            const experience = [...(profile?.experience || [])];
            const expData = {
                title: data.title,
                company: data.company,
                location: data.location,
                startDate: data.startDate,
                endDate: data.isCurrent ? null : data.endDate,
                isCurrent: data.isCurrent || false,
                description: data.description,
            };

            if (editing !== null) {
                experience[editing] = expData;
            } else {
                experience.push(expData);
            }
            await profileService.updateProfile({ experience });
            toast.success(editing !== null ? "Experience updated" : "Experience added");
            setDialogOpen(false);
            onUpdate();
        } catch (err) {
            toast.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (idx) => {
        try {
            const experience = [...(profile?.experience || [])];
            experience.splice(idx, 1);
            await profileService.updateProfile({ experience });
            toast.success("Experience removed");
            onUpdate();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Work Experience</CardTitle>
                <Button size="sm" onClick={openAdd}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
            </CardHeader>
            <CardContent>
                {(profile?.experience || []).length > 0 ? (
                    <div className="space-y-4">
                        {profile.experience.map((exp, idx) => (
                            <div key={idx} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold">{exp.title}</h4>
                                        <p className="text-muted-foreground">{exp.company}</p>
                                        {exp.location && <p className="text-sm text-muted-foreground">{exp.location}</p>}
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(exp.startDate)} - {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                                        </p>
                                        {exp.description && <p className="mt-2 text-sm">{exp.description}</p>}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(exp, idx)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(idx)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-6">No experience added yet</p>
                )}

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editing !== null ? "Edit" : "Add"} Experience</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title *</Label>
                                <Input id="title" {...register("title", { required: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company *</Label>
                                <Input id="company" {...register("company", { required: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expLocation">Location</Label>
                                <Input id="expLocation" {...register("location")} placeholder="City, Country" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date *</Label>
                                    <Input id="startDate" type="date" {...register("startDate", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input id="endDate" type="date" {...register("endDate")} disabled={watch("isCurrent")} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="isCurrent"
                                    checked={watch("isCurrent")}
                                    onCheckedChange={(checked) => setValue("isCurrent", checked)}
                                />
                                <Label htmlFor="isCurrent">Currently working here</Label>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" {...register("description")} rows={3} />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}

function EducationSection({ profile, onUpdate }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const openAdd = () => {
        reset({});
        setEditing(null);
        setDialogOpen(true);
    };

    const openEdit = (edu, idx) => {
        reset({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : "",
            endDate: edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : "",
        });
        setEditing(idx);
        setDialogOpen(true);
    };

    const onSubmit = async (data) => {
        setSaving(true);
        try {
            const education = [...(profile?.education || [])];
            const eduData = {
                degree: data.degree,
                institution: data.institution,
                field: data.field,
                startDate: data.startDate,
                endDate: data.endDate,
                grade: data.grade,
            };

            if (editing !== null) {
                education[editing] = eduData;
            } else {
                education.push(eduData);
            }
            await profileService.updateProfile({ education });
            toast.success(editing !== null ? "Education updated" : "Education added");
            setDialogOpen(false);
            onUpdate();
        } catch (err) {
            toast.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (idx) => {
        try {
            const education = [...(profile?.education || [])];
            education.splice(idx, 1);
            await profileService.updateProfile({ education });
            toast.success("Education removed");
            onUpdate();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Education</CardTitle>
                <Button size="sm" onClick={openAdd}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
            </CardHeader>
            <CardContent>
                {(profile?.education || []).length > 0 ? (
                    <div className="space-y-4">
                        {profile.education.map((edu, idx) => (
                            <div key={idx} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h4>
                                        <p className="text-muted-foreground">{edu.institution}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : "Present"}
                                        </p>
                                        {edu.grade && <p className="text-sm text-muted-foreground">Grade: {edu.grade}</p>}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(edu, idx)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(idx)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-6">No education added yet</p>
                )}

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editing !== null ? "Edit" : "Add"} Education</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="institution">Institution *</Label>
                                <Input id="institution" {...register("institution", { required: true })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="degree">Degree *</Label>
                                    <Input id="degree" {...register("degree", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="field">Field of Study</Label>
                                    <Input id="field" {...register("field")} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input id="startDate" type="date" {...register("startDate")} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input id="endDate" type="date" {...register("endDate")} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="grade">Grade/GPA (Optional)</Label>
                                <Input id="grade" {...register("grade")} placeholder="e.g., 3.8 GPA" />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}

function AccountSection() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const handleDeleteAccount = async () => {
        if (confirmText !== "DELETE") return;
        setDeleting(true);
        try {
            await authService.deleteAccount();
            toast.success("Account deleted successfully");
            dispatch(logout());
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete account");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border border-destructive/30 rounded-lg bg-destructive/5">
                    <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                        Once you delete your account, there is no going back. This will permanently delete your profile,
                        applications, and all associated data.
                    </p>
                    <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                    </Button>
                </div>

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove all your data.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <p className="text-sm">
                                To confirm, type <span className="font-bold">DELETE</span> below:
                            </p>
                            <Input
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="Type DELETE to confirm"
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={confirmText !== "DELETE" || deleting}
                            >
                                {deleting ? "Deleting..." : "Delete Account"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
