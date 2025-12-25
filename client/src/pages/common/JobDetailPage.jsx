import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { jobService } from "@/lib/services/jobService";
import { applicationService } from "@/lib/services/applicationService";
import { formatSalary, formatLocation, formatDate, getTimeAgo } from "@/lib/utils";
import {
    ArrowLeft,
    MapPin,
    Clock,
    Building,
    Briefcase,
    Users,
    Calendar,
    CheckCircle,
    Send,
    LogIn,
} from "lucide-react";
import { toast } from "sonner";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function JobDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);
    const [applying, setApplying] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await jobService.getJobById(id);
                setJob(response.data);
            } catch (err) {
                toast.error("Failed to load job details");
                navigate("/jobs");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, navigate]);

    const handleApplyClick = () => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: { pathname: `/jobs/${id}` } } });
            return;
        }
        if (user?.role !== "learner") {
            toast.error("Only job seekers can apply to jobs");
            return;
        }
        if (!profile) {
            toast.error("Please complete your profile before applying");
            navigate("/onboarding");
            return;
        }
        setApplyDialogOpen(true);
    };

    const handleApply = async () => {
        setApplying(true);
        try {
            await applicationService.applyToJob({ jobId: id, coverLetter });
            toast.success("Application submitted successfully!");
            setApplyDialogOpen(false);
            setHasApplied(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit application");
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Skeleton className="h-8 w-32 mb-6" />
                <Skeleton className="h-64 w-full mb-6" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!job) return null;

    const canApply = isAuthenticated && user?.role === "learner" && profile && !hasApplied;
    const showLoginPrompt = !isAuthenticated;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Button variant="ghost" className="mb-6" onClick={() => navigate("/jobs")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Jobs
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="mb-6 shadow-lg border-0 bg-gradient-to-br from-card to-muted/20">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <motion.div
                                    className="h-16 w-16 gradient-primary rounded-lg flex items-center justify-center shrink-0 shadow-md"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Building className="h-8 w-8 text-primary-foreground" />
                                </motion.div>
                                <div>
                                    <h1 className="text-3xl font-bold">{job.title}</h1>
                                    <p className="text-lg text-muted-foreground mt-1">{job.company}</p>
                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {formatLocation(job.location)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {getTimeAgo(job.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                {hasApplied ? (
                                    <Button disabled className="gap-2 gradient-primary">
                                        <CheckCircle className="h-4 w-4" />
                                        Applied
                                    </Button>
                                ) : showLoginPrompt ? (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button onClick={handleApplyClick} className="gap-2 gradient-primary">
                                            <LogIn className="h-4 w-4" />
                                            Login to Apply
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button onClick={handleApplyClick} className="gap-2 gradient-primary">
                                            <Send className="h-4 w-4" />
                                            Apply Now
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Job Type</p>
                                <Badge className="mt-1 gradient-primary text-primary-foreground">{job.employmentType}</Badge>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Work Mode</p>
                                <Badge variant="outline" className="mt-1">{job.workMode}</Badge>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Experience</p>
                                <p className="font-medium mt-1">
                                    {job.experienceRequired?.min || 0}-{job.experienceRequired?.max || "5+"} years
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Salary</p>
                                <p className="font-semibold gradient-text mt-1">{formatSalary(job.salary)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                className="grid md:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
            >
                <div className="md:col-span-2 space-y-6">
                    <motion.div variants={fadeInUp}>
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Job Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap text-muted-foreground">{job.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {job.responsibilities?.length > 0 && (
                        <motion.div variants={fadeInUp}>
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle>Responsibilities</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2">
                                        {job.responsibilities.map((item, idx) => (
                                            <li key={idx} className="text-muted-foreground">{item}</li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {job.qualifications?.length > 0 && (
                        <motion.div variants={fadeInUp}>
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle>Qualifications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2">
                                        {job.qualifications.map((item, idx) => (
                                            <li key={idx} className="text-muted-foreground">{item}</li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>

                <div className="space-y-6">
                    <motion.div variants={fadeInUp}>
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Required Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {job.requiredSkills?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {job.requiredSkills.map((skill, idx) => (
                                            <Badge key={idx} variant="secondary">
                                                {skill.name}
                                                {skill.level && (
                                                    <span className="ml-1 text-xs opacity-70">({skill.level})</span>
                                                )}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Not specified</p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {job.benefits?.length > 0 && (
                        <motion.div variants={fadeInUp}>
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle>Benefits</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {job.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    <motion.div variants={fadeInUp}>
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Job Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Applications
                                    </span>
                                    <span className="font-medium">{job.applicationCount || 0}</span>
                                </div>
                                {job.deadlineDate && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Deadline
                                        </span>
                                        <span className="font-medium">{formatDate(job.deadlineDate)}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>

            <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Apply for {job.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                            <Textarea
                                id="coverLetter"
                                placeholder="Tell the employer why you're a great fit for this role..."
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                rows={6}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleApply} disabled={applying} className="gradient-primary">
                            {applying && <Spinner size="sm" className="mr-2" />}
                            Submit Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
