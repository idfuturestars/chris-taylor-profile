import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Users, TrendingUp, Star, Globe, Award, BookOpen, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

interface RoleModel {
  id: string;
  name: string;
  title: string;
  industry: string;
  country: string;
  profileImageUrl?: string;
  matchPercentage: number;
  keyTraits: string[];
  achievements: string[];
  learningPath: string[];
  eiqScore?: number;
  bio: string;
  domains: {
    cognitiveReasoning: number;
    mathematicalLogic: number;
    verbalProficiency: number;
    spatialIntelligence: number;
    memoryProcessing: number;
    processingSpeed: number;
  };
}

interface MatchingResult {
  topMatches: RoleModel[];
  userProfile: {
    eiqScore: number;
    dominantTraits: string[];
    strengthDomains: string[];
    growthAreas: string[];
  };
  recommendations: string[];
}

export default function RoleModelMatchingPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('matches');

  const { data: matchingResults, isLoading } = useQuery<MatchingResult>({
    queryKey: ['/api/role-models/matches', user?.id],
    enabled: !!user,
  });

  const { data: allRoleModels } = useQuery<RoleModel[]>({
    queryKey: ['/api/role-models/all'],
  });

  const filteredRoleModels = allRoleModels?.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || model.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const industries = Array.from(new Set(allRoleModels?.map(model => model.industry) || []));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Analyzing your profile for role model matches...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Role Model Matching
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover global leaders and innovators who share your cognitive profile and learning style.
            Get personalized pathways to follow in their footsteps.
          </p>
        </div>

        {/* User Profile Overview */}
        {matchingResults?.userProfile && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900 border-blue-200 dark:border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-blue-600" />
                Your EIQ Profile
              </CardTitle>
              <CardDescription>
                Based on your assessment results and learning patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">EIQ Score</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {matchingResults.userProfile.eiqScore}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {matchingResults.userProfile.eiqScore >= 700 ? 'Exceptional' : 
                     matchingResults.userProfile.eiqScore >= 600 ? 'Advanced' :
                     matchingResults.userProfile.eiqScore >= 500 ? 'Proficient' : 'Developing'}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Dominant Traits</h4>
                  <div className="flex flex-wrap gap-1">
                    {matchingResults.userProfile.dominantTraits.map((trait, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Strength Domains</h4>
                  <div className="space-y-1">
                    {matchingResults.userProfile.strengthDomains.map((domain, idx) => (
                      <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                        • {domain}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Matches
            </TabsTrigger>
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Explore All
            </TabsTrigger>
            <TabsTrigger value="pathways" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Learning Pathways
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches">
            <div className="grid lg:grid-cols-2 gap-6">
              {matchingResults?.topMatches?.map((roleModel) => (
                <RoleModelCard key={roleModel.id} roleModel={roleModel} isMatch={true} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="explore">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search role models by name, title, or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredRoleModels?.map((roleModel) => (
                <RoleModelCard key={roleModel.id} roleModel={roleModel} isMatch={false} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pathways">
            <div className="space-y-6">
              {matchingResults?.recommendations?.map((recommendation, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Target className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function RoleModelCard({ roleModel, isMatch }: { roleModel: RoleModel; isMatch: boolean }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {roleModel.profileImageUrl ? (
              <img
                src={roleModel.profileImageUrl}
                alt={roleModel.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {roleModel.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{roleModel.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>{roleModel.title}</span>
                <Badge variant="outline" className="text-xs">
                  {roleModel.country}
                </Badge>
              </CardDescription>
            </div>
          </div>
          {isMatch && (
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {roleModel.matchPercentage}%
              </div>
              <div className="text-xs text-gray-500">Match</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {roleModel.bio}
        </p>

        <div>
          <h4 className="font-semibold text-sm mb-2">Key Traits</h4>
          <div className="flex flex-wrap gap-1">
            {roleModel.keyTraits.slice(0, 4).map((trait, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Cognitive Profile</h4>
          <div className="space-y-2">
            {Object.entries(roleModel.domains).slice(0, 3).map(([domain, score]) => (
              <div key={domain} className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {domain.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex items-center gap-2">
                  <Progress value={score} className="w-16 h-2" />
                  <span className="text-xs font-medium w-8">{score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button className="w-full" variant="outline">
            <BookOpen className="h-4 w-4 mr-2" />
            View Learning Path
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}