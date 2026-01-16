import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import { skillProgramService } from "@/lib/services/skillProgramService";
import { PROGRAM_LEVELS, PROGRAM_CATEGORIES } from "@/lib/constants";
import { debounce, formatDate } from "@/lib/utils";
import { Search, Plus, BookOpen, Pencil, Trash2, X, ExternalLink, Star, Clock, Award } from "lucide-react";
import { toast } from "sonner";

export default function ProgramsPage() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [formDialog, setFormDialog] = useState({ open: false, item: null });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [filters, setFilters] = useState({
        search: "",
        level: "",
        page: 1,
        limit: 10,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        platform: "",
        url: "",
        level: "beginner",
        category: "programming",
        duration: { value: 0, unit: "hours" },
        price: { isFree: true, amount: 0, currency: "INR" },
        skillsCovered: [],
        certificateOffered: false,
        isActive: true,
    });

    const fetchPrograms = async (params) => {
        setLoading(true);
        try {
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== "" && v !== null)
            );
            let response;
            if (cleanParams.search) {
                const { search, ...rest } = cleanParams;
                const searchParams = { q: search, ...rest };
                response = await skillProgramService.searchPrograms(searchParams);
            } else {
                response = await skillProgramService.getPrograms(cleanParams);
            }
            setPrograms(response.data || []);
            setPagination(response.pagination);
        } catch (err) {
            toast.error("Failed to load programs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms(filters);
    }, [filters.level, filters.page, filters.search]);

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

    const openFormDialog = (item = null) => {
        if (item) {
            setFormData({
                title: item.title || "",
                description: item.description || "",
                platform: item.platform || "",
                url: item.url || "",
                level: item.level || "beginner",
                category: item.category || "programming",
                duration: item.duration || { value: 0, unit: "hours" },
                price: item.price || { isFree: true, amount: 0, currency: "INR" },
                skillsCovered: item.skillsCovered || [],
                certificateOffered: item.certificateOffered || false,
                isActive: item.isActive !== false,
            });
        } else {
            setFormData({
                title: "",
                description: "",
                platform: "",
                url: "",
                level: "beginner",
                category: "programming",
                duration: { value: 0, unit: "hours" },
                price: { isFree: true, amount: 0, currency: "INR" },
                skillsCovered: [],
                certificateOffered: false,
                isActive: true,
            });
        }
        setFormDialog({ open: true, item });
    };

    const addSkill = () => {
        if (!skillInput.trim()) return;
        if (formData.skillsCovered.includes(skillInput.trim())) {
            toast.error("Skill already added");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            skillsCovered: [...prev.skillsCovered, skillInput.trim()],
        }));
        setSkillInput("");
    };

    const removeSkill = (skill) => {
        setFormData((prev) => ({
            ...prev,
            skillsCovered: prev.skillsCovered.filter((s) => s !== skill),
        }));
    };

    const handleSave = async () => {
        if (!formData.title || !formData.platform || !formData.url || !formData.description) {
            toast.error("Title, platform, URL, and description are required");
            return;
        }
        if (!formData.level) {
            toast.error("Level is required");
            return;
        }
        if (!formData.duration || !formData.duration.value || !formData.duration.unit) {
            toast.error("Duration is required");
            return;
        }
        if (!formData.skillsCovered || formData.skillsCovered.length === 0) {
            toast.error("At least one skill must be added");
            return;
        }
        setSaving(true);
        try {
            if (formDialog.item) {
                await skillProgramService.updateProgram(formDialog.item._id, formData);
                toast.success("Program updated");
            } else {
                await skillProgramService.createProgram(formData);
                toast.success("Program created");
            }
            setFormDialog({ open: false, item: null });
            fetchPrograms(filters);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteDialog.item) return;
        setDeleting(true);
        try {
            await skillProgramService.deleteProgram(deleteDialog.item._id);
            toast.success("Program deleted");
            setDeleteDialog({ open: false, item: null });
            fetchPrograms(filters);
        } catch (err) {
            toast.error("Failed to delete");
        } finally {
            setDeleting(false);
        }
    };

    const clearFilters = () => {
        setFilters({ search: "", level: "", page: 1, limit: 10 });
        setSearchTerm("");
        fetchPrograms({ page: 1, limit: 10 });
    };

    const hasActiveFilters = filters.search || filters.level;

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
                        Skill <span className="gradient-text">Programs</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage learning programs and courses</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="gradient-primary" onClick={() => openFormDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Program
                    </Button>
                </motion.div>
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
                                    placeholder="Search programs..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={filters.level || "all"}
                                onValueChange={(value) => setFilters((prev) => ({ ...prev, level: value === "all" ? "" : value, page: 1 }))}
                            >
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Levels</SelectItem>
                                    {PROGRAM_LEVELS.map((level) => (
                                        <SelectItem key={level.value} value={level.value}>
                                            {level.label}
                                        </SelectItem>
                                    ))}
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
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            ) : programs.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {programs.map((program, index) => (
                            <motion.div
                                key={program._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.01, y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-primary/50 bg-linear-to-br from-card to-muted/10">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold truncate">{program.title}</h3>
                                                        <Badge variant="outline">{program.level}</Badge>
                                                        {program.price?.isFree ? (
                                                            <Badge className="bg-green-100 text-green-800">Free</Badge>
                                                        ) : (
                                                            <Badge variant="secondary">
                                                                {program.price?.currency} {program.price?.amount}
                                                            </Badge>
                                                        )}
                                                        {program.certificateOffered && (
                                                            <Badge variant="secondary" className="gap-1">
                                                                <Award className="h-3 w-3" />
                                                                Certificate
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">{program.platform}</p>
                                                    {program.description && (
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                            {program.description}
                                                        </p>
                                                    )}
                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                                        {program.duration && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {program.duration.value} {program.duration.unit}
                                                            </span>
                                                        )}
                                                        {program.rating && (
                                                            <span className="flex items-center gap-1">
                                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                                {program.rating}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {program.skillsCovered?.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {program.skillsCovered.slice(0, 4).map((skill, idx) => (
                                                                <Badge key={idx} variant="outline" className="text-xs">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                            {program.skillsCovered.length > 4 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{program.skillsCovered.length - 4}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button variant="outline" size="sm" asChild>
                                                            <a href={program.url} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button variant="outline" size="sm" onClick={() => openFormDialog(program)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setDeleteDialog({ open: true, item: program })}
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
                    icon={BookOpen}
                    title="No programs found"
                    description={hasActiveFilters ? "Try adjusting your filters" : "Add your first skill program"}
                    action={
                        !hasActiveFilters && (
                            <Button onClick={() => openFormDialog()}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Program
                            </Button>
                        )
                    }
                />
            )}

            <Dialog open={formDialog.open} onOpenChange={(open) => setFormDialog({ open, item: null })}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{formDialog.item ? "Edit Program" : "Add Program"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="platform">Platform *</Label>
                                <Input
                                    id="platform"
                                    value={formData.platform}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, platform: e.target.value }))}
                                    placeholder="e.g., Coursera, Udemy"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url">URL *</Label>
                                <Input
                                    id="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                rows={3}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Level *</Label>
                                <Select
                                    value={formData.level}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, level: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROGRAM_LEVELS.map((level) => (
                                            <SelectItem key={level.value} value={level.value}>
                                                {level.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROGRAM_CATEGORIES.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Duration *</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={formData.duration.value}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                duration: { ...prev.duration, value: Number(e.target.value) },
                                            }))
                                        }
                                        className="w-20"
                                    />
                                    <Select
                                        value={formData.duration.unit}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                duration: { ...prev.duration, unit: value },
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hours">Hours</SelectItem>
                                            <SelectItem value="days">Days</SelectItem>
                                            <SelectItem value="weeks">Weeks</SelectItem>
                                            <SelectItem value="months">Months</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Price</Label>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="isFree"
                                        checked={formData.price.isFree}
                                        onCheckedChange={(checked) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                price: { ...prev.price, isFree: checked },
                                            }))
                                        }
                                    />
                                    <Label htmlFor="isFree" className="text-sm">Free</Label>
                                </div>
                                {!formData.price.isFree && (
                                    <Input
                                        type="number"
                                        value={formData.price.amount}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                price: { ...prev.price, amount: Number(e.target.value) },
                                            }))
                                        }
                                        placeholder="Amount"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Skills Covered *</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    placeholder="Add a skill"
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                />
                                <Button type="button" onClick={addSkill}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skillsCovered.map((skill, idx) => (
                                    <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:bg-background rounded">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="certificateOffered"
                                    checked={formData.certificateOffered}
                                    onCheckedChange={(checked) =>
                                        setFormData((prev) => ({ ...prev, certificateOffered: checked }))
                                    }
                                />
                                <Label htmlFor="certificateOffered">Certificate Offered</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormDialog({ open: false, item: null })}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, item: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Program</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{deleteDialog.item?.title}&quot;?
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
        </div>
    );
}
