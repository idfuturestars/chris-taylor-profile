import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Star, ArrowRight, ArrowLeft, Target, GraduationCap, Brain, Rocket, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import InteractiveAiMentor from "./InteractiveAiMentor";

interface OnboardingData {
  // Primary classification (captured first)
  educationalLevel: string; // k-12, college, masters, phd, phd+, professional
  gradeLevel: string; // K, 1, 2, ..., 12 (for K-12)
  age: number;
  pathwayType: string; // "student" or "career"
  
  // Student-specific (K-12)
  parentEmail: string;
  schoolName: string;
  preferredSubjects: string[];
  
  // Career goals (for older students/professionals)
  careerGoals: {
    targetRole: string;
    targetCompanies: string[];
    salaryExpectations: string;
    timeline: string;
  };
  educationalBackground: {
    currentLevel: string;
    fieldOfStudy: string;
    programmingExperience: string;
    mathBackground: string;
  };
  learningPreferences: {
    studyStyle: string;
    timeCommitment: string;
    preferredFormat: string;
    mentorshipLevel: string;
  };
  assessmentReadiness: {
    confidenceLevel: string;
    previousAssessments: string;
    learningGoals: string[];
    motivationLevel: string;
  };
  selectedTrack: string;
  interests: string[];
  completionStatus: string;
}

