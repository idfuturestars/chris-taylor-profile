import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  Star, 
  MapPin, 
  DollarSign,
  Clock,
  CheckCircle,
  Eye,
  EyeOff,
  Building2,
  Zap,
  Target,
  Mail,
  Calendar
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface CorporatePartner {
  id: string;
  name: string;
  industry: string;
  size: string;
  logoUrl?: string;
  website: string;
  headquarters: string;
  targetEiQRange: any;
  talentRequirements: any;
  partnershipTier: string;
  recruitmentQuota: number;
}

interface TalentProfile {
  id: string;
  userId: string;
  currentEiQScore: string;
  peakEiQScore: string;
  skillsProfile: any;
  careerInterests: any;
  availability: string;
  resumeData: any;
  portfolioLinks: any;
  isOpenToRecruitment: boolean;
  visibilitySettings: any;
}

interface RecruitmentMatch {
  id: string;
  corporatePartner: CorporatePartner;
  jobTitle: string;
  matchScore: string;
  eiqRequirement: string;
  jobDescription: string;
  salary: any;
  status: string;
  createdAt: string;
}

const INDUSTRY_COLORS = {
  technology: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  finance: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  healthcare: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  consulting: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
};

const MATCH_SCORE_COLORS = {
  high: "text-green-600 dark:text-green-400",
  medium: "text-yellow-600 dark:text-yellow-400",
  low: "text-red-600 dark:text-red-400"
};

