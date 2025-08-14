import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Users, Plus, BookOpen, Brain, MessageCircle, Target, Trophy, Clock, Zap } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface StudyCohort {
  id: string;
  name: string;
  description: string;
  topic: string;
  maxMembers: number;
  currentMembers: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  aiRecommendations?: string[];
  studyPlan?: any;
  memberProgress?: any[];
}

export default function StudyCohorts() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCohort, setNewCohort] = useState({
    name: "",
    description: "",
    topic: "",
    maxMembers: 10
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all study cohorts
  const { data: studyCohorts, isLoading } = useQuery({
    queryKey: ["/api/study-cohorts"],
  });

  // Fetch user's study cohorts
  const { data: userCohorts } = useQuery({
    queryKey: ["/api/study-cohorts/user"],
  });

  // Create study cohort mutation with AI integration
  const createCohortMutation = useMutation({
    mutationFn: async (cohortData: any) => {
      return apiRequest("POST", "/api/study-cohorts", cohortData);
    },
    onSuccess: (data) => {
      toast({
        title: "Study Cohort Created!",
        description: `${data.name} has been created with AI-powered recommendations.`,
      });
      setShowCreateDialog(false);
      setNewCohort({ name: "", description: "", topic: "", maxMembers: 10 });
      queryClient.invalidateQueries({ queryKey: ["/api/study-cohorts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create study cohort. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Join study cohort mutation
  const joinCohortMutation = useMutation({
    mutationFn: async (cohortId: string) => {
      return apiRequest("POST", `/api/study-cohorts/${cohortId}/join`);
    },
    onSuccess: () => {
      toast({
        title: "Joined Study Cohort!",
        description: "Welcome to your new study cohort. AI recommendations are being generated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/study-cohorts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/study-cohorts/user"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to join study cohort. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateCohort = () => {
    if (!newCohort.name || !newCohort.topic) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createCohortMutation.mutate(newCohort);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-purple-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI-Powered Study Cohorts</h1>
              </div>
              <Badge variant="secondary" className="text-xs">Collaborative Learning</Badge>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-purple-500 hover:bg-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Cohort
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create AI-Enhanced Study Cohort</DialogTitle>
                  <DialogDescription>
                    Create a new study cohort with AI-powered recommendations and personalized study plans.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      value={newCohort.name}
                      onChange={(e) => setNewCohort({ ...newCohort, name: e.target.value })}
                      className="col-span-3"
                      placeholder="Study cohort name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="topic" className="text-right">
                      Topic *
                    </Label>
                    <Select onValueChange={(value) => setNewCohort({ ...newCohort, topic: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select study topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="language-arts">Language Arts</SelectItem>
                        <SelectItem value="social-studies">Social Studies</SelectItem>
                        <SelectItem value="ai-ethics">AI Ethics</SelectItem>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                        <SelectItem value="research-methods">Research Methods</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newCohort.description}
                      onChange={(e) => setNewCohort({ ...newCohort, description: e.target.value })}
                      className="col-span-3"
                      placeholder="Describe your study cohort goals..."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="maxMembers" className="text-right">
                      Max Members
                    </Label>
                    <Input
                      id="maxMembers"
                      type="number"
                      value={newCohort.maxMembers}
                      onChange={(e) => setNewCohort({ ...newCohort, maxMembers: parseInt(e.target.value) })}
                      className="col-span-3"
                      min="2"
                      max="50"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCohort} disabled={createCohortMutation.isPending}>
                    {createCohortMutation.isPending ? "Creating..." : "Create Cohort"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User's Study Cohorts */}
        {Array.isArray(userCohorts) && userCohorts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Study Cohorts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(userCohorts) && userCohorts.map((cohort: StudyCohort) => (
                <Card key={cohort.id} className="border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{cohort.name}</CardTitle>
                        <CardDescription>{cohort.topic}</CardDescription>
                      </div>
                      <Badge className="bg-purple-500">{cohort.currentMembers}/{cohort.maxMembers}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{cohort.description}</p>
                    
                    {/* AI Recommendations */}
                    {cohort.aiRecommendations && (
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <Brain className="h-4 w-4 text-purple-500 mr-2" />
                          <span className="text-sm font-medium">AI Recommendations</span>
                        </div>
                        <div className="space-y-1">
                          {cohort.aiRecommendations.slice(0, 2).map((rec: string, index: number) => (
                            <div key={index} className="text-xs bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                              {String(rec)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Study Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Cohort Progress</span>
                        <span className="text-sm text-gray-600">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Study Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Study Cohorts */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Discover Study Cohorts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(studyCohorts) && studyCohorts.map((cohort: StudyCohort) => (
              <Card key={cohort.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{cohort.name}</CardTitle>
                      <CardDescription>{cohort.topic}</CardDescription>
                    </div>
                    <Badge variant="outline">{cohort.currentMembers}/{cohort.maxMembers}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{cohort.description}</p>
                  
                  {/* Cohort Features */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Zap className="h-3 w-3 mr-1" />
                      AI-Enhanced
                    </div>
                    <div className="flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      Goal-Oriented
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Active
                    </div>
                  </div>

                  {/* Member Avatars */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(3, cohort.currentMembers))].map((_, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs">U{i + 1}</AvatarFallback>
                        </Avatar>
                      ))}
                      {cohort.currentMembers > 3 && (
                        <div className="h-6 w-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-xs">+{cohort.currentMembers - 3}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      size="sm" 
                      onClick={() => joinCohortMutation.mutate(cohort.id)}
                      disabled={joinCohortMutation.isPending || cohort.currentMembers >= cohort.maxMembers}
                    >
                      {cohort.currentMembers >= cohort.maxMembers ? "Full" : "Join"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Cohort Recommendations */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center">
              <Brain className="h-6 w-6 text-purple-500 mr-2" />
              <CardTitle>AI Cohort Recommendations</CardTitle>
            </div>
            <CardDescription>Personalized study cohort suggestions based on your learning profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Mathematics Mastery</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Join a calculus study cohort to improve your problem-solving speed by 40%
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium mb-2">AI Ethics Discussion</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Explore ethical AI concepts with peers to deepen your understanding
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Research Methods</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Collaborate on research projects to develop advanced analytical skills
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}