import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import axios from "@/lib/api";
import { debounce, formatDate } from "@/lib/utils";
import { Search, Mail, Eye, Trash2, X, MessageSquare, Reply } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-800",
    responded: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800",
};

export default function ContactPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [viewDialog, setViewDialog] = useState({ open: false, item: null });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
    const [replyDialog, setReplyDialog] = useState({ open: false, item: null });
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [replying, setReplying] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        page: 1,
        limit: 10,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [statusUpdate, setStatusUpdate] = useState({
        status: "",
        notes: "",
    });
    const [replyMessage, setReplyMessage] = useState("");

    const fetchContacts = async (params) => {
        setLoading(true);
        try {
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== "" && v !== null)
            );
            const response = await axios.get("/contact/all", { params: cleanParams });
            setContacts(response.data.data || []);
            setPagination(response.data.pagination);
        } catch (err) {
            toast.error("Failed to load contacts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts(filters);
    }, [filters.status, filters.page, filters.search]);

    const debouncedSearch = useCallback(
        debounce((value) => {
            setFilters((prev) => ({ ...prev, search: value, page: 1 }));
        }, 500),
        []
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const openViewDialog = (item) => {
        setViewDialog({ open: true, item });
        setStatusUpdate({
            status: item.status,
            notes: item.notes || "",
        });
    };

    const handleUpdateStatus = async () => {
        if (!viewDialog.item) return;
        setUpdating(true);
        try {
            await axios.patch(`/contact/${viewDialog.item._id}`, statusUpdate);
            toast.success("Status updated");
            setViewDialog({ open: false, item: null });
            fetchContacts(filters);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update");
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteDialog.item) return;
        setDeleting(true);
        try {
            await axios.delete(`/contact/${deleteDialog.item._id}`);
            toast.success("Contact deleted");
            setDeleteDialog({ open: false, item: null });
            fetchContacts(filters);
        } catch (err) {
            toast.error("Failed to delete");
        } finally {
            setDeleting(false);
        }
    };

    const openReplyDialog = (item) => {
        setReplyDialog({ open: true, item });
        setReplyMessage("");
    };

    const handleReply = async () => {
        if (!replyDialog.item || !replyMessage.trim()) {
            toast.error("Reply message is required");
            return;
        }
        setReplying(true);
        try {
            await axios.post(`/contact/${replyDialog.item._id}/reply`, { reply: replyMessage });
            toast.success("Reply sent successfully");
            setReplyDialog({ open: false, item: null });
            setReplyMessage("");
            fetchContacts(filters);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send reply");
        } finally {
            setReplying(false);
        }
    };

    const clearFilters = () => {
        setFilters({ search: "", status: "", page: 1, limit: 10 });
        setSearchTerm("");
    };

    const hasActiveFilters = filters.search || filters.status;

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
                        Contact <span className="gradient-text">Submissions</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage contact form submissions</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card className="mb-6 shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search contacts..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={filters.status || "all"}
                                onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value === "all" ? "" : value, page: 1 }))}
                            >
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="responded">Responded</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                            {hasActiveFilters && (
                                <Button variant="ghost" size="icon" onClick={clearFilters}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
            ) : contacts.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {contacts.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.01, y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-primary/50">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold">{item.name}</h3>
                                                        <Badge className={STATUS_COLORS[item.status]}>
                                                            {item.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                        <Mail className="h-3 w-3 inline mr-1" />
                                                        {item.email}
                                                    </p>
                                                    <p className="text-sm font-medium mb-2">{item.subject}</p>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                        {item.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button variant="outline" size="sm" onClick={() => openViewDialog(item)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button variant="outline" size="sm" onClick={() => openReplyDialog(item)}>
                                                            <Reply className="h-4 w-4" />
                                                        </Button>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setDeleteDialog({ open: true, item })}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                    <Pagination
                        pagination={pagination}
                        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                    />
                </>
            ) : (
                <EmptyState
                    icon={MessageSquare}
                    title="No contacts found"
                    description={hasActiveFilters ? "Try adjusting your filters" : "No contact submissions yet"}
                />
            )}

            <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, item: null })}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Contact Details</DialogTitle>
                    </DialogHeader>
                    {viewDialog.item && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">Name</Label>
                                    <p className="text-sm">{viewDialog.item.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Email</Label>
                                    <p className="text-sm">{viewDialog.item.email}</p>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Subject</Label>
                                <p className="text-sm">{viewDialog.item.subject}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Message</Label>
                                <p className="text-sm whitespace-pre-wrap">{viewDialog.item.message}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Submitted</Label>
                                <p className="text-sm">{formatDate(viewDialog.item.createdAt)}</p>
                            </div>
                            {viewDialog.item.respondedBy && (
                                <div>
                                    <Label className="text-sm font-medium">Responded By</Label>
                                    <p className="text-sm">
                                        {viewDialog.item.respondedBy.name} ({formatDate(viewDialog.item.respondedAt)})
                                    </p>
                                </div>
                            )}
                            {viewDialog.item.reply && (
                                <div>
                                    <Label className="text-sm font-medium">Reply Sent</Label>
                                    <p className="text-sm whitespace-pre-wrap bg-green-50 p-3 rounded">{viewDialog.item.reply}</p>
                                </div>
                            )}
                            <div className="space-y-2">\n                                <Label>Status</Label>
                                <Select
                                    value={statusUpdate.status}
                                    onValueChange={(value) => setStatusUpdate((prev) => ({ ...prev, status: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="responded">Responded</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Internal Notes</Label>
                                <Textarea
                                    value={statusUpdate.notes}
                                    onChange={(e) => setStatusUpdate((prev) => ({ ...prev, notes: e.target.value }))}
                                    rows={3}
                                    placeholder="Add internal notes..."
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewDialog({ open: false, item: null })}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateStatus} disabled={updating}>
                            {updating ? "Updating..." : "Update Status"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, item: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Contact</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this contact submission from {deleteDialog.item?.name}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, item: null })}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={replyDialog.open} onOpenChange={(open) => setReplyDialog({ open, item: null })}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Reply to Contact</DialogTitle>
                    </DialogHeader>
                    {replyDialog.item && (
                        <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                                <div className="mb-2">
                                    <span className="font-semibold">{replyDialog.item.name}</span>
                                    <span className="text-muted-foreground text-sm ml-2">({replyDialog.item.email})</span>
                                </div>
                                <p className="text-sm font-medium mb-1">{replyDialog.item.subject}</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{replyDialog.item.message}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Your Reply</Label>
                                <Textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    rows={6}
                                    placeholder="Type your reply here..."
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReplyDialog({ open: false, item: null })}>
                            Cancel
                        </Button>
                        <Button onClick={handleReply} disabled={replying}>
                            {replying ? "Sending..." : "Send Reply"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
