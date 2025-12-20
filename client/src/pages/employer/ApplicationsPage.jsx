import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import EmptyState from "@/components/shared/EmptyState";
import { applicationService } from "@/lib/services/applicationService";
import { APPLICATION_STATUS_LIST } from "@/lib/constants";
import { formatDate, getTimeAgo } from "@/lib/utils";
import { ArrowLeft, Users, Mail, Phone, MapPin, Briefcase, GraduationCap, ExternalLink, FileText, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { notificationService } from "@/lib/services/notificationService";

const STATUS_COLORS = {
    applied: "bg-blue-100 text-blue-800",
    reviewing: "bg-purple-100 text-purple-800",
    shortlisted: "bg-indigo-100 text-indigo-800",
    offered: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    withdrawn: "bg-gray-100 text-gray-800",
};

export default function ApplicationsPage() {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [statusDialog, setStatusDialog] = useState({ open: false, app: null });
    const [newStatus, setNewStatus] = useState("");
    const [feedback, setFeedback] = useState("");
    const [updating, setUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [messageDialogOpen, setMessageDialogOpen] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = jobId
                ? await applicationService.getJobApplications(jobId)
                : await applicationService.getEmployerApplications();
            setApplications(response.data || []);
            if (jobId && response.data?.[0]?.job) {
                setJob(response.data[0].job);
            }
        } catch (err) {
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!statusDialog.app || !newStatus) return;
        setUpdating(true);
        try {
            await applicationService.updateApplicationStatus(statusDialog.app._id, {
                status: newStatus,
                feedback: feedback || undefined,
            });
            toast.success("Status updated");
            setStatusDialog({ open: false, app: null });
            setNewStatus("");
            setFeedback("");
            fetchApplications();
        } catch (err) {
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedApp) return;
        setSending(true);
        try {
            await notificationService.sendNotification({
                recipientId: selectedApp.applicant._id,
                content: message,
                type: "message"
            });
            toast.success("Message sent successfully");
            setMessage("");
            setMessageDialogOpen(false);
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const openStatusDialog = (app) => {
        setStatusDialog({ open: true, app });
        setNewStatus(app.status);
        setFeedback("");
    };

    const filteredApplications = activeTab === "all"
        ? applications
        : applications.filter((app) => app.status === activeTab);

    const getInitials = (name) => {
        if (!name) return "??";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-24" />
                        ))}
                    </div>
                    <Skeleton className="lg:col-span-2 h-96" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            {jobId && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Button variant="ghost" asChild className="mb-4">
                        <Link to="/employer/jobs">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Jobs
                        </Link>
                    </Button>
                </motion.div>
            )}

            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold">
                    {jobId ? <span className="gradient-text">Applications</span> : <span>All <span className="gradient-text">Applications</span></span>}
                </h1>
                {job && <p className="text-muted-foreground mt-1">for {job.title}</p>}
                {!jobId && <p className="text-muted-foreground mt-1">Manage applications across all your jobs</p>}
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList>
                    <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
                    {APPLICATION_STATUS_LIST.slice(0, 5).map((status) => {
                        const count = applications.filter((a) => a.status === status.value).length;
                        return (
                            <TabsTrigger key={status.value} value={status.value}>
                                {status.label} ({count})
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
            </Tabs>

            {filteredApplications.length > 0 ? (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
                        {filteredApplications.map((app) => (
                            <motion.div
                                key={app._id}
                                whileHover={{ scale: 1.02, y: -2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card
                                    className={`cursor-pointer transition-all shadow-lg ${selectedApp?._id === app._id ? "ring-2 ring-primary bg-gradient-to-br from-primary/5 to-secondary/5" : "hover:shadow-xl hover:border-primary/50"}`}
                                    onClick={() => setSelectedApp(app)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="gradient-primary">
                                                <AvatarFallback className="bg-transparent text-primary-foreground">{getInitials(app.applicant?.name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{app.applicant?.name || "Unknown"}</p>
                                                <p className="text-xs text-muted-foreground truncate">{app.profile?.headline || app.applicant?.email}</p>
                                                {app.job && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Briefcase className="h-3 w-3 text-primary" />
                                                        <p className="text-xs text-primary truncate font-medium">{app.job.title}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <Badge className={STATUS_COLORS[app.status]}>{app.status}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">{getTimeAgo(app.createdAt)}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="lg:col-span-2">
                        {selectedApp ? (
                            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/20">
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16 gradient-primary">
                                            <AvatarFallback className="text-xl bg-transparent text-primary-foreground">{getInitials(selectedApp.applicant?.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle>{selectedApp.applicant?.name}</CardTitle>
                                            <p className="text-muted-foreground">{selectedApp.profile?.headline || "No headline"}</p>
                                            {selectedApp.job && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        <Briefcase className="h-3 w-3 mr-1" />
                                                        {selectedApp.job.title}
                                                    </Badge>
                                                    {selectedApp.job.employmentType && (
                                                        <Badge variant="secondary" className="text-xs">{selectedApp.job.employmentType}</Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex gap-2">
                                        <Button variant="outline" onClick={() => setMessageDialogOpen(true)}>
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Message
                                        </Button>
                                        <Button className="gradient-primary" onClick={() => openStatusDialog(selectedApp)}>Update Status</Button>
                                    </motion.div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            {selectedApp.applicant?.email}
                                        </span>
                                        {selectedApp.profile?.phone && (
                                            <span className="flex items-center gap-1">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                {selectedApp.profile.phone}
                                            </span>
                                        )}
                                        {selectedApp.profile?.location?.city && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                {[selectedApp.profile.location.city, selectedApp.profile.location.state, selectedApp.profile.location.country].filter(Boolean).join(", ")}
                                            </span>
                                        )}
                                    </div>

                                    {selectedApp.profile?.summary && (
                                        <div>
                                            <h4 className="font-medium mb-2">About</h4>
                                            <p className="text-sm text-muted-foreground">{selectedApp.profile.summary}</p>
                                        </div>
                                    )}

                                    {selectedApp.coverLetter && (
                                        <div>
                                            <h4 className="font-medium mb-2">Cover Letter</h4>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedApp.coverLetter}</p>
                                        </div>
                                    )}

                                    {selectedApp.profile?.skills?.length > 0 && (
                                        <div>
                                            <h4 className="font-medium mb-2">Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedApp.profile.skills.map((skill, idx) => (
                                                    <Badge key={idx} variant="secondary">
                                                        {skill.name}
                                                        {skill.level && <span className="ml-1 opacity-70">• {skill.level}</span>}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedApp.profile?.experience?.length > 0 && (
                                        <div>
                                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                                <Briefcase className="h-4 w-4" /> Experience
                                            </h4>
                                            <div className="space-y-3">
                                                {selectedApp.profile.experience.slice(0, 3).map((exp, idx) => (
                                                    <div key={idx} className="border-l-2 pl-4">
                                                        <p className="font-medium">{exp.title}</p>
                                                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDate(exp.startDate)} - {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedApp.profile?.education?.length > 0 && (
                                        <div>
                                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                                <GraduationCap className="h-4 w-4" /> Education
                                            </h4>
                                            <div className="space-y-3">
                                                {selectedApp.profile.education.slice(0, 2).map((edu, idx) => (
                                                    <div key={idx} className="border-l-2 pl-4">
                                                        <p className="font-medium">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                                                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                                                        {(edu.startDate || edu.endDate) && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {edu.startDate ? new Date(edu.startDate).getFullYear() : ""} - {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedApp.profile?.portfolio && (
                                        <div className="flex gap-3">
                                            {selectedApp.profile.portfolio.linkedin && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={selectedApp.profile.portfolio.linkedin} target="_blank" rel="noopener noreferrer">
                                                        LinkedIn <ExternalLink className="h-3 w-3 ml-1" />
                                                    </a>
                                                </Button>
                                            )}
                                            {selectedApp.profile.portfolio.github && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={selectedApp.profile.portfolio.github} target="_blank" rel="noopener noreferrer">
                                                        GitHub <ExternalLink className="h-3 w-3 ml-1" />
                                                    </a>
                                                </Button>
                                            )}
                                            {selectedApp.profile.portfolio.website && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={selectedApp.profile.portfolio.website} target="_blank" rel="noopener noreferrer">
                                                        Portfolio <ExternalLink className="h-3 w-3 ml-1" />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    )}

                                    <div className="pt-4 border-t text-sm text-muted-foreground">
                                        Applied {formatDate(selectedApp.createdAt)}
                                        {selectedApp.updatedAt !== selectedApp.createdAt && (
                                            <> • Updated {formatDate(selectedApp.updatedAt)}</>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="h-96 flex items-center justify-center">
                                <p className="text-muted-foreground">Select an application to view details</p>
                            </Card>
                        )}
                    </div>
                </div>
            ) : (
                <EmptyState
                    icon={Users}
                    title="No applications yet"
                    description="Applications will appear here once candidates apply"
                />
            )}

            <Dialog open={statusDialog.open} onOpenChange={(open) => setStatusDialog({ open, app: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Application Status</DialogTitle>
                        <DialogDescription>
                            Change status for {statusDialog.app?.applicant?.fullName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>New Status</Label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {APPLICATION_STATUS_LIST.filter((s) => s.value !== "withdrawn").map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Feedback (Optional)</Label>
                            <Textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Add notes or feedback for this candidate..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusDialog({ open: false, app: null })}>
                            Cancel
                        </Button>
                        <Button onClick={handleStatusUpdate} disabled={updating}>
                            {updating ? "Updating..." : "Update Status"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Message {selectedApp?.applicant?.name}</DialogTitle>
                        <DialogDescription>
                            Send a direct message to the applicant regarding their application for {selectedApp?.job?.title}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSendMessage} disabled={sending || !message.trim()}>
                            {sending ? "Sending..." : "Send Message"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
