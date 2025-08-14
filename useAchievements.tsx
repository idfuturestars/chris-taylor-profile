import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface UserBadge {
  id: string;
  badgeId: string;
  earnedAt: string;
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
}

interface BadgeProgress {
  badgeId: string;
  currentValue: number;
  targetValue: number;
  percentage: number;
  isComplete: boolean;
}

export function useAchievements() {
  const queryClient = useQueryClient();
  const [newBadgeNotification, setNewBadgeNotification] = useState<UserBadge['badge'] | null>(null);

  // Fetch user badges
  const { data: userBadges = [], isLoading: badgesLoading } = useQuery<UserBadge[]>({
    queryKey: ["/api/achievements/badges"],
  });

  // Fetch badge progress
  const { data: badgeProgress = [], isLoading: progressLoading } = useQuery<BadgeProgress[]>({
    queryKey: ["/api/achievements/progress"],
  });

  // Fetch leaderboard
  const { data: leaderboard = [] } = useQuery({
    queryKey: ["/api/achievements/leaderboard"],
  });

  // Check for new badges mutation
  const checkNewBadgesMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/achievements/check", {});
    },
    onSuccess: (data) => {
      if (data.newBadges && data.newBadges.length > 0) {
        // Show notification for first new badge
        const newBadge = data.newBadges[0];
        setNewBadgeNotification(newBadge.badge);
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["/api/achievements/badges"] });
        queryClient.invalidateQueries({ queryKey: ["/api/achievements/progress"] });
      }
    }
  });

  // Update user progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ activity, value = 1 }: { activity: string; value?: number }) => {
      return await apiRequest("POST", `/api/achievements/progress/${activity}`, { value });
    },
    onSuccess: () => {
      // Check for new badges after updating progress
      checkNewBadgesMutation.mutate();
    }
  });

  // Helper functions
  const checkForNewBadges = () => {
    checkNewBadgesMutation.mutate();
  };

  const updateUserProgress = (activity: string, value: number = 1) => {
    updateProgressMutation.mutate({ activity, value });
  };

  const dismissBadgeNotification = () => {
    setNewBadgeNotification(null);
  };

  // Calculate stats
  const totalPoints = userBadges.reduce((sum, userBadge) => sum + userBadge.badge.points, 0);
  const badgesByTier = userBadges.reduce((acc, userBadge) => {
    acc[userBadge.badge.tier] = (acc[userBadge.badge.tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const badgesByCategory = userBadges.reduce((acc, userBadge) => {
    acc[userBadge.badge.category] = (acc[userBadge.badge.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Auto-check for badges when component mounts
  useEffect(() => {
    if (!badgesLoading) {
      checkForNewBadges();
    }
  }, [badgesLoading]);

  return {
    // Data
    userBadges,
    badgeProgress,
    leaderboard,
    newBadgeNotification,
    
    // Loading states
    badgesLoading,
    progressLoading,
    isCheckingBadges: checkNewBadgesMutation.isPending,
    isUpdatingProgress: updateProgressMutation.isPending,
    
    // Stats
    totalPoints,
    badgesByTier,
    badgesByCategory,
    totalBadges: userBadges.length,
    
    // Actions
    checkForNewBadges,
    updateUserProgress,
    dismissBadgeNotification,
  };
}