export default function TalentPortal() {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<RecruitmentMatch | null>(null);
  const [contactData, setContactData] = useState({ message: "", availability: "" });
  const [profileData, setProfileData] = useState({
    currentEiQScore: "",
    skillsProfile: {
      technical_skills: [],
      soft_skills: [],
      languages: []
    },
    careerInterests: {
      preferred_industries: [],
      desired_roles: [],
      company_size_preference: "",
      location_preference: ""
    },
    availability: "flexible",
    isOpenToRecruitment: false
  });

  const queryClient = useQueryClient();

  const { data: corporatePartners } = useQuery({
    queryKey: ["/api/corporate-partners"]
  });

  const { data: talentProfile } = useQuery({
    queryKey: ["/api/talent-profile"]
  });

  const { data: recruitmentMatches } = useQuery({
    queryKey: ["/api/recruitment-matches"]
  });

  const createProfileMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/api/talent-profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/talent-profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recruitment-matches"] });
      setProfileDialogOpen(false);
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("PUT", "/api/talent-profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/talent-profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recruitment-matches"] });
      setProfileDialogOpen(false);
    }
  });

  const contactMutation = useMutation({
    mutationFn: (data: { matchId: string; message: string; availability: string }) =>
      apiRequest("POST", `/api/recruitment-matches/${data.matchId}/contact`, { 
        message: data.message, 
        availability: data.availability 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recruitment-matches"] });
      setContactDialogOpen(false);
      setContactData({ message: "", availability: "" });
    }
  });

  const submitProfile = () => {
    if (talentProfile) {
      updateProfileMutation.mutate(profileData);
    } else {
      createProfileMutation.mutate(profileData);
    }
  };

  const getMatchScoreLevel = (score: number) => {
    if (score >= 80) return "high";
    if (score >= 60) return "medium";
    return "low";
  };

  const formatSalary = (salary: any) => {
    if (!salary) return "Competitive";
    return `$${salary.min?.toLocaleString()} - $${salary.max?.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-primary" />
            Talent Portal
          </h2>
          <p className="text-muted-foreground">Connect with top companies through EiQ™-powered recruitment</p>
        </div>
        <Button 
          onClick={() => {
            if (talentProfile) {
              setProfileData({
                currentEiQScore: (talentProfile as any)?.currentEiQScore || "",
                skillsProfile: (talentProfile as any)?.skillsProfile || { technical_skills: [], soft_skills: [], languages: [] },
                careerInterests: (talentProfile as any)?.careerInterests || { 
                  preferred_industries: [], 
                  desired_roles: [], 
                  company_size_preference: "", 
                  location_preference: "" 
                },
                availability: (talentProfile as any)?.availability || "flexible",
                isOpenToRecruitment: (talentProfile as any)?.isOpenToRecruitment || false
              });
            }
            setProfileDialogOpen(true);
          }}
          className="bg-primary hover:bg-primary/90"
        >
          {talentProfile ? "Update Profile" : "Create Profile"}
        </Button>
      </div>

      {!talentProfile ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Create Your Talent Profile</h3>
            <p className="text-muted-foreground text-center mb-4">
              Set up your profile to get matched with top companies based on your EiQ™ score and skills
            </p>
            <Button onClick={() => setProfileDialogOpen(true)}>
              <Zap className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              My Matches
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-4">
            {(recruitmentMatches as any)?.length > 0 ? (
              <div className="space-y-4">
                {(recruitmentMatches as any)?.map((match: any) => {
                  const matchScore = parseFloat(match.matchScore);
                  const scoreLevel = getMatchScoreLevel(matchScore);
                  
                  return (
                    <Card key={match.id} className="hover:shadow-lg transition-all duration-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                              {match.corporatePartner.name}
                              <Badge className={INDUSTRY_COLORS[match.corporatePartner.industry as keyof typeof INDUSTRY_COLORS] || INDUSTRY_COLORS.default}>
                                {match.corporatePartner.industry}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="text-lg font-medium">
                              {match.jobTitle}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className={`flex items-center gap-1 text-sm font-medium ${MATCH_SCORE_COLORS[scoreLevel]}`}>
                              <TrendingUp className="w-4 h-4" />
                              {matchScore}% match
                            </div>
                            <Badge variant={match.status === 'contacted' ? 'default' : 'secondary'}>
                              {match.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              Location
                            </div>
                            <div className="font-medium">{match.corporatePartner.headquarters}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <DollarSign className="w-4 h-4" />
                              Salary
                            </div>
                            <div className="font-medium">{formatSalary(match.salary)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Target className="w-4 h-4" />
                              Required EiQ™
                            </div>
                            <div className="font-medium">{match.eiqRequirement}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Job Description</h4>
                          <p className="text-sm text-muted-foreground">
                            {match.jobDescription || "Detailed job description available upon contact."}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span>Match Compatibility</span>
                            <span className="font-medium">{matchScore}%</span>
                          </div>
                          <Progress value={matchScore} className="h-2" />
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            className="flex-1"
                            onClick={() => {
                              setSelectedMatch(match);
                              setContactDialogOpen(true);
                            }}
                            disabled={match.status === 'contacted'}
                          >
                            {match.status === 'contacted' ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Already Contacted
                              </>
                            ) : (
                              <>
                                <Mail className="w-4 h-4 mr-2" />
                                Express Interest
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => window.open(match.corporatePartner.website, '_blank')}
                          >
                            Learn More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Target className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Matches Yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Complete your profile and enable recruitment to start receiving job matches
                  </p>
                  <Button onClick={() => setProfileDialogOpen(true)}>
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(corporatePartners as any)?.map((partner: any) => (
                <Card key={partner.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{partner.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {partner.headquarters}
                        </CardDescription>
                      </div>
                      <Badge className={INDUSTRY_COLORS[partner.industry as keyof typeof INDUSTRY_COLORS] || INDUSTRY_COLORS.default}>
                        {partner.industry}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center p-2 rounded bg-muted">
                        <div className="font-medium capitalize">{partner.size}</div>
                        <div className="text-muted-foreground">Company Size</div>
                      </div>
                      <div className="text-center p-2 rounded bg-muted">
                        <div className="font-medium">{partner.recruitmentQuota}</div>
                        <div className="text-muted-foreground">Annual Hires</div>
                      </div>
                    </div>
                    
                    {partner.targetEiQRange && (
                      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border">
                        <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                          Target EiQ™ Range
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                          {partner.targetEiQRange.min} - {partner.targetEiQRange.max}
                        </div>
                      </div>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(partner.website, '_blank')}
                    >
                      Visit Website
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Your Talent Profile
                </CardTitle>
                <CardDescription>Manage your career profile and recruitment settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Current EiQ™ Score</h4>
                    <div className="text-2xl font-bold text-primary">
                      {(talentProfile as any)?.currentEiQScore}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Peak score: {(talentProfile as any)?.peakEiQScore}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Recruitment Status</h4>
                    <div className="flex items-center gap-2">
                      {(talentProfile as any)?.isOpenToRecruitment ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          <Eye className="w-3 h-3 mr-1" />
                          Open to Opportunities
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Not Currently Looking
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Availability: {(talentProfile as any)?.availability}
                    </p>
                  </div>
                </div>

                {(talentProfile as any)?.skillsProfile && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Skills Profile</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">Technical Skills</h5>
                        <div className="flex flex-wrap gap-1">
                          {((talentProfile as any)?.skillsProfile?.technical_skills || []).map((skill: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">Soft Skills</h5>
                        <div className="flex flex-wrap gap-1">
                          {((talentProfile as any)?.skillsProfile?.soft_skills || []).map((skill: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">Languages</h5>
                        <div className="flex flex-wrap gap-1">
                          {((talentProfile as any)?.skillsProfile?.languages || []).map((lang: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={() => setProfileDialogOpen(true)}>
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Profile Creation/Update Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{talentProfile ? "Update" : "Create"} Your Talent Profile</DialogTitle>
            <DialogDescription>
              Set up your profile to connect with top companies through EiQ™-powered matching
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eiqScore">Current EiQ™ Score</Label>
                <Input
                  id="eiqScore"
                  type="number"
                  step="0.1"
                  value={profileData.currentEiQScore}
                  onChange={(e) => setProfileData(prev => ({ ...prev, currentEiQScore: e.target.value }))}
                  placeholder="e.g., 85.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select value={profileData.availability} onValueChange={(value) => 
                  setProfileData(prev => ({ ...prev, availability: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="graduate_2024">Graduate 2024</SelectItem>
                    <SelectItem value="graduate_2025">Graduate 2025</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="recruitment">Open to Recruitment</Label>
                <p className="text-sm text-muted-foreground">
                  Allow companies to see your profile and send opportunities
                </p>
              </div>
              <Switch
                id="recruitment"
                checked={profileData.isOpenToRecruitment}
                onCheckedChange={(checked) => 
                  setProfileData(prev => ({ ...prev, isOpenToRecruitment: checked }))
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setProfileDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={submitProfile}
                disabled={
                  (talentProfile ? updateProfileMutation : createProfileMutation).isPending ||
                  !profileData.currentEiQScore
                }
              >
                {(talentProfile ? updateProfileMutation : createProfileMutation).isPending 
                  ? "Saving..." 
                  : talentProfile ? "Update Profile" : "Create Profile"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Express Interest</DialogTitle>
            <DialogDescription>
              Contact {selectedMatch?.corporatePartner.name} about the {selectedMatch?.jobTitle} position
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={contactData.message}
                onChange={(e) => setContactData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Express your interest and highlight relevant experience..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability">Your Availability</Label>
              <Input
                id="availability"
                value={contactData.availability}
                onChange={(e) => setContactData(prev => ({ ...prev, availability: e.target.value }))}
                placeholder="e.g., Available for immediate start, Can start after graduation..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => selectedMatch && contactMutation.mutate({
                  matchId: selectedMatch.id,
                  message: contactData.message,
                  availability: contactData.availability
                })}
                disabled={contactMutation.isPending || !contactData.message}
              >
                {contactMutation.isPending ? "Sending..." : "Send Interest"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}