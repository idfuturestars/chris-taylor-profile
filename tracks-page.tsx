import { TitanTracksDisplay } from "@/components/tracks/TitanTracksDisplay";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star, Target, Users } from "lucide-react";

export default function TracksPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Industry Titan Learning Tracks
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Personalized learning pathways inspired by technology industry leaders. 
            Each track is designed for specific age groups and learning objectives.
          </p>
        </div>

        {/* Current User Info */}
        {user?.assignedTrack && (
          <div className="mb-8">
            <Card className="border-2 border-green-200 bg-green-50/50 dark:bg-green-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <Star className="h-5 w-5" />
                  Your Learning Journey
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  Currently enrolled in {user.assignedTrack.displayName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="bg-green-600 text-white mb-2">
                      {user.assignedTrack.audience}
                    </Badge>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Focus: {user.assignedTrack.focus}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                      {user.assessmentProgress || 0}%
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-300">
                      Progress
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Track Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Target className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <CardTitle className="text-lg">Age-Based Tracks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Six specialized tracks covering Grades 6-8 through Ages 60+, each with industry-specific focus areas.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">Industry Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Learn from curriculum designed with input from leading technology companies and educational institutions.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Star className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <CardTitle className="text-lg">Adaptive Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI-powered personalization adjusts content difficulty and focus based on your progress and interests.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tracks Display */}
        <TitanTracksDisplay 
          showAssignButton={!!user} 
          userAge={calculateAge(user?.createdAt)} 
        />
      </div>
    </div>
  );
}

// Helper function to calculate age from creation date (approximation)
function calculateAge(createdAt?: string | Date): number {
  if (!createdAt) return 16; // Default age
  
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // This is a rough approximation - in real implementation,
  // you'd want actual birth date or age from user profile
  return Math.max(16, Math.min(25, 16 + Math.floor(diffDays / 365)));
}