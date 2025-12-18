import { FileX } from "lucide-react";

export default function EmptyState({
    icon: Icon = FileX,
    title = "No data found",
    description = "There's nothing to display here yet."
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
    );
}
