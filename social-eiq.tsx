import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Trophy,
  Brain,
  Search,
  UserPlus,
  Star,
  Network,
  Globe,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface CohortMember {
  id: string;
  username: string;
  displayName: string;
  profileImageUrl?: string;
  eiqScore: number;
  rank: number;
  recentActivity: string[];
  studyStreak: number;
  specializations: string[];
  joinedDate: string;
  lastActive: string;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  avgEiqScore: number;
  category: string;
  isJoined: boolean;
  recentDiscussions: number;
  weeklyGoal: string;
}

interface CohortActivity {
  id: string;
  type: 'achievement' | 'assessment' | 'discussion' | 'milestone';
  userId: string;
  username: string;
  description: string;
  timestamp: string;
  eiqGain?: number;
}

interface CohortChallenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  totalParticipants: number;
  daysLeft: number;
  reward: string;
  isParticipating: boolean;
  leaderboard: Array<{
    rank: number;
    username: string;
    score: number;
  }>;
}

export default function SocialEIQPage() {
  const [cohortMembers, setCohortMembers] = useState<CohortMember[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [recentActivity, setRecentActivity] = useState<CohortActivity[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<CohortChallenge[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('cohorts');
  const [userStats, setUserStats] = useState({
    rank: 0,
    eiqScore: 0,
    cohortSize: 0,
    studyStreak: 0
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    try {
      // Load cohort members
      const membersResponse = await apiRequest('GET', '/api/social/cohort/members?limit=50');
      const membersData = await membersResponse.json();
      setCohortMembers(membersData.members || sampleMembers);
      
      // Load study groups
      const groupsResponse = await apiRequest('GET', '/api/social/study-groups');
      const groupsData = await groupsResponse.json();
      setStudyGroups(groupsData.groups || sampleStudyGroups);
      
      // Load recent activity
      const activityResponse = await apiRequest('GET', '/api/social/activity?limit=20');
      const activityData = await activityResponse.json();
      setRecentActivity(activityData.activities || sampleActivity);
      
      // Load active challenges
      const challengesResponse = await apiRequest('GET', '/api/social/challenges/active');
      const challengesData = await challengesResponse.json();
      setActiveChallenges(challengesData.challenges || sampleChallenges);
      
      // Load user stats
      const statsResponse = await apiRequest('GET', '/api/social/user/stats');
      const statsData = await statsResponse.json();
      setUserStats(statsData || {
        rank: 42,
        eiqScore: 742,
        cohortSize: 1247,
        studyStreak: 15
      });
      
    } catch (error) {
      console.error('Failed to load social data:', error);
      // Use sample data as fallback
      setCohortMembers(sampleMembers);
      setStudyGroups(sampleStudyGroups);
      setRecentActivity(sampleActivity);
      setActiveChallenges(sampleChallenges);
    }
  };

  const joinStudyGroup = async (groupId: string) => {
    try {
      await apiRequest('POST', `/api/social/study-groups/${groupId}/join`);
      
      setStudyGroups(prev => 
        prev.map(group => 
          group.id === groupId 
            ? { ...group, isJoined: true, memberCount: group.memberCount + 1 }
            : group
        )
      );
      
      toast({
        title: "Joined Study Group!",
        description: "You're now part of this learning community."
      });
    } catch (error) {
      console.error('Failed to join study group:', error);
      toast({
        title: "Failed to join group",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const joinChallenge = async (challengeId: string) => {
    try {
      await apiRequest('POST', `/api/social/challenges/${challengeId}/join`);
      
      setActiveChallenges(prev =>
        prev.map(challenge =>
          challenge.id === challengeId
            ? { ...challenge, isParticipating: true, participants: challenge.participants + 1 }
            : challenge
        )
      );
      
      toast({
        title: "Challenge Joined!",
        description: "Good luck in the competition!"
      });
    } catch (error) {
      console.error('Failed to join challenge:', error);
      toast({
        title: "Failed to join challenge",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredMembers = cohortMembers.filter(member =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sample data for fallback
  const sampleMembers: CohortMember[] = [
    {
      id: '1',
      username: 'alex_scholar',
      displayName: 'Alex Johnson',
      profileImageUrl: '',
      eiqScore: 785,
      rank: 12,
      recentActivity: ['Completed Advanced Math Assessment', 'Joined AI Study Group'],
      studyStreak: 23,
      specializations: ['Mathematics', 'AI/ML'],
      joinedDate: '2025-01-15',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      username: 'sarah_genius',
      displayName: 'Sarah Chen',
      profileImageUrl: '',
      eiqScore: 823,
      rank: 8,
      recentActivity: ['Achieved 30-day streak', 'Top scorer in Viral Challenge'],
      studyStreak: 31,
      specializations: ['Physics', 'Data Science'],
      joinedDate: '2025-01-10',
      lastActive: '1 hour ago'
    }
  ];

  const sampleStudyGroups: StudyGroup[] = [
    {
      id: '1',
      name: 'Advanced Mathematics Cohort',
      description: 'Deep dive into calculus, statistics, and mathematical reasoning',
      memberCount: 156,
      avgEiqScore: 745,
      category: 'Mathematics',
      isJoined: false,
      recentDiscussions: 12,
      weeklyGoal: 'Complete 5 advanced problem sets'
    },
    {
      id: '2',
      name: 'AI & Machine Learning Explorers',
      description: 'Exploring artificial intelligence and machine learning concepts',
      memberCount: 203,
      avgEiqScore: 780,
      category: 'Technology',
      isJoined: true,
      recentDiscussions: 8,
      weeklyGoal: 'Build a simple ML model'
    }
  ];

  const sampleActivity: CohortActivity[] = [
    {
      id: '1',
      type: 'achievement',
      userId: '1',
      username: 'alex_scholar',
      description: 'Unlocked "Problem Solver" badge',
      timestamp: '2 hours ago',
      eiqGain: 15
    },
    {
      id: '2',
      type: 'assessment',
      userId: '2',
      username: 'sarah_genius',
      description: 'Completed Multi-Modal Assessment with 94% score',
      timestamp: '4 hours ago',
      eiqGain: 28
    }
  ];

  const sampleChallenges: CohortChallenge[] = [
    {
      id: '1',
      title: 'February EIQ Sprint',
      description: '30-day intensive learning challenge to boost EIQ scores',
      participants: 847,
      totalParticipants: 1200,
      daysLeft: 18,
      reward: '500 EIQ Bonus Points + Premium Badge',
      isParticipating: false,
      leaderboard: [
        { rank: 1, username: 'genius_mike', score: 156 },
        { rank: 2, username: 'study_queen', score: 142 },
        { rank: 3, username: 'math_wizard', score: 138 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
            <Network className="text-indigo-500" />
            Social EIQ Cohorts
            <Globe className="text-cyan-500" />
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Connect, learn, and grow with your global learning community
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{userStats.eiqScore}</div>
              <div className="text-sm text-gray-500">Your EIQ Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">#{userStats.rank}</div>
              <div className="text-sm text-gray-500">Global Rank</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.cohortSize.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Cohort Size</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{userStats.studyStreak}</div>
              <div className="text-sm text-gray-500">Study Streak</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cohorts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Cohort Members
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Study Groups
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Activity Feed
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Challenges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cohorts" className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search cohort members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Friends
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={member.profileImageUrl} />
                        <AvatarFallback>
                          {member.displayName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{member.displayName}</h3>
                        <p className="text-sm text-gray-500">@{member.username}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        #{member.rank}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">EIQ Score:</span>
                        <div className="font-bold text-indigo-600">{member.eiqScore}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Streak:</span>
                        <div className="font-bold text-green-600">{member.studyStreak} days</div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Specializations:</div>
                      <div className="flex flex-wrap gap-1">
                        {member.specializations.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 mb-3">
                      Last active: {member.lastActive}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        <Star className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {studyGroups.map((group) => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">{group.category}</Badge>
                      </div>
                      <Badge variant={group.isJoined ? "default" : "secondary"}>
                        {group.isJoined ? "Joined" : "Available"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {group.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Members:</span>
                        <div className="font-semibold">{group.memberCount}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg EIQ:</span>
                        <div className="font-semibold">{group.avgEiqScore}</div>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-500">Weekly Goal:</span>
                      <div className="font-medium text-purple-600">{group.weeklyGoal}</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        {group.recentDiscussions} recent discussions
                      </div>
                      {!group.isJoined ? (
                        <Button size="sm" onClick={() => joinStudyGroup(group.id)}>
                          Join Group
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          View Group
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Cohort Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">@{activity.username}</span>
                            {activity.eiqGain && (
                              <Badge variant="secondary" className="text-xs">
                                +{activity.eiqGain} EIQ
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {activity.description}
                          </p>
                          <div className="text-xs text-gray-400 mt-2">
                            {activity.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            {activeChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{challenge.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        {challenge.description}
                      </p>
                    </div>
                    <Badge variant={challenge.isParticipating ? "default" : "secondary"}>
                      {challenge.isParticipating ? "Participating" : "Join Now"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Participants:</span>
                      <div className="font-bold text-lg">
                        {challenge.participants.toLocaleString()}/{challenge.totalParticipants.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Days Left:</span>
                      <div className="font-bold text-lg text-orange-600">{challenge.daysLeft}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Reward:</span>
                      <div className="font-semibold text-sm text-purple-600">{challenge.reward}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Current Leaderboard
                    </h4>
                    <div className="space-y-2">
                      {challenge.leaderboard.slice(0, 3).map((entry) => (
                        <div key={entry.rank} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                          <div className="flex items-center gap-2">
                            <Badge variant={entry.rank === 1 ? "default" : "secondary"} className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                              {entry.rank}
                            </Badge>
                            <span className="font-medium">@{entry.username}</span>
                          </div>
                          <span className="font-bold">{entry.score} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!challenge.isParticipating ? (
                    <Button onClick={() => joinChallenge(challenge.id)} className="w-full">
                      <Trophy className="w-4 h-4 mr-2" />
                      Join Challenge
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full">
                      View My Progress
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}