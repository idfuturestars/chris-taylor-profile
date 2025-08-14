import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Network, 
  Brain, 
  Target, 
  TrendingUp, 
  Eye, 
  Lightbulb, 
  Star,
  BookOpen,
  Users,
  Award
} from "lucide-react";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface KnowledgeNode {
  id: string;
  label: string;
  type: string;
  strength: number;
  position: { x: number; y: number };
  color: string;
}

interface KnowledgeConnection {
  source: string;
  target: string;
  strength: number;
  type: string;
}

interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  connections: KnowledgeConnection[];
  insights: {
    strongestConnections: string[];
    gapAreas: string[];
    recommendedFocus: string[];
    learningPathway: string;
  };
}

interface AIInsights {
  overallStrength: number;
  keyStrengths: string[];
  improvementAreas: string[];
  learningRecommendations: string[];
  nextSteps: string[];
  confidenceLevel: number;
}

export function KnowledgeVisualizationTool() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedView, setSelectedView] = useState<'network' | 'radar' | 'scatter'>('network');
  const { toast } = useToast();

  // Fetch existing knowledge graph data
  const { data: knowledgeData, isLoading: isLoadingData } = useQuery({
    queryKey: ['/api/knowledge-visualizations'],
    enabled: true,
  });

  // Generate new knowledge graph
  const generateGraphMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/knowledge-graph/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate knowledge graph');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/knowledge-visualizations'] });
      toast({
        title: "Knowledge Graph Generated",
        description: "Your learning insights have been updated!",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Unable to generate knowledge graph. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Fetch AI insights
  const { data: insightsData, isLoading: isLoadingInsights } = useQuery({
    queryKey: ['/api/knowledge-insights'],
    enabled: !!knowledgeData,
  });

  const handleGenerateGraph = async () => {
    setIsGenerating(true);
    try {
      await generateGraphMutation.mutateAsync();
    } finally {
      setIsGenerating(false);
    }
  };

  // Sample data for visualization (would come from API in real implementation)
  const sampleNodes = [
    { id: 'math', label: 'Mathematics', type: 'domain', strength: 85, position: { x: 100, y: 100 }, color: '#4F46E5' },
    { id: 'logic', label: 'Logic', type: 'skill', strength: 78, position: { x: 200, y: 150 }, color: '#10B981' },
    { id: 'ai', label: 'AI Concepts', type: 'domain', strength: 72, position: { x: 150, y: 200 }, color: '#F59E0B' },
    { id: 'reasoning', label: 'Reasoning', type: 'skill', strength: 88, position: { x: 300, y: 120 }, color: '#EF4444' },
  ];

  const radarData = [
    { subject: 'Mathematics', A: 85, fullMark: 100 },
    { subject: 'Logic', A: 78, fullMark: 100 },
    { subject: 'AI Concepts', A: 72, fullMark: 100 },
    { subject: 'Reasoning', A: 88, fullMark: 100 },
    { subject: 'Problem Solving', A: 82, fullMark: 100 },
    { subject: 'Critical Thinking', A: 79, fullMark: 100 },
  ];

  const scatterData = sampleNodes.map(node => ({
    x: Math.random() * 100,
    y: node.strength,
    name: node.label,
    strength: node.strength,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            One-Click Knowledge Visualization
          </h1>
          <p className="text-muted-foreground">
            AI-powered insights into your learning patterns and knowledge connections
          </p>
        </div>
        
        <Button 
          onClick={handleGenerateGraph}
          disabled={isGenerating || generateGraphMutation.isPending}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isGenerating ? (
            <>
              <Brain className="w-4 h-4 mr-2 animate-pulse" />
              Generating...
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Generate Insights
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center">
              <Network className="w-5 h-5 mr-2 text-purple-400" />
              Knowledge Nodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">247</div>
            <p className="text-sm text-muted-foreground">Concepts mapped</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">156</div>
            <p className="text-sm text-muted-foreground">Learning pathways</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/50 to-amber-900/50 border-orange-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center">
              <Star className="w-5 h-5 mr-2 text-orange-400" />
              Mastery Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">82%</div>
            <p className="text-sm text-muted-foreground">Overall strength</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="network" value={selectedView} onValueChange={(value) => setSelectedView(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="network">Network View</TabsTrigger>
          <TabsTrigger value="radar">Skill Radar</TabsTrigger>
          <TabsTrigger value="scatter">Strength Map</TabsTrigger>
        </TabsList>

        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Network className="w-5 h-5 mr-2 text-blue-400" />
                Interactive Knowledge Network
              </CardTitle>
              <CardDescription>
                Visual representation of your learning connections and knowledge domains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-900 rounded-lg p-6 relative overflow-hidden">
                <svg width="100%" height="100%" className="absolute inset-0">
                  {/* Draw connections */}
                  {sampleNodes.map((source, i) => 
                    sampleNodes.slice(i + 1).map((target, j) => (
                      <line
                        key={`${source.id}-${target.id}`}
                        x1={`${(source.position.x / 400) * 100}%`}
                        y1={`${(source.position.y / 300) * 100}%`}
                        x2={`${(target.position.x / 400) * 100}%`}
                        y2={`${(target.position.y / 300) * 100}%`}
                        stroke="#374151"
                        strokeWidth="2"
                        opacity="0.6"
                      />
                    ))
                  )}
                  
                  {/* Draw nodes */}
                  {sampleNodes.map((node) => (
                    <g key={node.id}>
                      <circle
                        cx={`${(node.position.x / 400) * 100}%`}
                        cy={`${(node.position.y / 300) * 100}%`}
                        r={Math.max(10, node.strength / 5)}
                        fill={node.color}
                        opacity="0.8"
                        className="hover:opacity-100 cursor-pointer transition-opacity"
                      />
                      <text
                        x={`${(node.position.x / 400) * 100}%`}
                        y={`${((node.position.y + 30) / 300) * 100}%`}
                        textAnchor="middle"
                        fill="white"
                        fontSize="12"
                        className="pointer-events-none"
                      >
                        {node.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Target className="w-5 h-5 mr-2 text-green-400" />
                Skill Proficiency Radar
              </CardTitle>
              <CardDescription>
                360-degree view of your competencies across different domains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#E5E7EB', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                    <Radar
                      name="Proficiency"
                      dataKey="A"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scatter" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                Learning Strength Distribution
              </CardTitle>
              <CardDescription>
                Explore the relationship between different knowledge areas and proficiency levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={scatterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="x" 
                      name="Knowledge Breadth"
                      tick={{ fill: '#E5E7EB' }}
                    />
                    <YAxis 
                      dataKey="y" 
                      name="Proficiency"
                      tick={{ fill: '#E5E7EB' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label) => `Knowledge Area`}
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#E5E7EB'
                      }}
                    />
                    <Scatter 
                      dataKey="y" 
                      fill="#8B5CF6"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Insights Panel */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            AI-Powered Learning Insights
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on your knowledge graph analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <Award className="w-4 h-4 mr-2 text-green-400" />
                Key Strengths
              </h4>
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-green-900/30 text-green-300 border-green-500/30">
                  Mathematical Reasoning (88%)
                </Badge>
                <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 border-blue-500/30">
                  Logical Analysis (85%)
                </Badge>
                <Badge variant="secondary" className="bg-purple-900/30 text-purple-300 border-purple-500/30">
                  Problem Solving (82%)
                </Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2 text-orange-400" />
                Growth Areas
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">AI Concepts</span>
                  <span className="text-xs text-orange-400">72%</span>
                </div>
                <Progress value={72} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Data Analysis</span>
                  <span className="text-xs text-orange-400">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-blue-400" />
              Recommended Learning Path
            </h4>
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-300">
                1. Strengthen foundational AI concepts through interactive modules
              </p>
              <p className="text-sm text-gray-300">
                2. Practice data analysis with real-world case studies
              </p>
              <p className="text-sm text-gray-300">
                3. Apply mathematical reasoning to AI problem-solving scenarios
              </p>
              <p className="text-sm text-gray-300">
                4. Engage in collaborative projects to reinforce learning connections
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}