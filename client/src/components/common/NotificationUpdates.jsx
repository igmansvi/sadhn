import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notificationService } from "@/lib/services/notificationService";
import { useSocket } from "@/context/SocketContext";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { socketService } = useSocket();
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await notificationService.getNotifications();
            if (response.data.success) {
                setNotifications(response.data.data.notifications);
                setUnreadCount(response.data.data.unreadCount);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        socketService.on("receive_notification", (newNotification) => {
            setNotifications((prev) => [newNotification, ...prev]);
            setUnreadCount((prev) => prev + 1);
            toast.info(`New Message: ${newNotification.content}`);
        });

        return () => {
            socketService.off("receive_notification");
        };
    }, [socketService]);

    const handleMarkAsRead = async () => {
        if (unreadCount > 0) {
            try {
                await notificationService.markAsRead();
                setUnreadCount(0);
                setNotifications((prev) =>
                    prev.map((n) => ({ ...n, isRead: true }))
                );
            } catch (error) {
                console.error("Failed to mark read", error);
            }
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (open) handleMarkAsRead();
        }}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                    <h4 className="font-semibold leading-none">Notifications</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                        You have {unreadCount} unread messages
                    </p>
                </div>
                <ScrollArea className="h-75">
                    {notifications.length > 0 ? (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 hover:bg-muted/50 transition-colors ${!notification.isRead ? "bg-muted/20" : ""
                                        }`}
                                >
                                    <div className="flex justify-between gap-2">
                                        <p className="text-sm font-medium leading-none">
                                            {notification.type === 'message'
                                                ? (notification.sender
                                                    ? `Message from ${notification.sender.name || notification.sender.email || 'User'}`
                                                    : 'New Message')
                                                : 'Notification'}
                                        </p>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                        {notification.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications yet
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
