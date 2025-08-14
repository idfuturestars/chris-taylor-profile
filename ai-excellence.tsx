import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Brain, 
  Zap, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Trophy,
  Lightbulb,
  Rocket,
  Star,
  BarChart3,
  Settings,
  Play
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface AIModel {
  id: string;
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Gemini';
  capability: string;
  accuracy: number;
  speed: number;
  isActive: boolean;
  usageCount: number;
}

interface OptimizationResult {
  id: string;
  type: 'question_generation' | 'hint_optimization' | 'learning_path' | 'assessment_calibration';
  title: string;
  description: string;
  improvement: number;
  status: 'running' | 'completed' | 'pending';
  metrics: {
    before: number;
    after: number;
    improvement: string;
  };
  timestamp: string;
}

interface AIInsight {
  id: string;
  category: 'performance' | 'user_behavior' | 'content_quality' | 'predictive';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  impact: 'high' | 'medium' | 'low';
  recommendations: string[];
}

interface AIExperiment {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  status: 'running' | 'completed' | 'paused';
  participants: number;
  duration: number;
  results?: {
    improvement: number;
    significance: number;
    winner: string;
  };
}

export default function AIExcellencePage() {
  const [activeModels, setActiveModels] = useState<AIModel[]>([]);
  const [optimizations, setOptimizations] = useState<OptimizationResult[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [experiments, setExperiments] = useState<AIExperiment[]>([]);
  const [selectedTab, setSelectedTab] = useState('models');
  const [newExperiment, setNewExperiment] = useState({
    name: '',
    description: '',
    hypothesis: ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadAIExcellenceData();
  }, []);

  const loadAIExcellenceData = async () => {
    try {
      // Load AI models
      const modelsResponse = await apiRequest('GET', '/api/ai-excellence/models');
      const modelsData = await modelsResponse.json();
      setActiveModels(modelsData.models || sampleModels);
      
      // Load optimizations
      const optimizationsResponse = await apiRequest('GET', '/api/ai-excellence/optimizations');
      const optimizationsData = await optimizationsResponse.json();
      setOptimizations(optimizationsData.optimizations || sampleOptimizations);
      
      // Load insights
      const insightsResponse = await apiRequest('GET', '/api/ai-excellence/insights');
      const insightsData = await insightsResponse.json();
      setInsights(insightsData.insights || sampleInsights);
      
      // Load experiments
      const experimentsResponse = await apiRequest('GET', '/api/ai-excellence/experiments');
      const experimentsData = await experimentsResponse.json();
      setExperiments(experimentsData.experiments || sampleExperiments);
      
    } catch (error) {
      console.error('Failed to load AI Excellence data:', error);
      // Use sample data as fallback
      setActiveModels(sampleModels);
      setOptimizations(sampleOptimizations);
      setInsights(sampleInsights);
      setExperiments(sampleExperiments);
    }
  };

  const toggleModel = async (modelId: string) => {
    try {
      const model = activeModels.find(m => m.id === modelId);
      if (!model) return;

      await apiRequest('PATCH', `/api/ai-excellence/models/${modelId}`, {
        isActive: !model.isActive
      });

      setActiveModels(prev => 
        prev.map(m => 
          m.id === modelId ? { ...m, isActive: !m.isActive } : m
        )
      );

      toast({
        title: `${model.name} ${!model.isActive ? 'Activated' : 'Deactivated'}`,
        description: `Model is now ${!model.isActive ? 'available' : 'disabled'} for use.`
      });
    } catch (error) {
      console.error('Failed to toggle model:', error);
      toast({
        title: "Failed to update model",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const startOptimization = async (type: string) => {
    try {
      await apiRequest('POST', '/api/ai-excellence/optimizations/start', {
        type,
        userId: 'demo_user'
      });

      toast({
        title: "Optimization Started",
        description: "AI optimization process is now running in the background."
      });

      // Refresh optimizations
      loadAIExcellenceData();
    } catch (error) {
      console.error('Failed to start optimization:', error);
      toast({
        title: "Failed to start optimization",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const createExperiment = async () => {
    if (!newExperiment.name || !newExperiment.hypothesis) return;

    try {
      await apiRequest('POST', '/api/ai-excellence/experiments', {
        ...newExperiment,
        userId: 'demo_user'
      });

      setNewExperiment({ name: '', description: '', hypothesis: '' });
      
      toast({
        title: "Experiment Created",
        description: "New A/B test experiment is now running."
      });

      loadAIExcellenceData();
    } catch (error) {
      console.error('Failed to create experiment:', error);
      toast({
        title: "Failed to create experiment",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  // Sample data for fallback
  const sampleModels: AIModel[] = [
    {
      id: '1',
      name: 'GPT-4o',
      provider: 'OpenAI',
      capability: 'Advanced reasoning and code generation',
      accuracy: 94,
      speed: 87,
      isActive: true,
      usageCount: 15420
    },
    {
      id: '2',
      name: 'Claude Sonnet 4.0',
      provider: 'Anthropic',
      capability: 'Complex analysis and creative problem solving',
      accuracy: 96,
      speed: 91,
      isActive: true,
      usageCount: 12850
    },
    {
      id: '3',
      name: 'Gemini 2.5 Pro',
      provider: 'Gemini',
      capability: 'Multimodal processing and reasoning',
      accuracy: 92,
      speed: 89,
      isActive: false,
      usageCount: 8320
    }
  ];

  const sampleOptimizations: OptimizationResult[] = [
    {
      id: '1',
      type: 'question_generation',
      title: 'Adaptive Question Quality Enhancement',
      description: 'Optimizing AI-generated questions for better cognitive assessment alignment',
      improvement: 23,
      status: 'completed',
      metrics: {
        before: 78,
        after: 96,
        improvement: '+18 points accuracy'
      },
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'hint_optimization',
      title: 'Contextual Hint Personalization',
      description: 'Fine-tuning hint generation for individual learning styles',
      improvement: 31,
      status: 'running',
      metrics: {
        before: 67,
        after: 89,
        improvement: '+22 points effectiveness'
      },
      timestamp: '30 minutes ago'
    }
  ];

  const sampleInsights: AIInsight[] = [
    {
      id: '1',
      category: 'performance',
      title: 'Multi-AI Ensemble Shows 15% Better Results',
      description: 'Combining Claude and GPT-4o for question generation yields significantly higher quality assessments',
      confidence: 92,
      actionable: true,
      impact: 'high',
      recommendations: [
        'Implement ensemble voting for question generation',
        'Use Claude for creative aspects, GPT-4o for technical accuracy',
        'Add confidence scoring for model selection'
      ]
    },
    {
      id: '2',
      category: 'user_behavior',
      title: 'Adaptive Difficulty Increases Engagement by 28%',
      description: 'Users show higher completion rates and satisfaction with AI-adjusted difficulty levels',
      confidence: 87,
      actionable: true,
      impact: 'high',
      recommendations: [
        'Expand adaptive difficulty to all assessment types',
        'Implement real-time difficulty adjustment',
        'Add user feedback loop for difficulty preferences'
      ]
    }
  ];

  const sampleExperiments: AIExperiment[] = [
    {
      id: '1',
      name: 'Personalized Learning Paths A/B Test',
      description: 'Testing AI-generated vs. rule-based learning path recommendations',
      hypothesis: 'AI-generated learning paths will increase completion rates by 20%',
      status: 'running',
      participants: 2847,
      duration: 14,
      results: {
        improvement: 16.3,
        significance: 0.02,
        winner: 'AI-generated paths'
      }
    }
  ];

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'OpenAI': return 'bg-green-500';
      case 'Anthropic': return 'bg-purple-500';
      case 'Gemini': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-purple-500" />
            AI Excellence Center
            <Rocket className="text-blue-500" />
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Advanced AI optimization and continuous improvement platform
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="models" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Models
            </TabsTrigger>
            <TabsTrigger value="optimizations" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Optimizations
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="experiments" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Experiments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeModels.map((model) => (
                <Card key={model.id} className={`${model.isActive ? 'ring-2 ring-green-200' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <Badge className={`${getProviderColor(model.provider)} text-white mt-1`}>
                          {model.provider}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={model.isActive ? "default" : "secondary"}>
                          {model.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {model.capability}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Accuracy</div>
                        <div className="flex items-center gap-2">
                          <Progress value={model.accuracy} className="flex-1" />
                          <span className="text-sm font-medium">{model.accuracy}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Speed</div>
                        <div className="flex items-center gap-2">
                          <Progress value={model.speed} className="flex-1" />
                          <span className="text-sm font-medium">{model.speed}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-500">Usage:</span>
                      <span className="font-semibold ml-1">{model.usageCount.toLocaleString()} requests</span>
                    </div>

                    <Button 
                      onClick={() => toggleModel(model.id)}
                      variant={model.isActive ? "outline" : "default"}
                      size="sm"
                      className="w-full"
                    >
                      {model.isActive ? 'Deactivate' : 'Activate'} Model
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Global AI Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Button onClick={() => startOptimization('model_ensemble')} variant="outline">
                    <Zap className="w-4 h-4 mr-2" />
                    Optimize Ensemble
                  </Button>
                  <Button onClick={() => startOptimization('performance_tuning')} variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Performance Tuning
                  </Button>
                  <Button onClick={() => startOptimization('cost_optimization')} variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Cost Optimization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimizations" className="space-y-4">
            {optimizations.map((opt) => (
              <Card key={opt.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{opt.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {opt.description}
                      </p>
                    </div>
                    <Badge variant={opt.status === 'completed' ? 'default' : opt.status === 'running' ? 'secondary' : 'outline'}>
                      {opt.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="text-2xl font-bold text-gray-600">{opt.metrics.before}</div>
                      <div className="text-xs text-gray-500">Before</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                      <div className="text-2xl font-bold text-green-600">{opt.metrics.after}</div>
                      <div className="text-xs text-gray-500">After</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="text-2xl font-bold text-blue-600">+{opt.improvement}%</div>
                      <div className="text-xs text-gray-500">Improvement</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">{opt.timestamp}</div>
                    <div className="text-sm font-medium text-green-600">{opt.metrics.improvement}</div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle>Start New Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button onClick={() => startOptimization('question_generation')} variant="outline">
                    Start Question Optimization
                  </Button>
                  <Button onClick={() => startOptimization('hint_optimization')} variant="outline">
                    Start Hint Optimization
                  </Button>
                  <Button onClick={() => startOptimization('learning_path')} variant="outline">
                    Start Learning Path Optimization
                  </Button>
                  <Button onClick={() => startOptimization('assessment_calibration')} variant="outline">
                    Start Assessment Calibration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {insight.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-bold">{insight.confidence}%</div>
                        <div className="text-xs text-gray-500">Confidence</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {insight.actionable && (
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {insight.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="experiments" className="space-y-4">
            {experiments.map((experiment) => (
              <Card key={experiment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{experiment.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {experiment.description}
                      </p>
                    </div>
                    <Badge variant={experiment.status === 'completed' ? 'default' : 'secondary'}>
                      {experiment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="font-medium text-sm mb-1">Hypothesis:</div>
                    <div className="text-sm">{experiment.hypothesis}</div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Participants:</span>
                      <div className="font-bold text-lg">{experiment.participants.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Duration:</span>
                      <div className="font-bold text-lg">{experiment.duration} days</div>
                    </div>
                    {experiment.results && (
                      <div>
                        <span className="text-sm text-gray-500">Improvement:</span>
                        <div className="font-bold text-lg text-green-600">+{experiment.results.improvement}%</div>
                      </div>
                    )}
                  </div>

                  {experiment.results && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                      <div className="font-medium text-sm text-green-700">
                        Winner: {experiment.results.winner} 
                        (p-value: {experiment.results.significance})
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* New Experiment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Create New Experiment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="exp-name">Experiment Name</Label>
                  <Input
                    id="exp-name"
                    value={newExperiment.name}
                    onChange={(e) => setNewExperiment(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Adaptive Difficulty A/B Test"
                  />
                </div>
                <div>
                  <Label htmlFor="exp-description">Description</Label>
                  <Textarea
                    id="exp-description"
                    value={newExperiment.description}
                    onChange={(e) => setNewExperiment(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this experiment will test..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="exp-hypothesis">Hypothesis</Label>
                  <Textarea
                    id="exp-hypothesis"
                    value={newExperiment.hypothesis}
                    onChange={(e) => setNewExperiment(prev => ({ ...prev, hypothesis: e.target.value }))}
                    placeholder="State your hypothesis and expected outcome..."
                    rows={2}
                  />
                </div>
                <Button 
                  onClick={createExperiment}
                  disabled={!newExperiment.name || !newExperiment.hypothesis}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Experiment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}