export default function OnboardingWizard() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const [selectedMentor, setSelectedMentor] = useState('supportive');
  const [mentorInsights, setMentorInsights] = useState<string[]>([]);
  const [mentorSuggestions, setMentorSuggestions] = useState<string[]>([]);
  const [showAiMentor, setShowAiMentor] = useState(false);

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    // Primary classification - Education First
    educationalLevel: "",
    gradeLevel: "",
    age: 0,
    pathwayType: "student", // Default to student pathway
    
    // Educational focus - Core subjects and interests
    parentEmail: "",
    schoolName: "",
    preferredSubjects: [], // Mathematics, Science, Language Arts, etc.
    
    // Career exploration (secondary, for older students only)
    careerGoals: {
      targetRole: "exploring", // Default for K-12
      targetCompanies: [],
      salaryExpectations: "not-applicable",
      timeline: "exploring"
    },
    educationalBackground: {
      currentLevel: "",
      fieldOfStudy: "",
      programmingExperience: "",
      mathBackground: ""
    },
    learningPreferences: {
      studyStyle: "",
      timeCommitment: "",
      preferredFormat: "",
      mentorshipLevel: ""
    },
    assessmentReadiness: {
      confidenceLevel: "",
      previousAssessments: "",
      learningGoals: [],
      motivationLevel: ""
    },
    selectedTrack: "",
    interests: [],
    completionStatus: "in_progress"
  });

  const saveOnboardingMutation = useMutation({
    mutationFn: async (data: OnboardingData) => {
      // Restructure data to match backend schema
      const backendData = {
        educationalLevel: data.educationalLevel,
        gradeLevel: data.gradeLevel,
        pathwayType: data.pathwayType,
        personalInfo: {
          firstName: "",  // Will be populated from user profile
          lastName: "",   // Will be populated from user profile
          age: data.age || 18
        },
        educationalBackground: data.educationalBackground,
        careerGoals: data.careerGoals,
        learningPreferences: data.learningPreferences,
        assessmentReadiness: data.assessmentReadiness,
        completed: true
      };
      
      return await apiRequest("POST", "/api/user/onboarding", backendData);
    },
    onSuccess: () => {
      toast({
        title: "Welcome to EiQ™ powered by SikatLabs™!",
        description: "Your personalized learning journey has been created.",
      });
      setLocation("/welcome");
    },
    onError: (error: any) => {
      console.error('Onboarding submission error:', error);
      
      // Handle authentication errors specifically
      if (error.message.includes('401')) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to complete your profile setup.",
          variant: "destructive",
        });
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/api/login';
        }, 2000);
      } else {
        toast({
          title: "Setup incomplete",
          description: `Please try completing your profile again. ${error.message || ''}`,
          variant: "destructive",
        });
      }
    },
  });

  // Adaptive steps based on educational level - Education First Approach
  const getStepsForLevel = (educationalLevel: string) => {
    if (educationalLevel === "k-12") {
      return 4; // K-12: 1) Basic info + subjects, 2) Learning interests, 3) Learning preferences, 4) Assessment readiness
    }
    return 5; // College+: Full flow including career exploration in step 3
  };
  
  const totalSteps = getStepsForLevel(onboardingData.educationalLevel) || 5;

  const handleNext = () => {
    const totalStepsForLevel = getStepsForLevel(onboardingData.educationalLevel);
    
    if (currentStep < totalStepsForLevel) {
      setCurrentStep(currentStep + 1);
    } else {
      // Automatically set educational defaults for K-12 students (no career pressure)
      if (onboardingData.educationalLevel === "k-12") {
        setOnboardingData(prev => ({
          ...prev,
          careerGoals: {
            targetRole: "exploring-education",
            targetCompanies: ["Focus on learning first"],
            salaryExpectations: "not-applicable-yet",
            timeline: "after-graduation"
          }
        }));
      }
      saveOnboardingMutation.mutate(onboardingData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateCareerGoals = (field: string, value: string | string[]) => {
    setOnboardingData(prev => ({
      ...prev,
      careerGoals: { ...prev.careerGoals, [field]: value }
    }));
  };

  const updateEducationalBackground = (field: string, value: string) => {
    setOnboardingData(prev => ({
      ...prev,
      educationalBackground: { ...prev.educationalBackground, [field]: value }
    }));
  };

  const updateLearningPreferences = (field: string, value: string) => {
    setOnboardingData(prev => ({
      ...prev,
      learningPreferences: { ...prev.learningPreferences, [field]: value }
    }));
  };

  const updateAssessmentReadiness = (field: string, value: string | string[]) => {
    setOnboardingData(prev => ({
      ...prev,
      assessmentReadiness: { ...prev.assessmentReadiness, [field]: value }
    }));
  };

  const toggleCompany = (company: string) => {
    const current = onboardingData.careerGoals.targetCompanies;
    const updated = current.includes(company) 
      ? current.filter(c => c !== company)
      : [...current, company];
    updateCareerGoals("targetCompanies", updated);
  };

  const toggleLearningGoal = (goal: string) => {
    const current = onboardingData.assessmentReadiness.learningGoals;
    const updated = current.includes(goal) 
      ? current.filter(g => g !== goal)
      : [...current, goal];
    updateAssessmentReadiness("learningGoals", updated);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Your Educational Journey Starts Here</h2>
              <p className="text-gray-400">Let's personalize your learning experience based on your current educational level</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white">What's your current educational level? *</Label>
                <Select value={onboardingData.educationalLevel} onValueChange={(value) => {
                  setOnboardingData(prev => ({
                    ...prev,
                    educationalLevel: value,
                    pathwayType: value === "k-12" || value === "college" ? "student" : "career"
                  }));
                }}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select your educational level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="k-12">K-12 Student</SelectItem>
                    <SelectItem value="college">College Student</SelectItem>
                    <SelectItem value="masters">Master's Student</SelectItem>
                    <SelectItem value="phd">PhD Student</SelectItem>
                    <SelectItem value="phd+">PhD Graduate</SelectItem>
                    <SelectItem value="professional">Working Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {onboardingData.educationalLevel === "k-12" && (
                <div>
                  <Label className="text-white">What grade are you in? *</Label>
                  <Select value={onboardingData.gradeLevel} onValueChange={(value) => 
                    setOnboardingData(prev => ({ ...prev, gradeLevel: value }))
                  }>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select your grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="K">Kindergarten</SelectItem>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(grade => (
                        <SelectItem key={grade} value={grade.toString()}>Grade {grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label className="text-white">How old are you? *</Label>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  value={onboardingData.age || ""}
                  onChange={(e) => setOnboardingData(prev => ({ 
                    ...prev, 
                    age: parseInt(e.target.value) || 0 
                  }))}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
              
              {onboardingData.educationalLevel === "k-12" && (
                <>
                  <div>
                    <Label className="text-white">Parent/Guardian Email *</Label>
                    <Input
                      type="email"
                      placeholder="parent@example.com"
                      value={onboardingData.parentEmail}
                      onChange={(e) => setOnboardingData(prev => ({ 
                        ...prev, 
                        parentEmail: e.target.value 
                      }))}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    />
                    <p className="text-xs text-gray-400 mt-1">We'll send updates to your parent/guardian</p>
                  </div>
                  
                  <div>
                    <Label className="text-white">School Name</Label>
                    <Input
                      placeholder="Your school name"
                      value={onboardingData.schoolName}
                      onChange={(e) => setOnboardingData(prev => ({ 
                        ...prev, 
                        schoolName: e.target.value 
                      }))}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-3 block">Which subjects are you most interested in?</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'Mathematics',
                        'Science',
                        'Language Arts',
                        'Social Studies',
                        'Technology',
                        'Arts & Creativity'
                      ].map((subject) => (
                        <div key={subject} className="flex items-center space-x-2">
                          <Checkbox
                            id={subject}
                            checked={onboardingData.preferredSubjects.includes(subject)}
                            onCheckedChange={() => {
                              const current = onboardingData.preferredSubjects;
                              const updated = current.includes(subject) 
                                ? current.filter(s => s !== subject)
                                : [...current, subject];
                              setOnboardingData(prev => ({ 
                                ...prev, 
                                preferredSubjects: updated 
                              }));
                            }}
                            className="border-gray-600"
                          />
                          <Label htmlFor={subject} className="text-white text-sm">{subject}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {onboardingData.pathwayType && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Brain className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="text-green-400 font-medium">
                        {onboardingData.pathwayType === "student" ? "Student Pathway" : "Career Pathway"}
                      </h4>
                      <p className="text-green-300 text-sm">
                        {onboardingData.pathwayType === "student" 
                          ? "Perfect! We'll create a personalized learning journey with age-appropriate content and fun industry challenges."
                          : "Great! We'll focus on career advancement with industry-specific skills and professional networking opportunities."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <GraduationCap className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                {onboardingData.educationalLevel === "k-12" ? "Your Learning Interests" : "Educational Background"}
              </h2>
              <p className="text-gray-400">
                {onboardingData.educationalLevel === "k-12" 
                  ? "Tell us what subjects you enjoy and how you like to learn"
                  : "Help us understand your current knowledge level"
                }
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white">Current Education Level</Label>
                <Select value={onboardingData.educationalBackground.currentLevel} onValueChange={(value) => updateEducationalBackground("currentLevel", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="bootcamp">Bootcamp</SelectItem>
                    <SelectItem value="self-taught">Self-taught</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Field of Study</Label>
                <Select value={onboardingData.educationalBackground.fieldOfStudy} onValueChange={(value) => updateEducationalBackground("fieldOfStudy", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select your field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Programming Experience</Label>
                <Select value={onboardingData.educationalBackground.programmingExperience} onValueChange={(value) => updateEducationalBackground("programmingExperience", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select your programming level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Math Background</Label>
                <Select value={onboardingData.educationalBackground.mathBackground} onValueChange={(value) => updateEducationalBackground("mathBackground", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select your math level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (Algebra)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (Calculus)</SelectItem>
                    <SelectItem value="advanced">Advanced (Linear Algebra, Statistics)</SelectItem>
                    <SelectItem value="expert">Expert (Advanced Mathematics)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Brain className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                {onboardingData.educationalLevel === "k-12" ? "Learning Style" : "Learning Preferences"}
              </h2>
              <p className="text-gray-400">
                {onboardingData.educationalLevel === "k-12" 
                  ? "Tell us how you like to learn best" 
                  : "Customize your learning experience"
                }
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white">Learning Style</Label>
                <Select value={onboardingData.learningPreferences.studyStyle} onValueChange={(value) => updateLearningPreferences("studyStyle", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="How do you prefer to learn?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visual">Visual (videos, diagrams, colorful examples)</SelectItem>
                    <SelectItem value="hands-on">Hands-on (coding, building projects)</SelectItem>
                    <SelectItem value="reading">Reading (articles, tutorials)</SelectItem>
                    <SelectItem value="mixed">Mixed approach</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">
                  {onboardingData.educationalLevel === "k-12" ? "Study Time" : "Time Commitment"}
                </Label>
                <Select value={onboardingData.learningPreferences.timeCommitment} onValueChange={(value) => updateLearningPreferences("timeCommitment", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder={
                      onboardingData.educationalLevel === "k-12" 
                        ? "How much time can you study?" 
                        : "How much time can you dedicate?"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {onboardingData.educationalLevel === "k-12" ? (
                      <>
                        <SelectItem value="1-5-hours">1-5 hours/week (30 min per day)</SelectItem>
                        <SelectItem value="5-10-hours">5-10 hours/week (1 hour per day)</SelectItem>
                        <SelectItem value="10-20-hours">10+ hours/week (weekends + after school)</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="1-5-hours">1-5 hours/week</SelectItem>
                        <SelectItem value="5-10-hours">5-10 hours/week</SelectItem>
                        <SelectItem value="10-20-hours">10-20 hours/week</SelectItem>
                        <SelectItem value="20-hours">20+ hours/week</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Preferred Format</Label>
                <Select value={onboardingData.learningPreferences.preferredFormat} onValueChange={(value) => updateLearningPreferences("preferredFormat", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select learning format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self-paced">Self-paced</SelectItem>
                    <SelectItem value="structured">Structured curriculum</SelectItem>
                    <SelectItem value="project-based">Project-based</SelectItem>
                    <SelectItem value="mentored">Mentored sessions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">
                  {onboardingData.educationalLevel === "k-12" ? "AI Helper Level" : "AI Mentorship Level"}
                </Label>
                <Select value={onboardingData.learningPreferences.mentorshipLevel} onValueChange={(value) => updateLearningPreferences("mentorshipLevel", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder={
                      onboardingData.educationalLevel === "k-12" 
                        ? "How much help do you want from your AI tutor?" 
                        : "How much AI guidance do you want?"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {onboardingData.educationalLevel === "k-12" ? (
                      <>
                        <SelectItem value="moderate">Some help when I'm stuck</SelectItem>
                        <SelectItem value="intensive">Lots of help and encouragement</SelectItem>
                        <SelectItem value="full-support">Step-by-step guidance</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="minimal">Minimal guidance</SelectItem>
                        <SelectItem value="moderate">Moderate guidance</SelectItem>
                        <SelectItem value="intensive">Intensive mentoring</SelectItem>
                        <SelectItem value="full-support">Full AI support</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Rocket className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Assessment Readiness</h2>
              <p className="text-gray-400">Let's prepare for your EiQ assessment</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white">Confidence Level</Label>
                <Select value={onboardingData.assessmentReadiness.confidenceLevel} onValueChange={(value) => updateAssessmentReadiness("confidenceLevel", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="How confident do you feel?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-confident">Very confident</SelectItem>
                    <SelectItem value="confident">Confident</SelectItem>
                    <SelectItem value="somewhat-confident">Somewhat confident</SelectItem>
                    <SelectItem value="not-confident">Need preparation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Previous Assessments</Label>
                <Select value={onboardingData.assessmentReadiness.previousAssessments} onValueChange={(value) => updateAssessmentReadiness("previousAssessments", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Have you taken similar tests?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No previous experience</SelectItem>
                    <SelectItem value="coding-interviews">Coding interviews</SelectItem>
                    <SelectItem value="standardized-tests">Standardized tests</SelectItem>
                    <SelectItem value="multiple">Multiple types</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white mb-3 block">
                  {onboardingData.educationalLevel === "k-12" ? "What would you like to get better at?" : "Learning Goals"}
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {(onboardingData.educationalLevel === "k-12" ? [
                    'Math problem solving',
                    'Reading and writing',
                    'Science experiments', 
                    'Computer programming',
                    'Creative thinking',
                    'Working with others'
                  ] : [
                    'Problem-solving skills',
                    'Algorithm optimization',
                    'System design',
                    'AI/ML concepts',
                    'Data structures',
                    'Mathematical reasoning'
                  ]).map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={onboardingData.assessmentReadiness.learningGoals.includes(goal)}
                        onCheckedChange={() => toggleLearningGoal(goal)}
                        className="border-gray-600"
                      />
                      <Label htmlFor={goal} className="text-white text-sm">{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white">Motivation Level</Label>
                <Select value={onboardingData.assessmentReadiness.motivationLevel} onValueChange={(value) => updateAssessmentReadiness("motivationLevel", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="How motivated are you?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="extremely-motivated">Extremely motivated</SelectItem>
                    <SelectItem value="very-motivated">Very motivated</SelectItem>
                    <SelectItem value="motivated">Motivated</SelectItem>
                    <SelectItem value="somewhat-motivated">Somewhat motivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Star className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Launch!</h2>
              <p className="text-gray-400">Review your personalized EiQ journey</p>
            </div>

            <div className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Your EiQ Profile Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-gray-300">
                    <strong>Career Goal:</strong> {onboardingData.careerGoals.targetRole || "Not specified"}
                  </div>
                  <div className="text-gray-300">
                    <strong>Target Companies:</strong> {onboardingData.careerGoals.targetCompanies.join(", ") || "None selected"}
                  </div>
                  <div className="text-gray-300">
                    <strong>Programming Level:</strong> {onboardingData.educationalBackground.programmingExperience || "Not specified"}
                  </div>
                  <div className="text-gray-300">
                    <strong>Time Commitment:</strong> {onboardingData.learningPreferences.timeCommitment || "Not specified"}
                  </div>
                  <div className="text-gray-300">
                    <strong>Learning Goals:</strong> {onboardingData.assessmentReadiness.learningGoals.join(", ") || "None selected"}
                  </div>
                </CardContent>
              </Card>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Next Steps</h3>
                <ul className="text-gray-300 space-y-1">
                  <li>• Complete your EiQ assessment</li>
                  <li>• Get personalized learning recommendations</li>
                  <li>• Start your AI-powered mentoring journey</li>
                  <li>• Track progress towards your career goals</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleMentorResponse = (insights: string[], suggestions: string[]) => {
    setMentorInsights(insights);
    setMentorSuggestions(suggestions);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="flex w-full max-w-7xl gap-6">
        {/* Main Onboarding Card */}
        <Card className="flex-1 max-w-2xl bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-green-500 mr-2" />
              <h1 className="text-2xl font-bold text-white">
                EiQ<span className="text-lg align-top">™</span> powered by SikatLab<span className="text-lg align-top">™</span> and IDFS Pathway<span className="text-lg align-top">™</span> Setup
              </h1>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
            <p className="text-gray-400 mt-2">Step {currentStep} of {totalSteps}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {renderStep()}
            
            <div className="flex justify-between pt-6">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                {/* AI Mentor Toggle Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowAiMentor(!showAiMentor)}
                  className={`${showAiMentor ? 'bg-green-600 border-green-600' : 'bg-gray-800 border-gray-700'} text-white hover:bg-green-700`}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  AI Mentor
                </Button>
              </div>
              
              <Button
                onClick={handleNext}
                disabled={saveOnboardingMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {currentStep === totalSteps ? (
                  saveOnboardingMutation.isPending ? "Setting up..." : "Complete Setup"
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Show mentor insights and suggestions inline if available */}
            {(mentorInsights.length > 0 || mentorSuggestions.length > 0) && (
              <div className="bg-gray-800 border border-green-600/20 rounded-lg p-4 space-y-3">
                <h3 className="text-green-500 font-semibold">💡 AI Mentor Insights</h3>
                {mentorInsights.length > 0 && (
                  <div className="space-y-1">
                    {mentorInsights.map((insight, index) => (
                      <p key={index} className="text-gray-300 text-sm">• {insight}</p>
                    ))}
                  </div>
                )}
                {mentorSuggestions.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-gray-300 text-sm font-medium">Suggestions:</p>
                    {mentorSuggestions.map((suggestion, index) => (
                      <p key={index} className="text-gray-300 text-sm">→ {suggestion}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Mentor Side Panel */}
        {showAiMentor && (
          <div className="w-96">
            <InteractiveAiMentor
              currentStep={currentStep}
              selectedMentor={selectedMentor}
              onStepGuidance={(guidance) => console.log('Step guidance:', guidance)}
              onInsightsUpdate={(insights) => setMentorInsights(insights)}
              onSuggestionsUpdate={(suggestions) => setMentorSuggestions(suggestions)}
              onMentorChange={setSelectedMentor}
              userContext={{
                educationalLevel: onboardingData.educationalLevel,
                age: onboardingData.age,
                gradeLevel: onboardingData.gradeLevel,
                userResponses: onboardingData
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}