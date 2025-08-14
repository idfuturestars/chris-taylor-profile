import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, BookOpen, Brain, Award, Target, Users, MessageSquare, TrendingUp, Rocket, FlaskConical } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatLayout from "@/components/layout/ChatLayout";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    programs?: EducationProgram[];
    opportunities?: Opportunity[];
    research?: ResearchProject[];
    confidence?: number;
    academicLevel?: string;
  };
}

interface EducationProgram {
  id: string;
  name: string;
  level: "undergraduate" | "graduate" | "doctoral" | "postdoc";
  field: string;
  duration: string;
  requirements: string[];
  opportunities: string[];
  outcomes: string[];
  description: string;
}

interface Opportunity {
  id: string;
  title: string;
  type: "internship" | "research" | "fellowship" | "conference" | "competition";
  deadline: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

interface ResearchProject {
  id: string;
  title: string;
  field: string;
  supervisor: string;
  status: "available" | "in_progress" | "completed";
  duration: string;
  requirements: string[];
  description: string;
}

interface HigherEducationProfile {
  name: string;
  currentLevel: string;
  major: string;
  gpa: number;
  researchInterests: string[];
  careerGoals: string[];
  currentProjects: string[];
  academicAchievements: string[];
  skillsToImprove: string[];
  graduationDate: string;
}

const mockProfile: HigherEducationProfile = {
  name: "Jordan Smith",
  currentLevel: "Graduate Student (Master's)",
  major: "Computer Science & AI",
  gpa: 3.85,
  researchInterests: ["Machine Learning", "Natural Language Processing", "Computer Vision", "AI Ethics"],
  careerGoals: ["PhD in AI", "Research Scientist", "AI Product Manager"],
  currentProjects: ["Thesis: Neural Language Models", "TA for ML Course", "Research Assistant"],
  academicAchievements: ["Dean's List", "Best Paper Award", "Graduate Fellowship"],
  skillsToImprove: ["Research Writing", "Statistical Analysis", "Public Speaking"],
  graduationDate: "May 2025"
};

const mockPrograms: EducationProgram[] = [
  {
    id: "1",
    name: "PhD in Artificial Intelligence",
    level: "doctoral",
    field: "Computer Science",
    duration: "4-6 years",
    requirements: ["Master's in CS/related field", "Research experience", "Strong GPA", "GRE scores"],
    opportunities: ["Teaching assistantships", "Research funding", "Conference presentations", "Industry collaborations"],
    outcomes: ["Research scientist positions", "Faculty roles", "R&D leadership", "Startup founder"],
    description: "Advanced research program focusing on cutting-edge AI technologies and their applications"
  },
  {
    id: "2",
    name: "Professional Master's in Data Science",
    level: "graduate",
    field: "Data Science",
    duration: "1.5-2 years",
    requirements: ["Bachelor's degree", "Programming experience", "Statistics background"],
    opportunities: ["Industry projects", "Internships", "Capstone projects", "Networking events"],
    outcomes: ["Data scientist roles", "ML engineer positions", "Analytics consultant", "Product manager"],
    description: "Applied program combining theoretical foundations with practical industry experience"
  }
];

const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Google AI Research Internship",
    type: "internship",
    deadline: "February 15, 2025",
    description: "12-week summer internship working on large language model research",
    requirements: ["PhD/Master's student", "ML research experience", "Python programming"],
    benefits: ["$8,000/month stipend", "Mentorship", "Publication opportunities", "Full-time offer potential"]
  },
  {
    id: "2",
    title: "NSF Graduate Research Fellowship",
    type: "fellowship",
    deadline: "October 25, 2024",
    description: "3-year fellowship supporting graduate research in STEM fields",
    requirements: ["US citizen/permanent resident", "Graduate student", "Research proposal"],
    benefits: ["$37,000 annual stipend", "$12,000 education allowance", "Prestige", "Flexibility"]
  },
  {
    id: "3",
    title: "ICML 2025 Conference",
    type: "conference",
    deadline: "January 31, 2025",
    description: "Premier machine learning conference for presenting research",
    requirements: ["Original research", "Paper submission", "Peer review"],
    benefits: ["Publication", "Networking", "Career advancement", "Knowledge exchange"]
  }
];

