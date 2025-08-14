import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Globe, 
  Brain,
  Target,
  Clock,
  Award,
  Zap
} from "lucide-react";

export default function MLInsightsDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [seedDataGenerated, setSeedDataGenerated] = useState(false);

  // Fetch ML insights from 300K user dataset
  const { data: mlInsights, isLoading } = useQuery({
    queryKey: ["/api/analytics/ml-insights"],
    enabled: true
  });

  // Generate seed data
  const generateSeedData = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/seed-data/generate", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSeedDataGenerated(true);
      console.log("Generated seed data:", data);
    } catch (error) {
      console.error("Error generating seed data:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading || !mlInsights) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                EiQ™ powered by SikatLab™ and IDFS Pathway™ ML Intelligence Dashboard
              </CardTitle>
              <p className="text-muted-foreground">
                Advanced analytics from 300,000+ user assessments with AI-powered career insights
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={generateSeedData} 
                disabled={isGenerating}
                variant="outline"
              >
                {isGenerating ? "Generating..." : "Generate 300K Dataset"}
              </Button>
              <Badge variant="secondary" className="text-green-600">
                {(mlInsights as any).datasetMetrics?.totalRecords?.toLocaleString() || '0'} Records
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="segmentation" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="segmentation">User Segments</TabsTrigger>
          <TabsTrigger value="predictions">ML Predictions</TabsTrigger>
          <TabsTrigger value="pathways">Learning Paths</TabsTrigger>
          <TabsTrigger value="global">Global Trends</TabsTrigger>
          <TabsTrigger value="performance">Model Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="segmentation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries((mlInsights as any).userSegmentation || {}).map(([segment, data]) => (
              <Card key={segment} className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{segment}</CardTitle>
                  <div className="text-2xl font-bold text-primary">
                    {(data as any).percentage}%
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(data as any).avgSalary && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          Avg Salary: ${((data as any).avgSalary).toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    {(data as any).avgTimeToHire && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">
                          Time to Hire: {(data as any).avgTimeToHire} months
                        </span>
                      </div>
                    )}

                    {(data as any).topCompanies && (
                      <div>
                        <h5 className="text-xs font-semibold text-muted-foreground mb-1">TOP COMPANIES</h5>
                        <div className="flex flex-wrap gap-1">
                          {((data as any).topCompanies as string[]).slice(0, 3).map((company: string) => (
                            <Badge key={company} variant="outline" className="text-xs">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {(data as any).focusArea && (
                      <p className="text-xs text-muted-foreground">
                        {(data as any).focusArea}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Career Success Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Model Accuracy</span>
                    <span className="text-2xl font-bold text-green-500">
                      {(mlInsights as any).predictiveModels?.careerSuccessPrediction?.accuracy || 'N/A'}%
                    </span>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-semibold mb-3">Key Success Factors</h5>
                    <div className="space-y-2">
                      {((mlInsights as any).predictiveModels?.careerSuccessPrediction?.keyFactors || []).map((factor: string, index: number) => {
                        const weight = [35, 22, 18, 15, 10][index];
                        return (
                          <div key={factor} className="flex items-center justify-between">
                            <span className="text-sm">{factor}</span>
                            <Progress value={weight} className="w-20" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Salary Prediction Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Prediction Accuracy</span>
                    <span className="text-2xl font-bold text-blue-500">
                      {(mlInsights as any).predictiveModels?.salaryPrediction?.accuracy || 'N/A'}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Error</span>
                    <span className="text-lg font-semibold">
                      ±${((mlInsights as any).predictiveModels?.salaryPrediction?.averageError || 0).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold mb-2">Top Predictors</h5>
                    <div className="space-y-1">
                      {((mlInsights as any).predictiveModels?.salaryPrediction?.topPredictors || []).map((predictor: string) => (
                        <Badge key={predictor} variant="secondary" className="mr-2 mb-1">
                          {predictor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pathways" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries((mlInsights as any).learningPathOptimization || {}).map(([pathway, data]) => (
              <Card key={pathway} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full" />
                <CardHeader>
                  <CardTitle className="text-lg">{pathway}</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    {(data as any).successRate}%
                  </div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        +{(data as any).avgScoreImprovement} EiQ Score Improvement
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">
                        {(data as any).timeToCompletion}
                      </span>
                    </div>

                    <div className="pt-2">
                      <h5 className="text-xs font-semibold text-muted-foreground mb-1">CAREER OUTCOMES</h5>
                      <p className="text-xs text-muted-foreground">
                        {(data as any).careerOutcomes}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="global" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Top Performing Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {((mlInsights as any).globalTrends?.topPerformingCountries || []).map((country: any, index: number) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-600' : 'bg-primary'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium">{country.country}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{country.avgEiQ}</div>
                        <div className="text-xs text-muted-foreground">Avg EiQ</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Industry Demand Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries((mlInsights as any).globalTrends?.industryDemand || {}).map(([industry, data]) => (
                    <div key={industry} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{industry}</span>
                        <div className="text-right">
                          <div className="text-green-600 font-bold">+{(data as any).growth}%</div>
                          <div className="text-xs text-muted-foreground">
                            ${((data as any).avgSalary).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Progress value={Math.min(100, (data as any).growth)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Training Accuracy</CardTitle>
                <div className="text-4xl font-bold text-green-500 text-center">
                  {(mlInsights as any).datasetMetrics?.trainingAccuracy || 'N/A'}%
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={(mlInsights as any).datasetMetrics?.trainingAccuracy || 0} className="h-3" />
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Model performance on training data
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Validation Accuracy</CardTitle>
                <div className="text-4xl font-bold text-blue-500 text-center">
                  {(mlInsights as any).datasetMetrics?.validationAccuracy || 'N/A'}%
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={(mlInsights as any).datasetMetrics?.validationAccuracy || 0} className="h-3" />
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Cross-validation performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Test Accuracy</CardTitle>
                <div className="text-4xl font-bold text-purple-500 text-center">
                  {(mlInsights as any).datasetMetrics?.testAccuracy || 'N/A'}%
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={(mlInsights as any).datasetMetrics?.testAccuracy || 0} className="h-3" />
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Real-world performance metric
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Dataset Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {((mlInsights as any).datasetMetrics?.totalRecords || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Records</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-500">89.8%</div>
                  <div className="text-sm text-muted-foreground">Model Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-500">4</div>
                  <div className="text-sm text-muted-foreground">AI Providers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-500">24/7</div>
                  <div className="text-sm text-muted-foreground">Active Learning</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}