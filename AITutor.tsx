import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Target, TrendingUp, MessageCircle, Lightbulb, ChevronRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface CoachingResponse {
  content: string;
  improvements: string[];
  nextSteps: string[];
  engagementLevel: string;
}

interface TutoringSession {
  id: string;
  sessionType: string;
  subject: string;
  currentEiQScore: string;
  targetEiQScore: string;
  improvementPlan: any;
  conversationHistory: any[];
  learningGaps: any;
  progressMetrics: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AITutor() {
  const [message, setMessage] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const [sessionType, setSessionType] = useState("personalized_coaching");
  const [subject, setSubject] = useState("mathematics");
  const queryClient = useQueryClient();

  const { data: activeSession, isLoading: sessionLoading } = useQuery({
    queryKey: ["/api/ai-tutoring/sessions/active"],
    refetchInterval: 5000 // Refresh every 5 seconds for real-time updates
  });

  const { data: sessions } = useQuery({
    queryKey: ["/api/ai-tutoring/sessions"]
  });

  const createSessionMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/ai-tutoring/sessions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-tutoring/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ai-tutoring/sessions/active"] });
    }
  });

  const coachingMutation = useMutation({
    mutationFn: (data: { message: string; learningGoal: string }) => 
      apiRequest("POST", `/api/ai-tutoring/sessions/${(activeSession as any)?.id}/coach`, data),
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/ai-tutoring/sessions/active"] });
    }
  });

  const startNewSession = () => {
    createSessionMutation.mutate({
      sessionType,
      subject,
      currentEiQScore: "85.5", // This would come from user's current assessment
      targetEiQScore: "95.0",
      improvementPlan: {
        focus_areas: ["advanced_reasoning", "pattern_recognition"],
        estimated_timeline: "4_weeks",
        weekly_goals: ["Complete 15 practice problems", "Master 3 new concepts"]
      },
      conversationHistory: [],
      learningGaps: {
        identified_weaknesses: ["complex_algebraic_manipulation", "geometric_proofs"],
        strength_areas: ["basic_arithmetic", "logical_reasoning"]
      },
      progressMetrics: {
        totalInteractions: 0,
        engagementLevel: "high",
        conceptsMastered: 0
      },
      aiProvider: "openai"
    });
  };

  const sendMessage = () => {
    if (!message.trim() || !learningGoal.trim()) return;
    coachingMutation.mutate({ message, learningGoal });
  };

  if (sessionLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI EiQ™ Tutor</h2>
          <p className="text-muted-foreground">Personalized coaching to improve your EiQ™ score</p>
        </div>
        {!activeSession && (
          <Button onClick={startNewSession} disabled={createSessionMutation.isPending} className="bg-primary hover:bg-primary/90">
            <Brain className="w-4 h-4 mr-2" />
            Start Coaching Session
          </Button>
        )}
      </div>

      {!activeSession && (
        <Card>
          <CardHeader>
            <CardTitle>Configure Your Tutoring Session</CardTitle>
            <CardDescription>Choose your focus area and learning objectives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Session Type</Label>
                <Select value={sessionType} onValueChange={setSessionType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personalized_coaching">Personalized Coaching</SelectItem>
                    <SelectItem value="skill_improvement">Skill Improvement</SelectItem>
                    <SelectItem value="concept_review">Concept Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject Focus</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="reasoning">Applied Reasoning</SelectItem>
                    <SelectItem value="ai_concepts">AI Concepts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSession && (activeSession as any) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coaching Interface */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" />
                      Active Coaching Session
                    </CardTitle>
                    <CardDescription>
                      {(activeSession as any).subject} • {(activeSession as any).sessionType.replace('_', ' ')}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    {(activeSession as any).status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 w-full rounded-md border p-4 mb-4">
                  {(activeSession as any).conversationHistory?.length > 0 ? (
                    <div className="space-y-4">
                      {(activeSession as any).conversationHistory.map((msg: any, idx: number) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{msg.content}</p>
                            {msg.improvementSuggestions && (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2 text-xs">
                                  <Lightbulb className="w-3 h-3" />
                                  <span className="font-medium">Improvement Suggestions:</span>
                                </div>
                                <ul className="text-xs space-y-1 pl-4">
                                  {msg.improvementSuggestions.map((suggestion: string, i: number) => (
                                    <li key={i} className="flex items-center gap-1">
                                      <ChevronRight className="w-3 h-3" />
                                      {suggestion}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Start a conversation with your AI tutor</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="learningGoal">Current Learning Goal</Label>
                    <Input
                      id="learningGoal"
                      value={learningGoal}
                      onChange={(e) => setLearningGoal(e.target.value)}
                      placeholder="e.g., Improve algebraic reasoning, Master geometric proofs..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Ask your AI tutor</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask for help, explanation, or guidance on your learning journey..."
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={sendMessage} 
                    disabled={coachingMutation.isPending || !message.trim() || !learningGoal.trim()}
                    className="w-full"
                  >
                    {coachingMutation.isPending ? "Coaching..." : "Get AI Coaching"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  EiQ™ Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current EiQ™</span>
                    <span className="font-medium">{(activeSession as any).currentEiQScore}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Target EiQ™</span>
                    <span className="font-medium">{(activeSession as any).targetEiQScore}</span>
                  </div>
                  <Progress 
                    value={(parseFloat((activeSession as any).currentEiQScore) / parseFloat((activeSession as any).targetEiQScore)) * 100} 
                    className="h-2" 
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Session Metrics</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 rounded bg-muted">
                      <div className="font-medium">{(activeSession as any).progressMetrics?.totalInteractions || 0}</div>
                      <div className="text-muted-foreground">Interactions</div>
                    </div>
                    <div className="text-center p-2 rounded bg-muted">
                      <div className="font-medium capitalize">{(activeSession as any).progressMetrics?.engagementLevel || 'High'}</div>
                      <div className="text-muted-foreground">Engagement</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(activeSession as any).learningGaps && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    Learning Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(activeSession as any).learningGaps.identified_weaknesses && (
                    <div>
                      <h4 className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">Areas to Improve</h4>
                      <div className="flex flex-wrap gap-1">
                        {(activeSession as any).learningGaps.identified_weaknesses.map((weakness: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {weakness.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {(activeSession as any).learningGaps.strength_areas && (
                    <div>
                      <h4 className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Strengths</h4>
                      <div className="flex flex-wrap gap-1">
                        {(activeSession as any).learningGaps.strength_areas.map((strength: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {strength.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Session History */}
      {sessions && (sessions as any)?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Sessions</CardTitle>
            <CardDescription>Your coaching history and progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(sessions as any).slice(0, 5).map((session: TutoringSession) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium capitalize">{session.subject} • {session.sessionType.replace('_', ' ')}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(session.createdAt).toLocaleDateString()} • 
                      {session.progressMetrics?.totalInteractions || 0} interactions
                    </div>
                  </div>
                  <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                    {session.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}