import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import ChatLayout from "@/components/layout/ChatLayout";
import AssessmentEngine from "@/components/assessment/AssessmentEngine";
import AdvancedAssessment from "@/components/assessment/AdvancedAssessment";
import AIAssistant from "@/components/ai/AIAssistant";
import DocumentUpload from "@/components/upload/DocumentUpload";
import LearningPathways from "@/components/learning/LearningPathways";
import Analytics from "@/components/analytics/Analytics";
import StudyGroup from "@/components/collaboration/StudyGroup";
import AITutor from "@/components/ai/AITutor";
import VRCompetitions from "@/components/vr/VRCompetitions";
import UniversityPortal from "@/components/university/UniversityPortal";
import EiQScoreCenter from "@/components/assessment/EiQScoreCenter";
import AssessmentDetails from "@/components/assessment/AssessmentDetails";
import ModularAssessmentStructure from "@/components/assessment/ModularAssessmentStructure";
import AIAssistedAssessment from "@/components/assessment/AIAssistedAssessment";
import GlobalAnalyticsDashboard from "@/components/assessment/GlobalAnalyticsDashboard";
import DegreePlanner from "@/components/degree/DegreePlanner";
import AchievementShowcase from "@/components/achievements/AchievementShowcase";
import MLInsightsDashboard from "@/components/analytics/MLInsightsDashboard";
import AITestPanel from "@/components/ai/AITestPanel";
import OAuthWizard from "@/components/admin/OAuthWizard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Target, TrendingUp, Award, MessageSquare, BarChart3, Zap, Trophy, Globe, Users, Brain } from "lucide-react";
import { useLocation as useNavigate } from "wouter";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  // Check for onboarding completion
  const { data: onboardingData, isLoading: onboardingLoading } = useQuery({
    queryKey: ["/api/user/onboarding"],
    enabled: !!user
  });

  // Handle onboarding redirect in useEffect to avoid render-time state updates
  useEffect(() => {
    if (user && !onboardingLoading && onboardingData === null) {
      setLocation("/onboarding");
    }
  }, [user, onboardingData, onboardingLoading, setLocation]);

  if (isLoading || onboardingLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Sidebar Navigation
  const sidebarNav = (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-4">
        <Button
          variant={activeSection === "dashboard" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("dashboard")}
        >
          <BarChart3 className="w-4 h-4 mr-3" />
          Overview
        </Button>
        <Button
          variant={activeSection === "assessment" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("assessment")}
        >
          <Target className="w-4 h-4 mr-3" />
          Assessment Hub
        </Button>
        <Button
          variant={activeSection === "baseline-test" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("baseline-test")}
        >
          <BookOpen className="w-4 h-4 mr-3" />
          Baseline Test
        </Button>
        <Button
          variant={activeSection === "comprehensive-test" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("comprehensive-test")}
        >
          <Award className="w-4 h-4 mr-3" />
          Comprehensive Test
        </Button>
        <Button
          variant={activeSection === "ai-assistant" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("ai-assistant")}
        >
          <MessageSquare className="w-4 h-4 mr-3" />
          AI Assistant
        </Button>
        <Button
          variant={activeSection === "ml-insights" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("ml-insights")}
        >
          <TrendingUp className="w-4 h-4 mr-3" />
          ML Insights
        </Button>
        <Button
          variant={activeSection === "achievements" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("achievements")}
        >
          <Award className="w-4 h-4 mr-3" />
          Achievements
        </Button>
        <Button
          variant={activeSection === "custom-questions" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("custom-questions")}
        >
          <Brain className="w-4 h-4 mr-3" />
          Custom Questions
        </Button>
      </div>
    </ScrollArea>
  );

  const renderContent = () => {
    if (activeSection === "dashboard") {
      return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Welcome Section */}
          <div className="text-center py-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.firstName || user?.first_name || 'Student'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Track your EiQ™ score progress with personalized assessments designed to identify knowledge gaps and boost your intellectual potential.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {user.assessmentProgress || 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Assessment Progress</div>
              <Progress value={user.assessmentProgress || 0} className="mt-2 h-2" />
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {user.learningStreak || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {user.aiInteractions || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">AI Interactions</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {user.currentLevel || "Foundation"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Level</div>
            </div>
          </div>

          {/* Multi-Titan Strategy Features - NEW! */}
          <div className="p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 dark:from-purple-950 dark:via-blue-950 dark:to-green-950 rounded-lg border border-purple-200 dark:border-purple-800 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              New! Make EIQ a Household Name
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button 
                onClick={() => setLocation('/role-models')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Role Model Matching
                <Badge className="ml-2 bg-yellow-300 text-black">AI</Badge>
              </Button>
              <Button 
                onClick={() => setLocation('/challenge')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Trophy className="w-4 h-4 mr-2" />
                15-Second Challenge
                <Badge className="ml-2 bg-yellow-500">Viral</Badge>
              </Button>
              <Button 
                onClick={() => setLocation('/api')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Globe className="w-4 h-4 mr-2" />
                Public API Portal
                <Badge className="ml-2 bg-green-500">Open</Badge>
              </Button>
              <Button 
                onClick={() => setLocation('/social')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Social EIQ Cohorts
                <Badge className="ml-2 bg-red-500">New</Badge>
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 text-center">
              Powered by visions from Sam Altman, Elon Musk, Geoffrey Hinton, Mark Zuckerberg & Steve Jobs
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-16 text-left justify-start"
                onClick={() => setActiveSection("baseline-test")}
              >
                <div>
                  <div className="font-medium">Start Baseline Assessment</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">45-minute quick EiQ evaluation</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-16 text-left justify-start"
                onClick={() => setActiveSection("comprehensive-test")}
              >
                <div>
                  <div className="font-medium">Take Comprehensive Test</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">3h 45m detailed assessment</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-16 text-left justify-start"
                onClick={() => setActiveSection("ai-assistant")}
              >
                <div>
                  <div className="font-medium">Chat with AI Tutor</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Get personalized learning guidance</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-16 text-left justify-start"
                onClick={() => setActiveSection("ml-insights")}
              >
                <div>
                  <div className="font-medium">View ML Insights</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Analyze your learning patterns</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Completed Math Assessment</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Score: 87% • 2 hours ago</div>
                </div>
                <Badge variant="secondary">Mathematics</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">AI Tutor Session</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Logic reasoning practice • 1 day ago</div>
                </div>
                <Badge variant="secondary">Logic</Badge>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Render other sections with their respective components
    if (activeSection === "assessment") return <ModularAssessmentStructure />;
    if (activeSection === "baseline-test") return <AIAssistedAssessment />;
    if (activeSection === "comprehensive-test") return <AssessmentDetails />;
    if (activeSection === "ai-assistant") return <AIAssistedAssessment />;
    if (activeSection === "ml-insights") return <GlobalAnalyticsDashboard />;
    if (activeSection === "achievements") return <AchievementShowcase />;
    if (activeSection === "custom-questions") {
      setLocation('/custom-questions-student');
      return null;
    }

    return null;
  };

  return (
    <ChatLayout
      title="EiQ™ Dashboard"
      subtitle="Your personal intelligence assessment and learning hub"
      sidebar={sidebarNav}
    >
      {renderContent()}
    </ChatLayout>
  );
}
