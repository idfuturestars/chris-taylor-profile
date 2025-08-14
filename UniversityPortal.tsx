import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Globe, 
  Star, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  Clock,
  MapPin,
  Award,
  ExternalLink,
  Sparkles,
  Target
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface University {
  id: string;
  name: string;
  country: string;
  ranking: number;
  logoUrl?: string;
  website: string;
  contactEmail: string;
  minEiQScore: string;
  preferredEiQScore: string;
  programs: any;
  admissionProcess: any;
  partnershipTier: string;
}

interface UniversityApplication {
  id: string;
  universityId: string;
  program: string;
  applicationEiQScore: string;
  transcriptAnalysis: any;
  recommendationStatus: string;
  applicationData: any;
  status: string;
  submittedAt?: string;
  createdAt: string;
}

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  under_review: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  accepted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  waitlisted: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
};

const RECOMMENDATION_COLORS = {
  highly_recommended: "text-green-600 dark:text-green-400",
  recommended: "text-blue-600 dark:text-blue-400",
  conditional: "text-yellow-600 dark:text-yellow-400",
  not_recommended: "text-red-600 dark:text-red-400"
};

const TIER_COLORS = {
  premier: "bg-gradient-to-r from-yellow-400 to-yellow-600",
  standard: "bg-gradient-to-r from-blue-400 to-blue-600",
  basic: "bg-gradient-to-r from-gray-400 to-gray-600"
};

