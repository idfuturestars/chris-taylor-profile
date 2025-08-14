import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Star,
  Brain,
  Target,
  MessageSquare,
  Plus
} from "lucide-react";
import { useLocation } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  currentLevel: string;
  assessmentProgress: number;
  learningStreak: number;
  aiInteractions: number;
  lastLoginAt: string;
  cognitiveProfile?: {
    strengths: string[];
    improvementAreas: string[];
    eiqScore: number;
    learningVelocity: number;
    engagementScore: number;
  };
  recentActivity?: {
    assessmentsCompleted: number;
    timeSpent: number;
    conceptsMastered: number;
  };
}

interface StaffObservation {
  id: string;
  title: string;
  content: string;
  observationType: string;
  priority: string;
  createdAt: string;
  student: {
    firstName: string;
    lastName: string;
  };
}

export default function StaffDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [observationForm, setObservationForm] = useState({
    title: "",
    content: "",
    observationType: "progress_note",
    priority: "medium",
    studentId: ""
  });

  // Fetch assigned students
  const { data: assignedStudents, isLoading: studentsLoading } = useQuery<StudentData[]>({
    queryKey: ["/api/staff/assigned-students"],
    enabled: user?.role === "staff"
  });

  // Fetch staff observations
  const { data: observations, isLoading: observationsLoading } = useQuery<StaffObservation[]>({
    queryKey: ["/api/staff/observations"],
    enabled: user?.role === "staff"
  });

  // Fetch student analytics
  const { data: studentAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/staff/student-analytics", selectedStudent],
    enabled: selectedStudent !== null
  });

  // Create observation mutation
  const createObservationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/staff/observations", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff/observations"] });
      setObservationForm({
        title: "",
        content: "",
        observationType: "progress_note",
        priority: "medium",
        studentId: ""
      });
      toast({
        title: "Success",
        description: "Observation recorded successfully"
      });
    }
  });

  const handleCreateObservation = () => {
    if (!observationForm.title || !observationForm.content || !selectedStudent) return;
    
    createObservationMutation.mutate({
      ...observationForm,
      studentId: selectedStudent
    });
  };

  if (user?.role !== "staff") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold">Access Restricted</h3>
              <p className="text-muted-foreground">This area is for educational staff only.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mockProgressData = [
    { date: '2024-01', score: 65 },
    { date: '2024-02', score: 68 },
    { date: '2024-03', score: 72 },
    { date: '2024-04', score: 75 },
    { date: '2024-05', score: 78 },
    { date: '2024-06', score: 82 }
  ];

  const mockDomainScores = [
    { domain: 'Math', score: 85 },
    { domain: 'Logic', score: 78 },
    { domain: 'Verbal', score: 82 },
    { domain: 'Spatial', score: 75 },
    { domain: 'Memory', score: 88 },
    { domain: 'Speed', score: 79 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Staff Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor and analyze student progress across your assigned cohort
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignedStudents?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active learners under your guidance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                Currently in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interventions</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Students needing attention
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="students">Student Overview</TabsTrigger>
            <TabsTrigger value="analytics">Progress Analytics</TabsTrigger>
            <TabsTrigger value="observations">Observations</TabsTrigger>
            <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
            <TabsTrigger value="custom-questions">Custom Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Assigned Students</CardTitle>
                <CardDescription>
                  Monitor individual student progress and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {studentsLoading ? (
                  <div className="text-center py-8">Loading students...</div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {assignedStudents?.map((student) => (
                      <Card 
                        key={student.id}
                        className={`cursor-pointer transition-colors hover:bg-accent ${
                          selectedStudent === student.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedStudent(student.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={student.profileImageUrl} />
                              <AvatarFallback>
                                {student.firstName[0]}{student.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">
                                {student.firstName} {student.lastName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Level: {student.currentLevel}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Assessment Progress</span>
                                <span>{student.assessmentProgress}%</span>
                              </div>
                              <Progress value={student.assessmentProgress} />
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                Streak: {student.learningStreak}
                              </span>
                              <span className="flex items-center gap-1">
                                <Brain className="h-3 w-3" />
                                EiQ: {student.cognitiveProfile?.eiqScore || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {student.cognitiveProfile?.engagementScore && student.cognitiveProfile.engagementScore > 8 && (
                                <Badge variant="secondary" className="text-green-700 bg-green-100">
                                  High Engagement
                                </Badge>
                              )}
                              {student.learningStreak > 7 && (
                                <Badge variant="secondary" className="text-blue-700 bg-blue-100">
                                  Consistent Learner
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Trend</CardTitle>
                  <CardDescription>Student EiQ score improvement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#2563eb" 
                        strokeWidth={2} 
                        dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Domain Analysis</CardTitle>
                  <CardDescription>Performance across cognitive domains</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockDomainScores}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="domain" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {selectedStudent && (
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Student Analytics</CardTitle>
                  <CardDescription>
                    Comprehensive analysis for selected student
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="text-center p-4 border rounded-lg">
                        <Brain className="mx-auto h-8 w-8 mb-2 text-blue-500" />
                        <p className="text-2xl font-bold">82</p>
                        <p className="text-sm text-muted-foreground">Current EiQ Score</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="text-center p-4 border rounded-lg">
                        <TrendingUp className="mx-auto h-8 w-8 mb-2 text-green-500" />
                        <p className="text-2xl font-bold">+12%</p>
                        <p className="text-sm text-muted-foreground">Learning Velocity</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="text-center p-4 border rounded-lg">
                        <Target className="mx-auto h-8 w-8 mb-2 text-purple-500" />
                        <p className="text-2xl font-bold">8.5/10</p>
                        <p className="text-sm text-muted-foreground">Engagement Score</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="observations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Observation</CardTitle>
                  <CardDescription>
                    Record notes and recommendations for student development
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Observation Title</Label>
                    <Input
                      id="title"
                      value={observationForm.title}
                      onChange={(e) => setObservationForm({...observationForm, title: e.target.value})}
                      placeholder="Brief description of observation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={observationForm.content}
                      onChange={(e) => setObservationForm({...observationForm, content: e.target.value})}
                      placeholder="Detailed observation and recommendations..."
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={observationForm.observationType}
                        onChange={(e) => setObservationForm({...observationForm, observationType: e.target.value})}
                      >
                        <option value="progress_note">Progress Note</option>
                        <option value="recommendation">Recommendation</option>
                        <option value="intervention">Intervention</option>
                        <option value="milestone">Milestone</option>
                      </select>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={observationForm.priority}
                        onChange={(e) => setObservationForm({...observationForm, priority: e.target.value})}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  <Button 
                    onClick={handleCreateObservation}
                    disabled={!selectedStudent || !observationForm.title || !observationForm.content || createObservationMutation.isPending}
                    className="w-full"
                  >
                    {createObservationMutation.isPending ? "Recording..." : "Record Observation"}
                  </Button>
                  {!selectedStudent && (
                    <p className="text-sm text-muted-foreground">
                      Please select a student first
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Observations</CardTitle>
                  <CardDescription>Your latest student observations and notes</CardDescription>
                </CardHeader>
                <CardContent>
                  {observationsLoading ? (
                    <div className="text-center py-8">Loading observations...</div>
                  ) : (
                    <div className="space-y-4">
                      {observations?.map((observation) => (
                        <div key={observation.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{observation.title}</h4>
                            <Badge variant={
                              observation.priority === 'urgent' ? 'destructive' :
                              observation.priority === 'high' ? 'default' :
                              'secondary'
                            }>
                              {observation.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {observation.student.firstName} {observation.student.lastName} • 
                            {new Date(observation.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm">{observation.content}</p>
                          <Badge variant="outline" className="mt-2">
                            {observation.observationType.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>
                  Machine learning recommendations for student intervention and support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <h4 className="font-semibold">High Engagement Students</h4>
                    </div>
                    <p className="text-sm mb-3">
                      3 students showing exceptional engagement and rapid progress
                    </p>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-100 text-blue-700">Advanced Track Ready</Badge>
                      <Badge className="bg-green-100 text-green-700">Mentorship Opportunity</Badge>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      <h4 className="font-semibold">Students Needing Support</h4>
                    </div>
                    <p className="text-sm mb-3">
                      2 students showing signs of disengagement and declining performance
                    </p>
                    <div className="flex gap-2">
                      <Badge className="bg-orange-100 text-orange-700">Early Intervention</Badge>
                      <Badge className="bg-red-100 text-red-700">Review Learning Style</Badge>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-green-500" />
                      <h4 className="font-semibold">Optimization Opportunities</h4>
                    </div>
                    <p className="text-sm mb-3">
                      Suggested improvements to enhance overall cohort performance
                    </p>
                    <div className="flex gap-2">
                      <Badge className="bg-green-100 text-green-700">Group Sessions</Badge>
                      <Badge className="bg-purple-100 text-purple-700">Peer Learning</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom-questions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Questions Management</CardTitle>
                <CardDescription>
                  Create AI-powered custom questions for personalized student learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Brain className="w-12 h-12 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      AI-Powered Question Generation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Generate personalized questions using advanced AI to target specific cognitive domains, difficulty levels, and learning objectives for your students.
                    </p>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Adaptive difficulty based on student performance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Multiple cognitive domains supported</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Real-time analytics and completion tracking</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setLocation('/custom-questions-staff')}
                    size="lg"
                    className="gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Manage Questions
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="text-center p-4 border rounded-lg">
                    <Brain className="mx-auto h-8 w-8 mb-2 text-purple-500" />
                    <p className="text-2xl font-bold">AI-Generated</p>
                    <p className="text-sm text-muted-foreground">Smart Content Creation</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Target className="mx-auto h-8 w-8 mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">Targeted</p>
                    <p className="text-sm text-muted-foreground">Domain-Specific Learning</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="mx-auto h-8 w-8 mb-2 text-green-500" />
                    <p className="text-2xl font-bold">Adaptive</p>
                    <p className="text-sm text-muted-foreground">Performance-Based Difficulty</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}