import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Globe, Zap, Users, Brain, Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function PublicAPIPage() {
  const [apiResponse, setApiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTryAPI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/eiq/public-assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentType: "quick_demo",
          userId: "demo_user_" + Date.now()
        })
      });
      
      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
      
      toast({
        title: "API Demo Successful",
        description: "Check the response below!"
      });
    } catch (error) {
      toast({
        title: "API Demo Error",
        description: "Failed to connect to EIQ API",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const codeExamples = {
    javascript: `// EIQ Public API - JavaScript SDK
import { EIQAssessment } from '@eiq/sdk';

const eiq = new EIQAssessment({
  apiKey: 'your_api_key_here'
});

// Quick Assessment (Sam Altman's Vision)
const result = await eiq.assess({
  userId: 'user123',
  type: 'baseline',
  duration: '45min'
});

console.log('EIQ Score:', result.eiqScore);
console.log('Cognitive Profile:', result.cognitiveProfile);`,

    python: `# EIQ Public API - Python SDK
from eiq_sdk import EIQAssessment

eiq = EIQAssessment(api_key='your_api_key_here')

# Comprehensive Assessment (Hinton's Neural Approach)
result = eiq.assess(
    user_id='user123',
    assessment_type='comprehensive',
    include_neural_mapping=True
)

print(f"EIQ Score: {result.eiq_score}")
print(f"Learning Style: {result.learning_style}")`,

    curl: `# EIQ Public API - Direct HTTP
curl -X POST "https://api.eiq.ai/v1/assess" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "userId": "user123",
    "assessmentType": "viral_challenge",
    "duration": "15sec",
    "socialShare": true
  }'`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Hero Section - Jobs' Elegant Design */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EIQ Public API
            </h1>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Democratize intelligence assessment globally. One API call to measure cognitive capability, 
            powered by advanced AI and used by millions worldwide.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              Open Source
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Sub-100ms Response
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              10M+ Assessments
            </Badge>
          </div>
        </div>

        {/* Titan Strategies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Altman: Democratization */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Altman: Open Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Universal intelligence assessment API. Free tier for developers, enterprise scaling.
              </p>
              <Badge variant="outline">1,000 free assessments/month</Badge>
            </CardContent>
          </Card>

          {/* Musk: Viral Mechanics */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-red-500" />
                Musk: Viral Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                15-second EIQ challenges, real-time leaderboards, gamified cognitive testing.
              </p>
              <Badge variant="outline">Global Rankings</Badge>
            </CardContent>
          </Card>

          {/* Hinton: AI Excellence */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-green-500" />
                Hinton: Neural AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Advanced neural pattern recognition, multi-modal assessment, meta-learning.
              </p>
              <Badge variant="outline">Transformer Models</Badge>
            </CardContent>
          </Card>

          {/* Zuckerberg: Social */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Zuckerberg: Social
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Cognitive compatibility matching, collaborative intelligence, network effects.
              </p>
              <Badge variant="outline">Social Graph</Badge>
            </CardContent>
          </Card>

          {/* Jobs: Design */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Jobs: Simplicity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                One-tap assessment, beautiful visualizations, cultural transformation.
              </p>
              <Badge variant="outline">"What's Your EIQ?"</Badge>
            </CardContent>
          </Card>

          {/* Unified Vision */}
          <Card className="border-l-4 border-l-gradient-to-b from-blue-500 to-green-500 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Unified Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">
                All strategies integrated into one powerful, accessible, revolutionary platform.
              </p>
              <Badge>Global Standard</Badge>
            </CardContent>
          </Card>
        </div>

        {/* API Documentation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Developer Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="javascript" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="curl">cURL</TabsTrigger>
              </TabsList>
              
              {Object.entries(codeExamples).map(([lang, code]) => (
                <TabsContent key={lang} value={lang}>
                  <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4">
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      <code>{code}</code>
                    </pre>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Live API Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Try the API Live</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={handleTryAPI} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Processing..." : "Run Demo Assessment"}
              </Button>
              
              {apiResponse && (
                <div>
                  <label className="block text-sm font-medium mb-2">API Response:</label>
                  <Textarea
                    value={apiResponse}
                    readOnly
                    className="font-mono text-sm h-64"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg text-white">
          <h2 className="text-3xl font-bold mb-4">Join the EIQ Revolution</h2>
          <p className="text-lg mb-6">
            Make intelligence assessment as common as checking the weather. 
            Start building with the EIQ API today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="secondary" size="lg">
              Get API Key
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}