export default function UniversityPortal() {
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    program: "",
    personalStatement: "",
    academicGoals: "",
    whyUniversity: "",
    eiqScore: ""
  });
  const [eligibilityFilter, setEligibilityFilter] = useState("");
  const queryClient = useQueryClient();

  const { data: universities } = useQuery({
    queryKey: ["/api/universities"]
  });

  const { data: eligibleUniversities } = useQuery({
    queryKey: ["/api/universities/eligible", eligibilityFilter],
    enabled: !!eligibilityFilter,
    queryFn: () => 
      fetch(`/api/universities/eligible?eiqScore=${eligibilityFilter}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json())
  });

  const { data: myApplications } = useQuery({
    queryKey: ["/api/university-applications"]
  });

  const createApplicationMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/api/university-applications", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/university-applications"] });
      setApplicationDialogOpen(false);
      resetApplicationForm();
    }
  });

  const resetApplicationForm = () => {
    setApplicationData({
      program: "",
      personalStatement: "",
      academicGoals: "",
      whyUniversity: "",
      eiqScore: ""
    });
  };

  const submitApplication = () => {
    if (!selectedUniversity) return;
    
    createApplicationMutation.mutate({
      universityId: selectedUniversity.id,
      program: applicationData.program,
      applicationEiQScore: applicationData.eiqScore,
      applicationData: {
        personalStatement: applicationData.personalStatement,
        academicGoals: applicationData.academicGoals,
        whyUniversity: applicationData.whyUniversity
      }
    });
  };

  const getMatchPercentage = (university: University, userEiQ: string) => {
    const minEiQ = parseFloat(university.minEiQScore);
    const preferredEiQ = parseFloat(university.preferredEiQScore);
    const userScore = parseFloat(userEiQ);
    
    if (userScore >= preferredEiQ) return 100;
    if (userScore >= minEiQ) return Math.round(((userScore - minEiQ) / (preferredEiQ - minEiQ)) * 100);
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            University Portal
          </h2>
          <p className="text-muted-foreground">Apply to partner universities using your EiQ™ score</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Your EiQ™ score"
            value={eligibilityFilter}
            onChange={(e) => setEligibilityFilter(e.target.value)}
            className="w-32"
            type="number"
            step="0.1"
          />
          <Button variant="outline">
            <Target className="w-4 h-4 mr-2" />
            Filter Eligible
          </Button>
        </div>
      </div>

      <Tabs defaultValue="explore" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="explore" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Explore Universities
          </TabsTrigger>
          <TabsTrigger value="eligible" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Eligible for Me
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            My Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(universities) && universities.map((university: University) => (
              <Card key={university.id} className="group hover:shadow-lg transition-all duration-200 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-16 h-16 ${TIER_COLORS[university.partnershipTier as keyof typeof TIER_COLORS]} opacity-10 rounded-bl-full`}></div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {university.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {university.country}
                        {university.ranking && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              #{university.ranking} globally
                            </span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <Badge className={`${TIER_COLORS[university.partnershipTier as keyof typeof TIER_COLORS]} text-white capitalize`}>
                      {university.partnershipTier}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Min EiQ™ Required</span>
                      <Badge variant="outline">{university.minEiQScore}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Preferred EiQ™</span>
                      <Badge variant="secondary">{university.preferredEiQScore}</Badge>
                    </div>
                  </div>

                  {university.programs && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Available Programs</h4>
                      <div className="flex flex-wrap gap-1">
                        {Object.keys(university.programs).slice(0, 3).map((program) => (
                          <Badge key={program} variant="outline" className="text-xs">
                            {program}
                          </Badge>
                        ))}
                        {Object.keys(university.programs).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{Object.keys(university.programs).length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => {
                        setSelectedUniversity(university);
                        setApplicationDialogOpen(true);
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Apply
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(university.website, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="eligible" className="space-y-4">
          {eligibilityFilter ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eligibleUniversities?.map((university: University) => {
                const matchPercentage = getMatchPercentage(university, eligibilityFilter);
                
                return (
                  <Card key={university.id} className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-green-700 dark:text-green-400">
                            {university.name}
                          </CardTitle>
                          <CardDescription>{university.country}</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          {matchPercentage}% match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Match Score</span>
                          <span className="font-medium">{matchPercentage}%</span>
                        </div>
                        <Progress value={matchPercentage} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-center p-2 rounded bg-muted">
                          <div className="font-medium">{university.minEiQScore}</div>
                          <div className="text-muted-foreground">Min EiQ™</div>
                        </div>
                        <div className="text-center p-2 rounded bg-muted">
                          <div className="font-medium">{university.preferredEiQScore}</div>
                          <div className="text-muted-foreground">Preferred</div>
                        </div>
                      </div>

                      <Button 
                        className="w-full"
                        onClick={() => {
                          setSelectedUniversity(university);
                          setApplicationData(prev => ({ ...prev, eiqScore: eligibilityFilter }));
                          setApplicationDialogOpen(true);
                        }}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Quick Apply
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Find Your Perfect Match</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Enter your EiQ™ score above to see universities where you're eligible
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {Array.isArray(myApplications) && myApplications.length > 0 ? (
            <div className="space-y-4">
              {Array.isArray(myApplications) && myApplications.map((application: UniversityApplication) => (
                <Card key={application.id} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Application #{application.id.slice(-8)}</CardTitle>
                        <CardDescription>
                          {application.program} • Applied {new Date(application.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={STATUS_COLORS[application.status as keyof typeof STATUS_COLORS]}>
                          {application.status.replace('_', ' ')}
                        </Badge>
                        {application.recommendationStatus && (
                          <div className={`flex items-center gap-1 text-sm ${RECOMMENDATION_COLORS[application.recommendationStatus as keyof typeof RECOMMENDATION_COLORS]}`}>
                            <CheckCircle className="w-4 h-4" />
                            {application.recommendationStatus.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Application EiQ™</div>
                        <div className="font-medium">{application.applicationEiQScore}</div>
                      </div>
                      {application.transcriptAnalysis && (
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">GPA Analysis</div>
                          <div className="font-medium">{application.transcriptAnalysis.overallGPA}/4.0</div>
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Status</div>
                        <div className="font-medium capitalize">{application.status.replace('_', ' ')}</div>
                      </div>
                    </div>
                    
                    {application.transcriptAnalysis && (
                      <div className="p-4 rounded-lg bg-muted">
                        <h4 className="font-medium mb-2">AI Analysis Summary</h4>
                        <p className="text-sm text-muted-foreground">
                          {application.transcriptAnalysis.recommendationStrength}
                        </p>
                        {application.transcriptAnalysis.strengthAreas && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {application.transcriptAnalysis.strengthAreas.map((area: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start exploring universities to begin your application journey
                </p>
                <Button onClick={() => {
                  const exploreTab = document.querySelector('[value="explore"]') as HTMLElement;
                  exploreTab?.click();
                }}>
                  Explore Universities
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply to {selectedUniversity?.name}</DialogTitle>
            <DialogDescription>
              Complete your application with EiQ™ integration and AI-powered guidance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select value={applicationData.program} onValueChange={(value) => 
                  setApplicationData(prev => ({ ...prev, program: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedUniversity?.programs && Object.keys(selectedUniversity.programs).map(program => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eiqScore">Your EiQ™ Score</Label>
                <Input
                  id="eiqScore"
                  type="number"
                  step="0.1"
                  value={applicationData.eiqScore}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, eiqScore: e.target.value }))}
                  placeholder="e.g., 85.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalStatement">Personal Statement</Label>
              <Textarea
                id="personalStatement"
                value={applicationData.personalStatement}
                onChange={(e) => setApplicationData(prev => ({ ...prev, personalStatement: e.target.value }))}
                placeholder="Tell us about yourself and why you're passionate about your chosen field..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicGoals">Academic Goals</Label>
              <Textarea
                id="academicGoals"
                value={applicationData.academicGoals}
                onChange={(e) => setApplicationData(prev => ({ ...prev, academicGoals: e.target.value }))}
                placeholder="Describe your academic and career aspirations..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whyUniversity">Why This University?</Label>
              <Textarea
                id="whyUniversity"
                value={applicationData.whyUniversity}
                onChange={(e) => setApplicationData(prev => ({ ...prev, whyUniversity: e.target.value }))}
                placeholder="What specifically attracts you to this university and program..."
                rows={3}
              />
            </div>

            {selectedUniversity && applicationData.eiqScore && (
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">EiQ™ Compatibility Check</span>
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Your EiQ™ score of {applicationData.eiqScore} {
                    parseFloat(applicationData.eiqScore) >= parseFloat(selectedUniversity.preferredEiQScore) 
                      ? "exceeds the preferred score - excellent match!" 
                      : parseFloat(applicationData.eiqScore) >= parseFloat(selectedUniversity.minEiQScore)
                      ? "meets the minimum requirement - good match!"
                      : "is below the minimum requirement."
                  }
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setApplicationDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={submitApplication}
                disabled={
                  createApplicationMutation.isPending || 
                  !applicationData.program || 
                  !applicationData.eiqScore ||
                  !applicationData.personalStatement
                }
              >
                {createApplicationMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}