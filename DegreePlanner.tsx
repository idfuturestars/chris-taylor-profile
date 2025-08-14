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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  Brain,
  ChevronRight,
  Plus,
  Edit,
  Eye
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface DegreePlan {
  id: string;
  planName: string;
  degreeProgramId: string;
  degreeProgram: {
    name: string;
    degreeType: string;
    totalCredits: number;
    estimatedDuration: number;
  };
  currentGPA: number;
  completedCredits: number;
  remainingCredits: number;
  projectedGraduationDate: string;
  planStatus: string;
  riskFactors: any[];
  eiqBasedRecommendations: any[];
}

interface Course {
  id: string;
  courseCode: string;
  title: string;
  credits: number;
  department: string;
  difficulty: string;
  recommendedEiQScore: number;
  prerequisites: any[];
  status?: string;
  plannedSemester?: string;
  eiqRecommendationScore?: number;
  difficultyPrediction?: string;
}

interface DegreeAudit {
  id: string;
  graduationEligibility: string;
  completedRequirements: any;
  pendingRequirements: any;
  missingRequirements: any;
  recommendedActions: any[];
  gpaCalculation: any;
}

export default function DegreePlanner() {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [viewMode, setViewMode] = useState<"overview" | "courses" | "audit" | "simulation">("overview");
  const [simulationData, setSimulationData] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: degreePlans, isLoading: plansLoading } = useQuery<DegreePlan[]>({
    queryKey: ["/api/degree-planning/plans"]
  });

  const { data: availablePrograms } = useQuery({
    queryKey: ["/api/degree-planning/programs"]
  });

  const { data: currentPlan } = useQuery<DegreePlan>({
    queryKey: ["/api/degree-planning/plans", selectedPlan],
    enabled: !!selectedPlan
  });

  const { data: plannedCourses } = useQuery({
    queryKey: ["/api/degree-planning/plans", selectedPlan, "courses"],
    enabled: !!selectedPlan
  });

  const { data: degreeAudit } = useQuery({
    queryKey: ["/api/degree-planning/plans", selectedPlan, "audit"],
    enabled: !!selectedPlan
  });

  const { data: courseDemand } = useQuery({
    queryKey: ["/api/degree-planning/course-demand"],
    refetchInterval: 60000 // Update demand data every minute
  });

  const createPlanMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/degree-planning/plans", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/degree-planning/plans"] });
    }
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: any }) => 
      apiRequest("PATCH", `/api/degree-planning/plans/${planId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/degree-planning/plans"] });
    }
  });

  const runAuditMutation = useMutation({
    mutationFn: (planId: string) => 
      apiRequest("POST", `/api/degree-planning/plans/${planId}/audit`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/degree-planning/plans", selectedPlan, "audit"] });
    }
  });

  const simulateGPAMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest("POST", `/api/degree-planning/plans/${selectedPlan}/simulate-gpa`, data),
    onSuccess: (result) => {
      setSimulationData(result);
    }
  });

  const planCompletionPercentage = currentPlan 
    ? Math.round((currentPlan.completedCredits / currentPlan.degreeProgram.totalCredits) * 100)
    : 0;

  const getRiskLevel = (riskFactors: any[]) => {
    if (!riskFactors || riskFactors.length === 0) return "low";
    if (riskFactors.length >= 3) return "high";
    return "medium";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_track": return "text-green-600";
      case "off_track": return "text-red-600";
      case "at_risk": return "text-yellow-600";
      default: return "text-blue-600";
    }
  };

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">EiQ™ Degree Planner</h1>
          <p className="text-muted-foreground">
            Automated, real-time degree planning powered by your EiQ™ scores
          </p>
        </div>
        <Button
          onClick={() => createPlanMutation.mutate({ degreeProgramId: "sample" })}
          disabled={createPlanMutation.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      {/* Plan Selection */}
      {degreePlans && Array.isArray(degreePlans) && degreePlans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Your Degree Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select a degree plan" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(degreePlans) ? degreePlans.map((plan: DegreePlan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{plan.planName}</span>
                      <Badge variant={plan.planStatus === "on_track" ? "default" : "secondary"}>
                        {plan.planStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                  </SelectItem>
                )) : null}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {currentPlan && (
        <>
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {[
              { key: "overview", label: "Overview", icon: Eye },
              { key: "courses", label: "Course Planning", icon: BookOpen },
              { key: "audit", label: "Degree Audit", icon: CheckCircle },
              { key: "simulation", label: "GPA Simulation", icon: TrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={viewMode === key ? "default" : "ghost"}
                onClick={() => setViewMode(key as any)}
                className="flex-1"
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>

          {/* Overview Tab */}
          {viewMode === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Overview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Degree Progress</CardTitle>
                  <CardDescription>
                    {currentPlan.degreeProgram.name} - {currentPlan.degreeProgram.degreeType}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Credits Completed</span>
                      <span className="text-sm text-muted-foreground">
                        {currentPlan.completedCredits} / {currentPlan.degreeProgram.totalCredits}
                      </span>
                    </div>
                    <Progress value={planCompletionPercentage} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {currentPlan.currentGPA.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Current GPA</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {currentPlan.remainingCredits}
                      </div>
                      <div className="text-sm text-muted-foreground">Credits Remaining</div>
                    </div>
                  </div>

                  {currentPlan.projectedGraduationDate && (
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium">Projected Graduation</span>
                      </div>
                      <span className="text-green-700 dark:text-green-300">
                        {new Date(currentPlan.projectedGraduationDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Risk Factors & Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className={`h-5 w-5 mr-2 ${
                      getRiskLevel(currentPlan.riskFactors) === "high" ? "text-red-500" : 
                      getRiskLevel(currentPlan.riskFactors) === "medium" ? "text-yellow-500" : 
                      "text-green-500"
                    }`} />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentPlan.riskFactors && currentPlan.riskFactors.length > 0 ? (
                    currentPlan.riskFactors.map((risk: any, index: number) => (
                      <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="font-medium text-yellow-800 dark:text-yellow-200">
                          {risk.factor}
                        </div>
                        <div className="text-sm text-yellow-600 dark:text-yellow-300">
                          {risk.description}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      On track with no identified risks
                    </div>
                  )}

                  {currentPlan.eiqBasedRecommendations && currentPlan.eiqBasedRecommendations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        EiQ™ Recommendations
                      </h4>
                      <div className="space-y-2">
                        {currentPlan.eiqBasedRecommendations.slice(0, 3).map((rec: any, index: number) => (
                          <div key={index} className="text-sm p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                            {rec.recommendation}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Course Planning Tab */}
          {viewMode === "courses" && plannedCourses && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Planned Courses</CardTitle>
                  <CardDescription>
                    Your semester-by-semester course plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {Object.entries(
                      Array.isArray(plannedCourses) ? plannedCourses.reduce((acc: any, course: Course) => {
                        const semester = course.plannedSemester || "Unscheduled";
                        if (!acc[semester]) acc[semester] = [];
                        acc[semester].push(course);
                        return acc;
                      }, {}) : {}
                    ).map(([semester, courses]) => (
                      <div key={semester} className="mb-6">
                        <h3 className="font-semibold mb-3 flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {semester}
                        </h3>
                        <div className="space-y-2">
                          {(courses as Course[]).map((course) => (
                            <div key={course.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">
                                    {course.courseCode} - {course.title}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {course.credits} credits • {course.department}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant={
                                    course.difficulty === "advanced" ? "destructive" :
                                    course.difficulty === "intermediate" ? "default" : 
                                    "secondary"
                                  }>
                                    {course.difficulty}
                                  </Badge>
                                  {course.eiqRecommendationScore && (
                                    <Badge variant="outline">
                                      EiQ™ {course.eiqRecommendationScore.toFixed(1)}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {course.difficultyPrediction && (
                                <div className="mt-2 text-sm text-blue-600">
                                  Predicted difficulty for you: {course.difficultyPrediction}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Course Demand Analytics */}
              {Array.isArray(courseDemand) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Course Demand Insights
                    </CardTitle>
                    <CardDescription>
                      Real-time enrollment predictions and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      {Array.isArray(courseDemand) ? courseDemand.slice(0, 10).map((demand: any) => (
                        <div key={demand.id} className="mb-4 p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{demand.courseCode}</span>
                            <Badge variant={
                              demand.shortageRisk === "critical" ? "destructive" :
                              demand.shortageRisk === "high" ? "default" :
                              "secondary"
                            }>
                              {demand.shortageRisk} risk
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Planned: {demand.plannedEnrollment} | Capacity: {demand.actualEnrollment}
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Demand Score</span>
                              <span>{demand.demandScore}</span>
                            </div>
                            <Progress value={Math.min(demand.demandScore, 100)} className="h-2" />
                          </div>
                        </div>
                      )) : null}
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Degree Audit Tab */}
          {viewMode === "audit" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Degree Audit Results</span>
                    <Button
                      onClick={() => runAuditMutation.mutate(selectedPlan)}
                      disabled={runAuditMutation.isPending}
                      variant="outline"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Run New Audit
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {degreeAudit ? (
                    <div className="space-y-6">
                      {/* Graduation Eligibility */}
                      <div className={`p-4 rounded-lg ${
                        (degreeAudit as any)?.graduationEligibility === "eligible" 
                          ? "bg-green-50 dark:bg-green-900/20" 
                          : "bg-red-50 dark:bg-red-900/20"
                      }`}>
                        <div className="flex items-center">
                          {(degreeAudit as any)?.graduationEligibility === "eligible" ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                          )}
                          <span className="font-semibold">
                            Graduation Status: {((degreeAudit as any)?.graduationEligibility || '').replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Requirements Status */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-green-200">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-green-600">Completed</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                              {Object.keys((degreeAudit as any)?.completedRequirements || {}).length}
                            </div>
                            <div className="text-xs text-muted-foreground">Requirements</div>
                          </CardContent>
                        </Card>

                        <Card className="border-blue-200">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-blue-600">In Progress</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                              {Object.keys((degreeAudit as any)?.pendingRequirements || {}).length}
                            </div>
                            <div className="text-xs text-muted-foreground">Requirements</div>
                          </CardContent>
                        </Card>

                        <Card className="border-red-200">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-red-600">Missing</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                              {Object.keys((degreeAudit as any)?.missingRequirements || {}).length}
                            </div>
                            <div className="text-xs text-muted-foreground">Requirements</div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Recommended Actions */}
                      {(degreeAudit as any)?.recommendedActions && Array.isArray((degreeAudit as any)?.recommendedActions) && (degreeAudit as any)?.recommendedActions.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Recommended Actions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {((degreeAudit as any)?.recommendedActions || []).map((action: any, index: number) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <ChevronRight className="h-4 w-4 mt-0.5 text-blue-500" />
                                  <div>
                                    <div className="font-medium">{action.title}</div>
                                    <div className="text-sm text-muted-foreground">{action.description}</div>
                                    {action.deadline && (
                                      <div className="text-xs text-red-600 mt-1">
                                        Deadline: {new Date(action.deadline).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No audit data available. Run an audit to see results.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* GPA Simulation Tab */}
          {viewMode === "simulation" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  GPA Simulation
                </CardTitle>
                <CardDescription>
                  Predict your GPA based on expected grades in planned courses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => simulateGPAMutation.mutate({ grades: "auto" })}
                  disabled={simulateGPAMutation.isPending}
                >
                  Run GPA Simulation
                </Button>

                {simulationData && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">
                              {simulationData.projectedGPA.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">Projected GPA</div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">
                              {simulationData.cumulativeGPA.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">Cumulative GPA</div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">
                              {simulationData.confidenceLevel}%
                            </div>
                            <div className="text-sm text-muted-foreground">Confidence</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Simulation Details</h4>
                      <p className="text-sm text-muted-foreground">
                        Based on your EiQ™ scores and historical performance patterns, 
                        this simulation predicts your academic performance in planned courses.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!degreePlans || (Array.isArray(degreePlans) && degreePlans.length === 0) && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Create Your First Degree Plan</h3>
              <p className="text-muted-foreground mb-6">
                Start planning your academic journey with AI-powered course recommendations based on your EiQ™ scores.
              </p>
              <Button onClick={() => createPlanMutation.mutate({ degreeProgramId: "sample" })}>
                <Plus className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}