export default function HigherEducationDashboard() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello ${mockProfile.name}! I see you're a ${mockProfile.currentLevel} studying ${mockProfile.major} with an excellent GPA of ${mockProfile.gpa}. Based on your research interests in ${mockProfile.researchInterests.slice(0, 2).join(" and ")}, I've identified some exciting opportunities that align with your career goals. What would you like to explore today?`,
      timestamp: new Date(),
      metadata: {
        academicLevel: mockProfile.currentLevel,
        programs: mockPrograms.slice(0, 1),
        opportunities: mockOpportunities.slice(0, 2),
        confidence: 91
      }
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/higher-ed-advisor", {
        message,
        profile: mockProfile,
        selectedProgram,
        currentPrograms: mockPrograms,
        opportunities: mockOpportunities
      });
      return response;
    },
    onSuccess: (response) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
        metadata: response.metadata
      };
      setMessages(prev => [...prev, newMessage]);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    }
  });

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    sendMessageMutation.mutate(message);
  };

  const handleApplyToProgram = (programId: string) => {
    const program = mockPrograms.find(p => p.id === programId);
    if (program) {
      toast({
        title: "Application started",
        description: `Started application for ${program.name}`,
      });
    }
  };

  const handleApplyToOpportunity = (opportunityId: string) => {
    const opportunity = mockOpportunities.find(o => o.id === opportunityId);
    if (opportunity) {
      toast({
        title: "Application in progress",
        description: `Started application for ${opportunity.title}`,
      });
    }
  };

  const handleSelectProgram = (programId: string) => {
    setSelectedProgram(programId);
    const program = mockPrograms.find(p => p.id === programId);
    if (program) {
      const message = `Tell me more about ${program.name} and how it aligns with my background and goals.`;
      handleSendMessage(message);
    }
  };

  // Create sidebar navigation
  const sidebarNav = (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-4">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎓</div>
          <div className="font-medium text-gray-900 dark:text-white">{mockProfile.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{mockProfile.currentLevel}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{mockProfile.major}</div>
          <div className="flex justify-center space-x-2 mt-2">
            <Badge variant="secondary" className="text-xs">GPA: {mockProfile.gpa}</Badge>
            <Badge variant="outline" className="text-xs">Grad: {mockProfile.graduationDate}</Badge>
          </div>
        </div>

        <div className="space-y-1">
          <Button
            variant="secondary"
            className="w-full justify-start"
          >
            <MessageSquare className="w-4 h-4 mr-3" />
            Chat with Academic Advisor
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <Target className="w-4 h-4 mr-3" />
            Academic Goals
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <Award className="w-4 h-4 mr-3" />
            Achievements
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <Users className="w-4 h-4 mr-3" />
            Research Network
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Available Programs</div>
          <div className="space-y-1">
            {mockPrograms.map((program) => (
              <Button
                key={program.id}
                variant={selectedProgram === program.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left"
                onClick={() => handleSelectProgram(program.id)}
              >
                <div className="flex items-center">
                  <GraduationCap className="w-4 h-4 mr-3" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium truncate">{program.name}</div>
                    <div className="text-xs text-gray-500">{program.duration}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Research Interests</div>
          <div className="space-y-1">
            {mockProfile.researchInterests.map((interest, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400 py-1">
                🔬 {interest}
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Career Goals</div>
          <div className="space-y-1">
            {mockProfile.careerGoals.map((goal, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400 py-1">
                🎯 {goal}
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Current Projects</div>
          <div className="space-y-1">
            {mockProfile.currentProjects.map((project, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400 py-1">
                📋 {project}
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Academic Stats</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-medium">{mockProfile.academicAchievements.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Awards</div>
            </div>
            <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-medium">{mockProfile.currentProjects.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Projects</div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <ChatLayout
      title="Higher Education Dashboard"
      subtitle="AI-powered academic planning and career guidance for graduate students and researchers"
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      sidebar={sidebarNav}
      renderMessage={(message) => {
        if (message.metadata?.programs || message.metadata?.opportunities) {
          return (
            <div className="space-y-4">
              <p className="text-gray-900 dark:text-white">{message.content}</p>
              
              {message.metadata.programs && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recommended Programs</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {message.metadata.programs.map((program: any) => (
                      <div key={program.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{program.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{program.field} • {program.duration}</p>
                          </div>
                          <Badge 
                            variant={
                              program.level === 'doctoral' ? 'destructive' :
                              program.level === 'graduate' ? 'default' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {program.level}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          {program.description}
                        </p>
                        
                        <div className="space-y-2 mb-3">
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Requirements: </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {program.requirements.slice(0, 2).join(", ")}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Outcomes: </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {program.outcomes.slice(0, 2).join(", ")}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleApplyToProgram(program.id)}
                          >
                            Learn More
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => handleApplyToProgram(program.id)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {message.metadata.opportunities && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Current Opportunities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {message.metadata.opportunities.map((opportunity: any) => (
                      <div key={opportunity.id} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{opportunity.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Deadline: {opportunity.deadline}</p>
                          </div>
                          <Badge 
                            variant={
                              opportunity.type === 'fellowship' ? 'default' :
                              opportunity.type === 'internship' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {opportunity.type}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          {opportunity.description}
                        </p>
                        
                        <div className="space-y-2 mb-3">
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Benefits: </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {opportunity.benefits.slice(0, 2).join(", ")}
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleApplyToOpportunity(opportunity.id)}
                        >
                          Apply Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }
        return <p className="text-gray-900 dark:text-white">{message.content}</p>;
      }}
    />
  );
}