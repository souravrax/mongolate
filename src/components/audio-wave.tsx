import { cn } from "@/lib/utils";

interface AudioWaveProps {
    className?: string;
    barCount?: number;
    color?: string;
}

export function AudioWave({ className, barCount = 4, color }: AudioWaveProps) {
    return (
        <div className={cn("flex items-center gap-[2px] h-4", className)}>
            {Array.from({ length: barCount }).map((_, i) => (
                <span
                    key={i}
                    className={cn(
                        "w-[3px] rounded-full animate-wave",
                        color || "bg-current"
                    )}
                    style={{
                        animationDelay: `${i * 120}ms`,
                    }}
                />
            ))}
        </div>
    );
}
