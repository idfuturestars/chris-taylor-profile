import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Target, TrendingUp, Award, Clock, Brain } from "lucide-react";
import { useLocation } from "wouter";

interface OnboardingData {
  recommendedTrack: string;
  estimatedEiqRange: string;
  careerGoals: {
    targetRole: string;
    targetCompanies: string[];
    salaryExpectations: string;
    timeline: string;
  };
  educationalBackground: {
    programmingExperience: string;
    currentLevel: string;
  };
  learningPreferences: {
    timeCommitment: string;
    studyStyle: string;
  };
}

export default function PersonalizedWelcome() {
  const [, setLocation] = useLocation();

  const { data: onboarding, isLoading } = useQuery<OnboardingData>({
    queryKey: ["/api/user/onboarding"],
  });

  const { data: recommendations } = useQuery({
    queryKey: ["/api/onboarding/recommendations"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Star className="h-12 w-12 text-green-500 mx-auto mb-4 animate-spin" />
          <p className="text-white">Loading your personalized journey...</p>
        </div>
      </div>
    );
  }

  if (!onboarding) {
    return null;
  }

  const getTrackColor = (track: string) => {
    if (track.includes("ApexPrep")) return "bg-purple-600";
    if (track.includes("TalentMatch")) return "bg-blue-600";
    return "bg-green-600";
  };

  const getSuccessProbability = () => {
    if (onboarding.recommendedTrack.includes("ApexPrep")) return 92;
    if (onboarding.recommendedTrack.includes("TalentMatch")) return 85;
    return 78;
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-green-500 mr-3" />
            <h1 className="text-4xl font-bold text-white">
              Welcome to Your Educational Journey
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            EiQ™ powered by SikatLab™ and IDFS Pathway™ - Personalized Learning for Every Stage
          </p>
          <p className="text-xl text-gray-400">Your personalized learning journey starts now</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Your Track */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="h-6 w-6 mr-2 text-green-500" />
                Your EiQ Track
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge className={`${getTrackColor(onboarding.recommendedTrack)} text-white text-lg px-4 py-2`}>
                  {onboarding.recommendedTrack}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Estimated EiQ Range</span>
                  <span className="text-white font-semibold">{onboarding.estimatedEiqRange}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Success Probability</span>
                  <span className="text-green-400 font-semibold">{getSuccessProbability()}%</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-sm text-gray-400 mb-2">Track Progress</div>
                <Progress value={5} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">Just getting started!</div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Focus or Career Goals - Education First */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="h-6 w-6 mr-2 text-green-500" />
                {onboarding.careerGoals?.targetRole === "exploring-education" ? "Your Learning Focus" : "Your Goals"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {onboarding.careerGoals?.targetRole === "exploring-education" ? (
                // K-12 Education-focused view
                <>
                  <div>
                    <div className="text-sm text-gray-400">Current Focus</div>
                    <div className="text-white font-semibold">Educational Discovery & Growth</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400">Learning Stage</div>
                    <div className="text-green-400 font-semibold">Building Strong Foundations</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">Next Steps</div>
                    <div className="text-white font-semibold">Explore subjects you love</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">Future Planning</div>
                    <div className="text-blue-400 font-semibold">After high school graduation</div>
                  </div>
                </>
              ) : (
                // College+ Career-focused view  
                <>
                  <div>
                    <div className="text-sm text-gray-400">Target Role</div>
                    <div className="text-white font-semibold">{onboarding.careerGoals.targetRole || "Software Engineer"}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400">Target Companies</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {onboarding.careerGoals.targetCompanies.slice(0, 3).map((company) => (
                        <Badge key={company} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {company}
                        </Badge>
                      ))}
                      {onboarding.careerGoals.targetCompanies.length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                          +{onboarding.careerGoals.targetCompanies.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">Timeline</div>
                    <div className="text-white font-semibold">{onboarding.careerGoals.timeline || "1 year"}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400">Salary Target</div>
                    <div className="text-green-400 font-semibold">{onboarding.careerGoals.salaryExpectations || "$120K - $160K"}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Learning Plan */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="h-6 w-6 mr-2 text-green-500" />
                Your Learning Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-gray-400">Programming Level</div>
                <div className="text-white font-semibold capitalize">
                  {onboarding.educationalBackground.programmingExperience || "Intermediate"}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Time Commitment</div>
                <div className="text-white font-semibold">
                  {onboarding.learningPreferences.timeCommitment || "5-10 hours/week"}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400">Learning Style</div>
                <div className="text-white font-semibold capitalize">
                  {onboarding.learningPreferences.studyStyle || "Hands-on"}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400">Completion Estimate</div>
                <div className="text-green-400 font-semibold">6-12 months</div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-green-500" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Take EiQ Assessment</div>
                    <div className="text-xs text-gray-400">Get your baseline score</div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setLocation("/assessment")}
                  >
                    Start
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg opacity-60">
                  <div>
                    <div className="text-white font-medium">AI Mentor Setup</div>
                    <div className="text-xs text-gray-400">Unlock after assessment</div>
                  </div>
                  <Button size="sm" disabled variant="outline" className="border-gray-600">
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg opacity-60">
                  <div>
                    <div className="text-white font-medium">Learning Path</div>
                    <div className="text-xs text-gray-400">Personalized curriculum</div>
                  </div>
                  <Button size="sm" disabled variant="outline" className="border-gray-600">
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-center">EiQ™ powered by SikatLab™ and IDFS Pathway™ Success Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-400">87%</div>
                <div className="text-sm text-gray-400">Career Success Rate</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-400">$165K</div>
                <div className="text-sm text-gray-400">Average Starting Salary</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-400">6-12</div>
                <div className="text-sm text-gray-400">Months to Career</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-6">
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            onClick={() => setLocation("/assessment")}
          >
            Start Your EiQ Assessment
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-gray-600 text-white hover:bg-gray-800 px-8"
            onClick={() => {
              localStorage.setItem('welcomeShown', 'true');
              setLocation("/");
            }}
          >
            Explore Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}