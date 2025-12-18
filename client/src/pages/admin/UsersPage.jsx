import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Users } from "lucide-react";

export default function UsersPage() {
    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <p className="text-muted-foreground">Manage platform users and roles</p>
            </div>

            <Card>
                <CardContent className="p-12 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        User management features are currently under development.
                        This will include the ability to view all users, manage roles,
                        and suspend/activate accounts.
                    </p>
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg inline-flex items-center gap-2 text-amber-800">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Backend API routes for user management need to be implemented.</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
