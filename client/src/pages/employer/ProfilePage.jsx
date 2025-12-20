import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { profileService } from "@/lib/services/profileService";
import { authService } from "@/lib/services/authService";
import { logout } from "@/store/slices/authSlice";
import { Building2, Globe, MapPin, Phone, Mail, Linkedin, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await profileService.getMyProfile();
            setProfile(response.data);
            reset(response.data);
        } catch (err) {
            if (err.response?.status !== 404) {
                toast.error("Failed to load profile");
            }
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setSaving(true);
        try {
            const payload = {
                companyName: data.companyName,
                companyDescription: data.companyDescription,
                industry: data.industry,
                companySize: data.companySize,
                foundedYear: data.foundedYear ? Number(data.foundedYear) : undefined,
                website: data.website,
                location: {
                    city: data.locationCity,
                    state: data.locationState,
                    country: data.locationCountry,
                },
                contact: {
                    email: data.contactEmail,
                    phone: data.contactPhone,
                },
                socialLinks: {
                    linkedin: data.linkedin,
                    twitter: data.twitter,
                },
            };

            const response = profile
                ? await profileService.updateProfile(payload)
                : await profileService.createProfile(payload);

            setProfile(response.data);
            toast.success("Profile updated");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Company Profile</h1>
                <p className="text-muted-foreground">Manage your company information</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Company Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="companyName">Company Name *</Label>
                                <Input
                                    id="companyName"
                                    {...register("companyName", { required: "Company name is required" })}
                                    placeholder="Your Company Name"
                                />
                                {errors.companyName && (
                                    <p className="text-sm text-destructive">{errors.companyName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Input
                                    id="industry"
                                    {...register("industry")}
                                    placeholder="e.g., Technology, Finance"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="companySize">Company Size</Label>
                                <Input
                                    id="companySize"
                                    {...register("companySize")}
                                    placeholder="e.g., 50-100, 100-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="foundedYear">Founded Year</Label>
                                <Input
                                    id="foundedYear"
                                    type="number"
                                    {...register("foundedYear")}
                                    placeholder="e.g., 2015"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="website"
                                        {...register("website")}
                                        className="pl-9"
                                        placeholder="https://yourcompany.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="companyDescription">Company Description</Label>
                            <Textarea
                                id="companyDescription"
                                {...register("companyDescription")}
                                rows={4}
                                placeholder="Tell candidates about your company, culture, and mission..."
                            />
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="font-medium flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Location
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="locationCity">City</Label>
                                    <Input
                                        id="locationCity"
                                        {...register("locationCity")}
                                        defaultValue={profile?.location?.city}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="locationState">State</Label>
                                    <Input
                                        id="locationState"
                                        {...register("locationState")}
                                        defaultValue={profile?.location?.state}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="locationCountry">Country</Label>
                                    <Input
                                        id="locationCountry"
                                        {...register("locationCountry")}
                                        defaultValue={profile?.location?.country}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="font-medium">Contact Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="contactEmail"
                                            type="email"
                                            {...register("contactEmail")}
                                            className="pl-9"
                                            defaultValue={profile?.contact?.email}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactPhone">Phone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="contactPhone"
                                            {...register("contactPhone")}
                                            className="pl-9"
                                            defaultValue={profile?.contact?.phone}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="font-medium">Social Links</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin">LinkedIn</Label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="linkedin"
                                            {...register("linkedin")}
                                            className="pl-9"
                                            placeholder="LinkedIn company page URL"
                                            defaultValue={profile?.socialLinks?.linkedin}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="twitter">Twitter</Label>
                                    <Input
                                        id="twitter"
                                        {...register("twitter")}
                                        placeholder="Twitter profile URL"
                                        defaultValue={profile?.socialLinks?.twitter}
                                    />
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
                            onClick={async () => {
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
                            }}
                            disabled={confirmText !== "DELETE" || deleting}
                        >
                            {deleting ? "Deleting..." : "Delete Account"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
