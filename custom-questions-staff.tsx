import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Eye, Edit, Trash2, Brain, Users, BarChart3, Clock } from "lucide-react";

const questionSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  questionType: z.enum(["remediation", "enrichment", "diagnostic", "practice"]),
  cognitiveDomain: z.enum(["logical_reasoning", "pattern_recognition", "spatial_reasoning", "numerical_ability", "verbal_comprehension", "emotional_intelligence"]),
  targetAge: z.string().min(1, "Target age is required"),
  estimatedTime: z.number().min(1).max(60),
  targetStudents: z.array(z.string()).optional()
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface CustomQuestion {
  id: string;
  topic: string;
  difficulty: string;
  questionType: string;
  cognitiveDomain: string;
  targetAge: string;
  estimatedTime: number;
  content: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  createdAt: string;
  staffId: string;
  assignedCount: number;
  completionRate: number;
}

export default function CustomQuestionsStaff() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedQuestion, setSelectedQuestion] = useState<CustomQuestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      difficulty: "intermediate",
      questionType: "practice",
      cognitiveDomain: "logical_reasoning",
      estimatedTime: 5,
      targetStudents: []
    }
  });

  // Fetch custom questions
  const { data: questions, isLoading } = useQuery<CustomQuestion[]>({
    queryKey: ["/api/staff/custom-questions"],
    enabled: true
  });

  // Generate new question mutation
  const generateMutation = useMutation({
    mutationFn: async (data: QuestionFormData) => {
      setIsGenerating(true);
      const response = await apiRequest("POST", "/api/staff/custom-questions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff/custom-questions"] });
      toast({
        title: "Success",
        description: "Custom question generated successfully",
      });
      form.reset();
      setIsGenerating(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  // Delete question mutation
  const deleteMutation = useMutation({
    mutationFn: async (questionId: string) => {
      await apiRequest("DELETE", `/api/staff/custom-questions/${questionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff/custom-questions"] });
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateQuestion = (data: QuestionFormData) => {
    generateMutation.mutate(data);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteMutation.mutate(questionId);
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      remediation: "bg-red-100 text-red-800",
      enrichment: "bg-blue-100 text-blue-800",
      diagnostic: "bg-yellow-100 text-yellow-800",
      practice: "bg-green-100 text-green-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800"
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions = questions?.length || 0;
  const avgCompletionRate = questions?.length ? 
    (questions.reduce((sum, q) => sum + q.completionRate, 0) / questions.length).toFixed(1) : "0";
  const totalAssignments = questions?.reduce((sum, q) => sum + q.assignedCount, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Custom Questions Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Create and manage AI-powered custom questions for personalized learning
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Generate Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate Custom Question</DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleGenerateQuestion)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Algebra, Logic Puzzles" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="targetAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Age</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 13-15, Adult" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="questionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="practice">Practice</SelectItem>
                              <SelectItem value="remediation">Remediation</SelectItem>
                              <SelectItem value="enrichment">Enrichment</SelectItem>
                              <SelectItem value="diagnostic">Diagnostic</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cognitiveDomain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cognitive Domain</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="logical_reasoning">Logical Reasoning</SelectItem>
                              <SelectItem value="pattern_recognition">Pattern Recognition</SelectItem>
                              <SelectItem value="spatial_reasoning">Spatial Reasoning</SelectItem>
                              <SelectItem value="numerical_ability">Numerical Ability</SelectItem>
                              <SelectItem value="verbal_comprehension">Verbal Comprehension</SelectItem>
                              <SelectItem value="emotional_intelligence">Emotional Intelligence</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Time (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="60" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      type="submit" 
                      disabled={isGenerating}
                      className="gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4" />
                          Generate with AI
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalQuestions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Assignments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAssignments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Completion</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgCompletionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Questions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {questions?.filter(q => q.assignedCount > 0).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Question Library</CardTitle>
          </CardHeader>
          <CardContent>
            {questions && questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {question.topic}
                          </h3>
                          <Badge className={getTypeColor(question.questionType)}>
                            {question.questionType}
                          </Badge>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p><span className="font-medium">Domain:</span> {question.cognitiveDomain.replace('_', ' ')}</p>
                          <p><span className="font-medium">Target Age:</span> {question.targetAge}</p>
                          <p><span className="font-medium">Time:</span> {question.estimatedTime} minutes</p>
                          <p><span className="font-medium">Assignments:</span> {question.assignedCount} | <span className="font-medium">Completion:</span> {question.completionRate}%</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedQuestion(question)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Custom Questions Yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Generate your first AI-powered custom question to get started
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Generate First Question
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Question Preview Modal */}
        {selectedQuestion && (
          <Dialog open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Question Preview</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(selectedQuestion.questionType)}>
                    {selectedQuestion.questionType}
                  </Badge>
                  <Badge className={getDifficultyColor(selectedQuestion.difficulty)}>
                    {selectedQuestion.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {selectedQuestion.cognitiveDomain.replace('_', ' ')}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Question</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedQuestion.content}</p>
                </div>

                {selectedQuestion.options && selectedQuestion.options.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Answer Options</h3>
                    <div className="space-y-2">
                      {selectedQuestion.options.map((option, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg border ${
                            option === selectedQuestion.correctAnswer 
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          {option}
                          {option === selectedQuestion.correctAnswer && (
                            <span className="ml-2 text-green-600 font-medium">(Correct)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedQuestion.explanation && (
                  <div>
                    <h3 className="font-semibold mb-2">Explanation</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedQuestion.explanation}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}