import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Headphones, 
  Trophy, 
  Globe, 
  Users, 
  Clock, 
  Star, 
  Target, 
  Zap,
  Medal,
  Gamepad2,
  Rocket,
  Brain,
  Crown
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface VrCompetition {
  id: string;
  title: string;
  description: string;
  competitionType: string;
  subject: string;
  difficulty: string;
  vrEnvironment: string;
  maxParticipants: number;
  entryRequirement: string;
  prizeStructure: any;
  startDate: string;
  endDate: string;
  status: string;
  leaderboard: any;
}

interface VrParticipant {
  id: string;
  competitionId: string;
  entryEiQScore: string;
  currentScore: string;
  rank: number;
  completedChallenges: number;
  totalTimeSpent: number;
  vrSessionData: any;
  achievements: string[];
  joinedAt: string;
}

const VR_ENVIRONMENTS = {
  space_station: { icon: Rocket, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900" },
  ancient_library: { icon: Brain, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900" },
  futuristic_lab: { icon: Zap, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900" }
};

const DIFFICULTY_COLORS = {
  foundation: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  advanced: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  mastery: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
};

export default function VRCompetitions() {
  const [selectedCompetition, setSelectedCompetition] = useState<VrCompetition | null>(null);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [userEiQScore, setUserEiQScore] = useState("");
  const queryClient = useQueryClient();

  const { data: activeCompetitions } = useQuery({
    queryKey: ["/api/vr-competitions/active"]
  });

  const { data: allCompetitions } = useQuery({
    queryKey: ["/api/vr-competitions"]
  });

  const { data: myCompetitions } = useQuery({
    queryKey: ["/api/vr-competitions/my-competitions"]
  });

  const joinCompetitionMutation = useMutation({
    mutationFn: (data: { competitionId: string; entryEiQScore: string }) =>
      apiRequest("POST", `/api/vr-competitions/${data.competitionId}/join`, { 
        entryEiQScore: data.entryEiQScore 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vr-competitions/my-competitions"] });
      setJoinDialogOpen(false);
      setUserEiQScore("");
    }
  });

  const joinCompetition = () => {
    if (!selectedCompetition || !userEiQScore) return;
    joinCompetitionMutation.mutate({
      competitionId: selectedCompetition.id,
      entryEiQScore: userEiQScore
    });
  };

  const getEnvironmentIcon = (environment: string) => {
    const env = VR_ENVIRONMENTS[environment as keyof typeof VR_ENVIRONMENTS];
    if (!env) return { icon: Gamepad2, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-800" };
    return env;
  };

  const formatTimeSpent = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Headphones className="w-8 h-8 text-primary" />
            VR Global Competitions
          </h2>
          <p className="text-muted-foreground">Immersive learning environments with global competition</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Active Competitions
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            All Competitions
          </TabsTrigger>
          <TabsTrigger value="my" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            My Competitions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(activeCompetitions) && activeCompetitions.map((competition: VrCompetition) => {
              const envConfig = getEnvironmentIcon(competition.vrEnvironment);
              const EnvIcon = envConfig.icon;
              
              return (
                <Card key={competition.id} className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${envConfig.bg} mb-3`}>
                        <EnvIcon className={`w-6 h-6 ${envConfig.color}`} />
                      </div>
                      <Badge className={DIFFICULTY_COLORS[competition.difficulty as keyof typeof DIFFICULTY_COLORS]}>
                        {competition.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {competition.title}
                    </CardTitle>
                    <CardDescription>{competition.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Participants
                        </span>
                        <span>{competition.leaderboard?.participants || 0}/{competition.maxParticipants}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          Min EiQ™
                        </span>
                        <span>{competition.entryRequirement}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Ends
                        </span>
                        <span>{new Date(competition.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {competition.prizeStructure && (
                      <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border">
                        <div className="flex items-center gap-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          <Trophy className="w-4 h-4" />
                          Prize Pool
                        </div>
                        <div className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                          {competition.prizeStructure.total || "Scholarships & Internships"}
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setSelectedCompetition(competition);
                        setJoinDialogOpen(true);
                      }}
                    >
                      <Headphones className="w-4 h-4 mr-2" />
                      Enter VR Competition
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(allCompetitions) && allCompetitions.map((competition: VrCompetition) => {
              const envConfig = getEnvironmentIcon(competition.vrEnvironment);
              const EnvIcon = envConfig.icon;
              
              return (
                <Card key={competition.id} className={`transition-all duration-200 ${
                  competition.status === 'active' ? 'border-l-4 border-l-green-500' :
                  competition.status === 'upcoming' ? 'border-l-4 border-l-blue-500' :
                  'border-l-4 border-l-gray-300 opacity-75'
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${envConfig.bg} mb-3`}>
                        <EnvIcon className={`w-6 h-6 ${envConfig.color}`} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={DIFFICULTY_COLORS[competition.difficulty as keyof typeof DIFFICULTY_COLORS]}>
                          {competition.difficulty}
                        </Badge>
                        <Badge variant={competition.status === 'active' ? 'default' : 'secondary'}>
                          {competition.status}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle>{competition.title}</CardTitle>
                    <CardDescription>{competition.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Environment:</span>
                        <span className="capitalize">{competition.vrEnvironment.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subject:</span>
                        <span className="capitalize">{competition.subject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="capitalize">{competition.competitionType.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>
                          {new Date(competition.startDate).toLocaleDateString()} - {' '}
                          {new Date(competition.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="my" className="space-y-4">
          {Array.isArray(myCompetitions) && myCompetitions.length > 0 ? (
            <div className="space-y-4">
              {Array.isArray(myCompetitions) && myCompetitions.map((participant: VrParticipant) => (
                <Card key={participant.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Crown className="w-5 h-5 text-yellow-500" />
                          Competition Progress
                        </h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Rank:</span>
                            <Badge variant="outline">#{participant.rank}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Score:</span>
                            <span className="font-medium">{parseFloat(participant.currentScore).toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Entry EiQ™:</span>
                            <span>{participant.entryEiQScore}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Target className="w-5 h-5 text-green-500" />
                          Activity Stats
                        </h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Challenges:</span>
                            <span>{participant.completedChallenges}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time Spent:</span>
                            <span>{formatTimeSpent(participant.totalTimeSpent)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Joined:</span>
                            <span>{new Date(participant.joinedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Medal className="w-5 h-5 text-purple-500" />
                          Achievements
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {participant.achievements?.length > 0 ? 
                            participant.achievements.map((achievement: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                {achievement}
                              </Badge>
                            )) : (
                              <span className="text-sm text-muted-foreground">No achievements yet</span>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Headphones className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No VR Competitions Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Join an active competition to start your immersive learning journey
                </p>
                <Button onClick={() => {
                  const activeTab = document.querySelector('[value="active"]') as HTMLElement;
                  activeTab?.click();
                }}>
                  Browse Active Competitions
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join VR Competition</DialogTitle>
            <DialogDescription>
              Enter your current EiQ™ score to join {selectedCompetition?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="eiqScore">Your Current EiQ™ Score</Label>
              <Input
                id="eiqScore"
                type="number"
                step="0.1"
                value={userEiQScore}
                onChange={(e) => setUserEiQScore(e.target.value)}
                placeholder="e.g., 85.5"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Minimum required: {selectedCompetition?.entryRequirement}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setJoinDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={joinCompetition}
                disabled={joinCompetitionMutation.isPending || !userEiQScore}
              >
                {joinCompetitionMutation.isPending ? "Joining..." : "Join Competition"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}