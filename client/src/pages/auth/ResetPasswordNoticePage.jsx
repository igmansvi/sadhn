import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";

export default function ResetPasswordNoticePage() {
    const location = useLocation();
    const email = location.state?.email;

    return (
        <Card className="border-0 shadow-none">
            <CardHeader className="space-y-1 px-0 text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                <CardDescription className="text-base">
                    We've sent a password reset link to{" "}
                    {email && <span className="font-medium text-foreground">{email}</span>}
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
                <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
                    <p>Please check your inbox and click on the reset link to create a new password.</p>
                    <p className="mt-2">Can't find the email? Check your spam folder.</p>
                    <p className="mt-2">The link will expire in 1 hour.</p>
                </div>

                <Link to="/forgot-password">
                    <Button variant="outline" className="w-full">
                        Didn't receive the email? Try again
                    </Button>
                </Link>

                <Link to="/login">
                    <Button variant="ghost" className="w-full">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to login
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
