import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BadgeCard } from "./BadgeCard";
import { BadgeIcon } from "./BadgeIcon";
import { AchievementNotification } from "./AchievementNotification";
import { useAchievements } from "@/hooks/useAchievements";
import { Trophy, Target, Star, Award, TrendingUp, Users } from "lucide-react";

export default function AchievementShowcase() {
  const {
    userBadges,
    badgeProgress,
    totalPoints,
    totalBadges,
    badgesByTier,
    newBadgeNotification,
    dismissBadgeNotification,
    checkForNewBadges,
    updateUserProgress,
    isCheckingBadges
  } = useAchievements();

  // Show sample badges for demo if no real badges exist
  const recentBadges = userBadges.slice(0, 3);
  const inProgressBadges = badgeProgress.filter(p => !p.isComplete).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Achievement Notification */}
      {newBadgeNotification && (
        <AchievementNotification
          badge={newBadgeNotification}
          isVisible={true}
          onClose={dismissBadgeNotification}
        />
      )}

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Achievement Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning progress and unlock badges as you master new skills
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {totalPoints.toLocaleString()}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-2xl font-bold">{totalBadges}</p>
              </div>
              <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{inProgressBadges.length}</p>
              </div>
              <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gold Badges</p>
                <p className="text-2xl font-bold">{badgesByTier.gold || 0}</p>
              </div>
              <BadgeIcon tier="gold" category="mastery" size="sm" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Recent Achievements
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={checkForNewBadges}
            disabled={isCheckingBadges}
          >
            {isCheckingBadges ? "Checking..." : "Check for New Badges"}
          </Button>
        </div>

        {recentBadges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentBadges.map((userBadge) => (
              <BadgeCard
                key={userBadge.id}
                badge={userBadge.badge}
                isEarned={true}
                earnedAt={userBadge.earnedAt}
              />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No badges earned yet
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete assessments and engage with the platform to earn your first badge!
            </p>
            <Button
              onClick={() => updateUserProgress("assessment_completed")}
              disabled={isCheckingBadges}
            >
              Simulate Assessment Completion
            </Button>
          </Card>
        )}
      </div>

      {/* Progress Badges */}
      {inProgressBadges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            In Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inProgressBadges.map((progressItem) => {
              const badgeData = userBadges.find(ub => ub.badge.id === progressItem.badgeId)?.badge;
              if (!badgeData) return null;

              return (
                <BadgeCard
                  key={progressItem.badgeId}
                  badge={badgeData}
                  isEarned={false}
                  progress={{
                    currentValue: progressItem.currentValue,
                    targetValue: progressItem.targetValue,
                    percentage: progressItem.percentage
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Earn More Badges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-16 text-left justify-start"
            onClick={() => updateUserProgress("streak_day")}
          >
            <div>
              <div className="font-medium">Extend Learning Streak</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Complete daily activities</div>
            </div>
          </Button>
          <Button
            variant="outline" 
            className="h-16 text-left justify-start"
            onClick={() => updateUserProgress("ai_interaction")}
          >
            <div>
              <div className="font-medium">Chat with AI Tutor</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Get personalized guidance</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-16 text-left justify-start"
            onClick={() => updateUserProgress("social_interaction")}
          >
            <div>
              <div className="font-medium">Join Study Group</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Collaborate with peers</div>
            </div>
          </Button>
        </div>
      </div>

      {/* View All Badges Button */}
      <div className="text-center">
        <Button 
          size="lg"
          onClick={() => window.location.href = '/achievements'}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          View All Achievements
        </Button>
      </div>
    </div>
  );
}