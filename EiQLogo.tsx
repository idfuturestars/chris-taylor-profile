import { cn } from "@/lib/utils";

interface EiQLogoProps {
  className?: string;
  showText?: boolean;
  variant?: "full" | "compact";
  size?: "sm" | "md" | "lg";
}

export default function EiQLogo({ className, showText = true, variant = "full", size = "md" }: EiQLogoProps) {
  const sizeClasses = {
    sm: { text: "text-lg", logo: "h-6", star: "8" },
    md: { text: "text-2xl", logo: "h-8", star: "12" },
    lg: { text: "text-4xl", logo: "h-12", star: "16" }
  };

  const currentSize = sizeClasses[size];

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <div className="flex items-center">
          <span className={`${currentSize.text} font-bold text-foreground`}>E</span>
          <div className="relative">
            <span className={`${currentSize.text} font-bold text-foreground`}>i</span>
            <svg 
              className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-blue-400 drop-shadow-sm" 
              width={currentSize.star} 
              height={currentSize.star} 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 0L14.12 9.88L24 12L14.12 14.12L12 24L9.88 14.12L0 12L9.88 9.88L12 0Z"/>
            </svg>
          </div>
          <span className={`${currentSize.text} font-bold text-foreground`}>Q</span>
          <span className="text-xs font-bold text-foreground relative -top-3">™</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className="flex items-center">
        <span className={`${currentSize.text} font-bold text-foreground`}>E</span>
        <div className="relative">
          <span className={`${currentSize.text} font-bold text-foreground`}>i</span>
          <svg 
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-blue-400 drop-shadow-sm" 
            width={currentSize.star} 
            height={currentSize.star} 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 0L14.12 9.88L24 12L14.12 14.12L12 24L9.88 14.12L0 12L9.88 9.88L12 0Z"/>
          </svg>
        </div>
        <span className={`${currentSize.text} font-bold text-foreground`}>Q</span>
        <span className="text-xs font-bold text-foreground relative -top-3">™</span>
      </div>
      {showText && (
        <span className="text-sm text-muted-foreground">Powered by SikatLabs™</span>
      )}
    </div>
  );
}
