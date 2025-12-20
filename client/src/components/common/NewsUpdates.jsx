import { useState, useEffect } from "react";
import { Newspaper } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { newsService } from "@/lib/services/newsService";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function NewsUpdates() {
    const [news, setNews] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            newsService.getAllNews({ limit: 20 })
                .then(res => {
                    if (res.data.success) {
                        setNews(res.data.data);
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Newspaper className="h-4 w-4" />
                    Updates
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                    <h4 className="font-semibold leading-none">News & Updates</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                        Latest announcements and updates
                    </p>
                </div>
                <ScrollArea className="h-75">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                    ) : news.length > 0 ? (
                        <div className="divide-y">
                            {news.map((item) => (
                                <div key={item._id} className="p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex justify-between gap-2 items-start">
                                        <p className="text-sm font-medium leading-none">
                                            {item.title}
                                        </p>
                                        {item.priority === 'high' && (
                                            <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                                        {item.content}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="text-[10px] px-1 py-0">{item.category}</Badge>
                                        <span className="text-[10px] text-muted-foreground">
                                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No updates available
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
