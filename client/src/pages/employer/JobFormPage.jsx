import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { jobService } from "@/lib/services/jobService";
import { EMPLOYMENT_TYPES, WORK_MODES, EXPERIENCE_LEVELS, JOB_STATUS_LIST } from "@/lib/constants";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import { toast } from "sonner";

export default function JobFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [benefitInput, setBenefitInput] = useState("");

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            requiredSkills: [],
            benefits: [],
            responsibilities: [],
            qualifications: [],
        },
    });

    useEffect(() => {
        if (isEdit) {
            fetchJob();
        }
    }, [id]);

    const fetchJob = async () => {
        try {
            const response = await jobService.getJobById(id);
            const job = response.data;
            reset({
                ...job,
                deadline: job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : "",
            });
        } catch (err) {
            toast.error("Failed to load job");
            navigate("/employer/jobs");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setSaving(true);
        try {
            const payload = {
                ...data,
                requiredSkills: (data.requiredSkills || []).map((skill) =>
                    typeof skill === "string" ? { name: skill, level: "intermediate" } : skill
                ),
                salary: {
                    min: Number(data.salaryMin) || undefined,
                    max: Number(data.salaryMax) || undefined,
                    currency: data.salaryCurrency || "USD",
                },
                location: {
                    city: data.locationCity,
                    state: data.locationState,
                    country: data.locationCountry,
                },
            };
            delete payload.salaryMin;
            delete payload.salaryMax;
            delete payload.salaryCurrency;
            delete payload.locationCity;
            delete payload.locationState;
            delete payload.locationCountry;

            if (isEdit) {
                await jobService.updateJob(id, payload);
                toast.success("Job updated");
            } else {
                await jobService.createJob(payload);
                toast.success("Job created");
            }
            navigate("/employer/jobs");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save job");
        } finally {
            setSaving(false);
        }
    };

    const addToArray = (field, value, setInput) => {
        if (!value.trim()) return;
        const current = watch(field) || [];
        const exists = current.some((item) =>
            typeof item === "string" ? item === value.trim() : item.name === value.trim()
        );
        if (exists) {
            toast.error("Already added");
            return;
        }
        setValue(field, [...current, value.trim()]);
        setInput("");
    };

    const removeFromArray = (field, value) => {
        const current = watch(field) || [];
        setValue(field, current.filter((v) => {
            if (typeof v === "string" && typeof value === "string") return v !== value;
            if (typeof v === "object" && typeof value === "object") return v.name !== value.name;
            if (typeof v === "object" && typeof value === "string") return v.name !== value;
            return v !== value;
        }));
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <Skeleton className="h-8 w-48 mb-6" />
                <Skeleton className="h-150" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Button variant="ghost" onClick={() => navigate("/employer/jobs")} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? "Edit Job" : "Post New Job"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-medium">Basic Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="title">Job Title *</Label>
                                    <Input id="title" {...register("title", { required: "Title is required" })} placeholder="e.g., Senior Software Engineer" />
                                    {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="company">Company Name *</Label>
                                    <Input id="company" {...register("company", { required: "Company is required" })} placeholder="e.g., Acme Inc." />
                                    {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="employmentType">Employment Type *</Label>
                                    <Select value={watch("employmentType") || ""} onValueChange={(v) => setValue("employmentType", v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {EMPLOYMENT_TYPES.map((t) => (
                                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="workMode">Work Mode *</Label>
                                    <Select value={watch("workMode") || ""} onValueChange={(v) => setValue("workMode", v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {WORK_MODES.map((m) => (
                                                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="experienceLevel">Experience Level</Label>
                                    <Select value={watch("experienceLevel") || ""} onValueChange={(v) => setValue("experienceLevel", v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {EXPERIENCE_LEVELS.map((l) => (
                                                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={watch("status") || "active"} onValueChange={(v) => setValue("status", v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {JOB_STATUS_LIST.map((s) => (
                                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea id="description" {...register("description", { required: "Description is required" })} rows={4} placeholder="Describe the role..." />
                                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="font-medium">Location</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="locationCity">City</Label>
                                    <Input id="locationCity" {...register("locationCity")} defaultValue={watch("location.city")} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="locationState">State</Label>
                                    <Input id="locationState" {...register("locationState")} defaultValue={watch("location.state")} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="locationCountry">Country</Label>
                                    <Input id="locationCountry" {...register("locationCountry")} defaultValue={watch("location.country")} />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="font-medium">Salary</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="salaryMin">Minimum</Label>
                                    <Input id="salaryMin" type="number" {...register("salaryMin")} defaultValue={watch("salary.min")} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="salaryMax">Maximum</Label>
                                    <Input id="salaryMax" type="number" {...register("salaryMax")} defaultValue={watch("salary.max")} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="salaryCurrency">Currency</Label>
                                    <Input id="salaryCurrency" {...register("salaryCurrency")} defaultValue={watch("salary.currency") || "USD"} />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="font-medium">Skills Required</h3>
                            <div className="flex gap-2">
                                <Input
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    placeholder="Add a skill"
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("requiredSkills", skillInput, setSkillInput))}
                                />
                                <Button type="button" onClick={() => addToArray("requiredSkills", skillInput, setSkillInput)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(watch("requiredSkills") || []).map((skill, idx) => (
                                    <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                                        {typeof skill === "string" ? skill : skill.name}
                                        <button type="button" onClick={() => removeFromArray("requiredSkills", skill)} className="ml-1 hover:bg-background rounded">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="font-medium">Benefits</h3>
                            <div className="flex gap-2">
                                <Input
                                    value={benefitInput}
                                    onChange={(e) => setBenefitInput(e.target.value)}
                                    placeholder="Add a benefit"
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("benefits", benefitInput, setBenefitInput))}
                                />
                                <Button type="button" onClick={() => addToArray("benefits", benefitInput, setBenefitInput)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(watch("benefits") || []).map((benefit, idx) => (
                                    <Badge key={idx} variant="outline" className="gap-1 pr-1">
                                        {benefit}
                                        <button type="button" onClick={() => removeFromArray("benefits", benefit)} className="ml-1 hover:bg-background rounded">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="deadline">Application Deadline</Label>
                                <Input id="deadline" type="date" {...register("deadline")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="openings">Number of Openings</Label>
                                <Input id="openings" type="number" {...register("openings")} defaultValue={1} />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="isUrgent"
                                checked={watch("isUrgent")}
                                onCheckedChange={(checked) => setValue("isUrgent", checked)}
                            />
                            <Label htmlFor="isUrgent">Mark as urgent hiring</Label>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => navigate("/employer/jobs")}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving}>
                                <Save className="h-4 w-4 mr-2" />
                                {saving ? "Saving..." : isEdit ? "Update Job" : "Post Job"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
