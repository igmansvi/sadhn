import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Users } from "lucide-react";

export default function UsersPage() {
    return (
        <div className="container mx-auto p-6">
            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold">
                    User <span className="gradient-text">Management</span>
                </h1>
                <p className="text-muted-foreground mt-1">Manage platform users and roles</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/20">
                    <CardContent className="p-12 text-center">
                        <motion.div
                            className="flex justify-center mb-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                                <Users className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </motion.div>
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
            </motion.div>
        </div>
    );
}
