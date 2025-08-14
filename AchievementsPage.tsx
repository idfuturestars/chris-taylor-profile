import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BadgeCard } from "./BadgeCard";
import { BadgeIcon } from "./BadgeIcon";
import { Trophy, Target, Users, Star, Award, TrendingUp } from "lucide-react";

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

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: userBadges = [] } = useQuery<UserBadge[]>({
    queryKey: ["/api/achievements/badges"],
  });

  const { data: badgeProgress = [] } = useQuery<BadgeProgress[]>({
    queryKey: ["/api/achievements/progress"],
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ["/api/achievements/leaderboard"],
  });

  // Calculate stats
  const totalPoints = userBadges.reduce((sum, userBadge) => sum + userBadge.badge.points, 0);
  const badgesByTier = userBadges.reduce((acc, userBadge) => {
    acc[userBadge.badge.tier] = (acc[userBadge.badge.tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = [
    { id: "all", label: "All", icon: Star },
    { id: "assessment", label: "Assessments", icon: Trophy },
    { id: "learning", label: "Learning", icon: Target },
    { id: "streak", label: "Streaks", icon: TrendingUp },
    { id: "ai", label: "AI Interaction", icon: Award },
    { id: "social", label: "Social", icon: Users },
  ];

  // Group badges by category
  const earnedBadges = userBadges.map(ub => ({ ...ub.badge, earnedAt: ub.earnedAt }));
  const progressBadges = badgeProgress.filter(p => !p.isComplete);

  const filteredEarnedBadges = selectedCategory === "all" 
    ? earnedBadges 
    : earnedBadges.filter(badge => badge.category === selectedCategory);

  const filteredProgressBadges = selectedCategory === "all"
    ? progressBadges
    : progressBadges.filter(p => {
        const badge = userBadges.find(ub => ub.badge.id === p.badgeId)?.badge;
        return badge?.category === selectedCategory;
      });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Achievements
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and unlock badges as you learn and grow
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
                <p className="text-2xl font-bold">{userBadges.length}</p>
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
                <p className="text-2xl font-bold">{progressBadges.length}</p>
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

      <Tabs defaultValue="earned" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="earned">Earned Badges</TabsTrigger>
          <TabsTrigger value="progress">In Progress</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="earned">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="cursor-pointer flex items-center gap-1 px-3 py-1"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <IconComponent className="w-3 h-3" />
                  {category.label}
                </Badge>
              );
            })}
          </div>

          {/* Earned Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEarnedBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isEarned={true}
                earnedAt={badge.earnedAt}
              />
            ))}
          </div>

          {filteredEarnedBadges.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No badges earned yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Complete assessments and engage with the platform to start earning badges!
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProgressBadges.map((progressItem) => {
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

          {filteredProgressBadges.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No badges in progress
              </h3>
              <p className="text-sm text-muted-foreground">
                All available badges have been earned! Check back for new challenges.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Badge Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(leaderboard as any[]).map((entry: any, index: number) => (
                  <div key={entry.userId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? "bg-yellow-500 text-white" :
                        index === 1 ? "bg-gray-400 text-white" :
                        index === 2 ? "bg-amber-600 text-white" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {entry.user.firstName} {entry.user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {entry.badgeCount} badges
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{entry.totalPoints} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}