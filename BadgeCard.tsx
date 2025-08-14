import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeIcon } from "./BadgeIcon";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  badge: {
    id: string;
    name: string;
    title: string;
    description: string;
    category: 'assessment' | 'learning' | 'streak' | 'ai' | 'social' | 'mastery';
    tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    points: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  };
  isEarned?: boolean;
  progress?: {
    currentValue: number;
    targetValue: number;
    percentage: number;
  };
  earnedAt?: string;
}

const rarityColors = {
  common: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  uncommon: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200", 
  rare: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
  epic: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200",
  legendary: "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200"
};

const tierLabels = {
  bronze: "Bronze",
  silver: "Silver", 
  gold: "Gold",
  platinum: "Platinum",
  diamond: "Diamond"
};

export function BadgeCard({ badge, isEarned = false, progress, earnedAt }: BadgeCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg",
      isEarned ? "bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-2" : 
      "opacity-75 grayscale hover:grayscale-0"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <BadgeIcon 
              tier={badge.tier} 
              category={badge.category} 
              size="lg"
              className={cn(!isEarned && "grayscale")}
            />
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                {badge.title}
                {isEarned && (
                  <Badge variant="outline" className="text-xs">
                    Earned
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                {badge.description}
              </CardDescription>
            </div>
          </div>
          
          <div className="text-right">
            <Badge className={rarityColors[badge.rarity]}>
              {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
            </Badge>
            <div className="text-sm text-muted-foreground mt-1">
              {badge.points} pts
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>{tierLabels[badge.tier]} • {badge.category.charAt(0).toUpperCase() + badge.category.slice(1)}</span>
          {earnedAt && (
            <span className="text-xs">
              Earned {new Date(earnedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {progress && !isEarned && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress.currentValue}/{progress.targetValue}</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}