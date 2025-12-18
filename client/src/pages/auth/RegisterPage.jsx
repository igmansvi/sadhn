import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Eye, EyeOff, User, Building } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState("learner");
    const { loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {
        try {
            const result = await dispatch(
                registerUser({ ...data, role: selectedRole })
            ).unwrap();
            toast.success("Registration successful! Please verify your email.");
            navigate("/verify-email-notice");
        } catch (err) {
            toast.error(err || "Registration failed");
        }
    };

    return (
        <Card className="border-0 shadow-none">
            <CardHeader className="space-y-1 px-0">
                <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                <CardDescription>
                    Join <span className="italic" style={{ fontFamily: "'Satisfy', cursive" }}>sadhn</span> to explore opportunities
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <div className="mb-6">
                    <Label className="text-sm font-medium mb-3 block">I am a</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setSelectedRole("learner")}
                            className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors",
                                selectedRole === "learner"
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                            )}
                        >
                            <User className="h-8 w-8" />
                            <span className="font-medium">Job Seeker</span>
                            <span className="text-xs text-muted-foreground">
                                Find jobs & learn skills
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole("employer")}
                            className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors",
                                selectedRole === "employer"
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                            )}
                        >
                            <Building className="h-8 w-8" />
                            <span className="font-medium">Employer</span>
                            <span className="text-xs text-muted-foreground">
                                Post jobs & find talent
                            </span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            {...register("name", {
                                required: "Name is required",
                                minLength: {
                                    value: 2,
                                    message: "Name must be at least 2 characters",
                                },
                            })}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "Invalid email address",
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                })}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === password || "Passwords do not match",
                            })}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Spinner size="sm" className="mr-2" />}
                        Create Account
                    </Button>
                </form>

                <p className="mt-4 text-xs text-center text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                    </Link>
                </p>

                <div className="mt-6 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
