import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { LiveTrackingProvider } from "@/components/common/LiveTrackingProvider";
import PersonalizedWelcome from "@/components/onboarding/PersonalizedWelcome";
import K12Dashboard from "@/pages/K12Dashboard";
import HigherEducationDashboard from "@/pages/HigherEducationDashboard";
import EducationLevelSelector from "@/components/navigation/EducationLevelSelector";
import StudyCohorts from "@/pages/StudyGroups";
import AdaptiveAssessment from "@/pages/AdaptiveAssessment";
import AITutor from "@/pages/AITutor";
import SkillRecommendations from "@/pages/SkillRecommendations";
import SkillRecommendationEngine from "@/pages/SkillRecommendationEngine";
import VoiceAssessment from "@/pages/VoiceAssessment";
import IDFSAssessment from "@/pages/IDFSAssessment";
import MLAnalytics from "@/pages/MLAnalytics";
import RealTimeCollaboration from "@/pages/RealTimeCollaboration";
import AchievementsPage from "@/components/achievements/AchievementsPage";
import TracksPage from "@/pages/tracks-page";
import DemoLogin from "@/pages/demo-login";
import HintDemo from "@/pages/hint-demo";
import ChatPage from "@/pages/chat";
import StaffDashboard from "@/pages/staff-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import PublicAPIPage from "@/pages/public-api";
import ViralChallengePage from "@/pages/viral-challenge";
import MultiModalAssessment from "@/pages/multi-modal-assessment";
import SocialEIQPage from "@/pages/social-eiq";
import RoleModelMatching from "@/pages/role-model-matching";
import CustomQuestionsStaff from "@/pages/custom-questions-staff";
import CustomQuestionsStudent from "@/pages/custom-questions-student";
import UsernameSetup from "@/pages/username-setup";
import CheckUsername from "@/pages/check-username";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import EiQLogo from "@/components/common/EiQLogo";

// Add error boundary for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Clear any legacy authentication tokens on app load
if (typeof window !== 'undefined') {
  localStorage.removeItem('token');
  sessionStorage.clear();
}

function AuthenticatedApp() {
  return (
    <Switch>
      <Route path="/onboarding" component={OnboardingWizard} />
      <Route path="/welcome" component={PersonalizedWelcome} />
      <Route path="/username-setup" component={UsernameSetup} />
      <Route path="/check-username" component={CheckUsername} />
      <Route path="/k12-dashboard" component={K12Dashboard} />
      <Route path="/higher-education" component={HigherEducationDashboard} />
      <Route path="/assessment" component={AdaptiveAssessment} />
      <Route path="/ai-tutor" component={AITutor} />
      <Route path="/skills" component={SkillRecommendations} />
      <Route path="/skill-engine" component={SkillRecommendationEngine} />
      <Route path="/voice-assessment" component={VoiceAssessment} />
      <Route path="/idfs-assessment" component={IDFSAssessment} />
      <Route path="/ml-analytics" component={MLAnalytics} />
      <Route path="/collaboration" component={RealTimeCollaboration} />
      <Route path="/study-cohorts" component={StudyCohorts} />
      <Route path="/achievements" component={AchievementsPage} />
      <Route path="/tracks" component={TracksPage} />
      <Route path="/hint-demo" component={HintDemo} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/staff" component={StaffDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/api" component={PublicAPIPage} />
      <Route path="/challenge" component={ViralChallengePage} />
      <Route path="/multi-modal" component={MultiModalAssessment} />
      <Route path="/social" component={SocialEIQPage} />
      <Route path="/role-models" component={RoleModelMatching} />
      <Route path="/custom-questions-staff" component={CustomQuestionsStaff} />
      <Route path="/custom-questions-student" component={CustomQuestionsStudent} />
      <Route path="/choose-level" component={EducationLevelSelector} />
      <Route path="/" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <EiQLogo size="lg" variant="full" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Assessment Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Powered by SikatLabs™ and IDFS Pathway™
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Transform your potential with AI-powered assessments across all age levels.
          </p>
          <div className="space-y-3">
            <a 
              href="/api/login"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 inline-block text-center"
            >
              Get Started
            </a>
            <div className="flex gap-2">
              <a 
                href="/challenge"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 inline-block text-center text-sm"
              >
                15s Challenge
              </a>
              <a 
                href="/api"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 inline-block text-center text-sm"
              >
                Public API
              </a>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Supports Google, Apple, GitHub, and X sign-in
          </p>
        </div>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading only while actually fetching
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Check authentication and username setup status
  if (user) {
    // If user is authenticated but hasn't set username, redirect to username setup
    if (!user.usernameSet) {
      return (
        <Switch>
          <Route path="/username-setup" component={UsernameSetup} />
          <Route component={() => {
            window.location.href = '/username-setup';
            return null;
          }} />
        </Switch>
      );
    }
    return <AuthenticatedApp />;
  }
  
  return <Landing />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen bg-background text-foreground">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;