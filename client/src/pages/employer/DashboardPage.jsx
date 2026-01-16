import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardService } from "@/lib/services/dashboardService";
import { authService } from "@/lib/services/authService";
import { formatDate, getTimeAgo } from "@/lib/utils";
import { Briefcase, Users, FileText, Eye, Plus, ArrowRight, TrendingUp, Clock, MessageSquare, Send, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { notificationService } from "@/lib/services/notificationService";

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

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedApplicant) return;
        setSending(true);
        try {
            await notificationService.sendNotification({
                recipientId: selectedApplicant.applicant._id,
                content: message,
                type: "message"
            });
            toast.success("Message sent successfully");
            setMessage("");
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await dashboardService.getEmployerDashboard();
                setData(response.data);
            } catch (err) {
                toast.error("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <Skeleton className="h-96" />
            </div>
        );
    }

    const activeJobsCount = data?.jobStats?.byStatus?.find(s => s._id === 'active')?.count || 0;
    const publishedArticlesCount = data?.articleStats?.byStatus?.find(s => s._id === 'published')?.count || 0;
    const getCount = (status) => data?.applicationStats?.byStatus?.find((s) => s._id === status)?.count || 0;

    const stats = [
        {
            title: "Active Jobs",
            value: activeJobsCount,
            icon: Briefcase,
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            title: "Total Applications",
            value: data?.applicationStats?.total || 0,
            icon: Users,
            gradient: "from-green-500 to-emerald-500",
        },
        {
            title: "Published Articles",
            value: publishedArticlesCount,
            icon: FileText,
            gradient: "from-purple-500 to-pink-500",
        },
    ];

    return (
        <div className="container mx-auto p-6">
            <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <h1 className="text-3xl font-bold">
                        Employer <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage your job postings and applications</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="gradient-primary" asChild>
                        <Link to="/employer/jobs/new">
                            <Plus className="h-4 w-4 mr-2" />
                            Post New Job
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>

            <motion.div
                className="grid md:grid-cols-3 gap-4 mb-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
            >
                {stats.map((stat, index) => (
                    <motion.div key={stat.title} variants={fadeInUp}>
                        <Card className="shadow-lg border-0 bg-linear-to-br from-card to-muted/20">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                    </div>
                                    <motion.div
                                        className={`h-12 w-12 rounded-full bg-linear-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className="grid lg:grid-cols-2 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
            >
                <motion.div variants={fadeInUp}>
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Recent Jobs</CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link to="/employer/jobs">
                                    View All <ArrowRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {data?.recentJobs?.length > 0 ? (
                                <div className="space-y-3">
                                    {data.recentJobs.map((job) => (
                                        <motion.div
                                            key={job._id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <Link to={`/employer/jobs/${job._id}/applications`} className="font-medium hover:text-primary truncate block">
                                                    {job.title}
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {getTimeAgo(job.createdAt)}
                                                    <span>•</span>
                                                    <Users className="h-3 w-3" />
                                                    {job.applicationCount || 0} applicants
                                                </div>
                                            </div>
                                            <Badge className="gradient-primary text-primary-foreground">{job.status}</Badge>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-6">No jobs posted yet</p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Recent Applications</CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link to="/employer/applications">
                                    View All <ArrowRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {data?.recentApplications?.length > 0 ? (
                                <div className="space-y-3">
                                    {data.recentApplications.map((app) => (
                                        <motion.div
                                            key={app._id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{app.applicant?.name || "Unknown"}</p>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    Applied for {app.job?.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{getTimeAgo(app.createdAt)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                    onClick={() => {
                                                        setSelectedApplicant(app);
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>
                                                <Badge variant="secondary">{app.status}</Badge>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-6">No applications yet</p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">Application Stats</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { label: "Applied", status: "applied", color: "bg-blue-500" },
                                    { label: "Reviewing", status: "reviewing", color: "bg-purple-500" },
                                    { label: "Shortlisted", status: "shortlisted", color: "bg-indigo-500" },
                                    { label: "Interview", status: "interview", color: "bg-yellow-500" },
                                    { label: "Offered", status: "offered", color: "bg-green-500" },
                                    { label: "Rejected", status: "rejected", color: "bg-red-500" },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-3 w-3 rounded-full ${item.color}`} />
                                            <span className="text-sm">{item.label}</span>
                                        </div>
                                        <span className="font-medium">{getCount(item.status)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link to="/employer/jobs/new">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Post a New Job
                                    </Link>
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link to="/employer/articles/new">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Write an Article
                                    </Link>
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link to="/employer/profile">
                                        <TrendingUp className="h-4 w-4 mr-2" />
                                        Update Company Profile
                                    </Link>
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-6">
                <Card className="mt-6 border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 border border-destructive/30 rounded-lg bg-destructive/5">
                            <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                                Once you delete your account, there is no going back. This will permanently delete your profile,
                                job postings, articles, and all associated data.
                            </p>
                            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Delete Account</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account, all job postings, articles, and associated data.
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Message {selectedApplicant?.applicant?.name}</DialogTitle>
                        <DialogDescription>
                            Send a direct message to the applicant regarding their application for {selectedApplicant?.job?.title}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-25"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSendMessage} disabled={sending || !message.trim()}>
                            {sending ? "Sending..." : "Send Message"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
