import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeIcon } from "./BadgeIcon";
import { X, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

interface AchievementNotificationProps {
  badge: {
    id: string;
    title: string;
    description: string;
    category: 'assessment' | 'learning' | 'streak' | 'ai' | 'social' | 'mastery';
    tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    points: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  };
  isVisible: boolean;
  onClose: () => void;
  autoClose?: number;
}

export function AchievementNotification({ 
  badge, 
  isVisible, 
  onClose, 
  autoClose = 5000 
}: AchievementNotificationProps) {
  const [isShown, setIsShown] = useState(isVisible);

  useEffect(() => {
    setIsShown(isVisible);
    
    if (isVisible) {
      // Trigger confetti effect
      const colors = {
        bronze: ['#D2691E', '#CD853F'],
        silver: ['#C0C0C0', '#A9A9A9'],
        gold: ['#FFD700', '#FFA500'], 
        platinum: ['#E5E4E2', '#BCC6CC'],
        diamond: ['#B9F2FF', '#00CED1']
      };
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors[badge.tier]
      });

      // Auto-close timer
      if (autoClose > 0) {
        const timer = setTimeout(() => {
          setIsShown(false);
          setTimeout(onClose, 300);
        }, autoClose);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoClose, badge.tier, onClose]);

  const handleClose = () => {
    setIsShown(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isShown && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed top-4 right-4 z-50 w-96 max-w-[90vw]"
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <BadgeIcon 
                      tier={badge.tier} 
                      category={badge.category} 
                      size="lg"
                    />
                  </motion.div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-green-800 dark:text-green-200">
                      Achievement Unlocked!
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">
                    {badge.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    {badge.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                      >
                        +{badge.points} pts
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="flex-shrink-0 h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}