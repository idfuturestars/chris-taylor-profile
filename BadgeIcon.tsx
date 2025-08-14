import { cn } from "@/lib/utils";
import { Trophy, Star, Award, Medal, Crown, Zap } from "lucide-react";

interface BadgeIconProps {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  category: 'assessment' | 'learning' | 'streak' | 'ai' | 'social' | 'mastery';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const tierColors = {
  bronze: "text-amber-600 dark:text-amber-400",
  silver: "text-slate-400 dark:text-slate-300", 
  gold: "text-yellow-500 dark:text-yellow-400",
  platinum: "text-purple-400 dark:text-purple-300",
  diamond: "text-cyan-400 dark:text-cyan-300"
};

const tierGradients = {
  bronze: "from-amber-400 to-amber-600",
  silver: "from-slate-300 to-slate-500",
  gold: "from-yellow-400 to-yellow-600", 
  platinum: "from-purple-400 to-purple-600",
  diamond: "from-cyan-400 to-purple-500"
};

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16"
};

const categoryIcons = {
  assessment: Trophy,
  learning: Star,
  streak: Zap,
  ai: Award,
  social: Medal,
  mastery: Crown
};

export function BadgeIcon({ tier, category, size = 'md', className }: BadgeIconProps) {
  const IconComponent = categoryIcons[category];
  
  return (
    <div className={cn(
      "relative inline-flex items-center justify-center rounded-full p-2",
      `bg-gradient-to-br ${tierGradients[tier]}`,
      sizeClasses[size],
      className
    )}>
      <IconComponent 
        className={cn(
          "drop-shadow-sm text-white",
          size === 'sm' ? "w-3 h-3" : 
          size === 'md' ? "w-4 h-4" :
          size === 'lg' ? "w-6 h-6" : "w-8 h-8"
        )}
      />
    </div>
  );
}