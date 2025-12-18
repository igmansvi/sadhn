import { Spinner } from "@/components/ui/spinner";

export default function LoadingState({ text = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Spinner size="lg" />
            <p className="text-sm text-muted-foreground mt-4">{text}</p>
        </div>
    );
}
