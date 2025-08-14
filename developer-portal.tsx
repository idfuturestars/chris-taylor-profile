import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Copy, Key, Code, BookOpen, Zap, Shield, 
  Activity, AlertCircle, CheckCircle, Loader2 
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DeveloperPortal() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [usage, setUsage] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  useEffect(() => {
    loadApiKeys();
    loadUsageStats();
  }, []);

  const loadApiKeys = async () => {
    try {
      const response = await apiRequest("GET", "/api/developer/keys");
      setApiKeys(response.keys || []);
    } catch (error) {
      console.error("Failed to load API keys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsageStats = async () => {
    try {
      const response = await apiRequest("GET", "/api/developer/usage");
      setUsage(response);
    } catch (error) {
      console.error("Failed to load usage stats:", error);
    }
  };

  const generateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your API key",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/developer/keys", {
        name: newKeyName
      });
      
      setApiKeys([...apiKeys, response.key]);
      setNewKeyName("");
      
      toast({
        title: "API Key Generated",
        description: "Your new API key has been created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard"
    });
  };

  const revokeKey = async (keyId: string) => {
    try {
      await apiRequest("DELETE", `/api/developer/keys/${keyId}`);
      setApiKeys(apiKeys.filter(k => k.id !== keyId));
      toast({
        title: "Key Revoked",
        description: "API key has been revoked"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive"
      });
    }
  };

  const sampleCode = {
    javascript: `// EIQ API - JavaScript Example
const API_KEY = 'your-api-key-here';
const BASE_URL = 'https://api.eiqscore.io/v1';

// Start an assessment
async function startAssessment() {
  const response = await fetch(\`\${BASE_URL}/eiq/assess\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    },
    body: JSON.stringify({
      assessmentType: 'standard',
      domains: ['verbal_reasoning', 'quantitative_reasoning'],
      questionCount: 20,
      adaptiveDifficulty: true
    })
  });
  
  const data = await response.json();
  console.log('Assessment started:', data.sessionId);
  return data;
}

// Submit an answer
async function submitAnswer(sessionId, questionId, answer) {
  const response = await fetch(\`\${BASE_URL}/eiq/assess/\${sessionId}/answer\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    },
    body: JSON.stringify({
      questionId,
      answer,
      timeSpent: 45000 // milliseconds
    })
  });
  
  return response.json();
}`,
    python: `# EIQ API - Python Example
import requests
import json

API_KEY = 'your-api-key-here'
BASE_URL = 'https://api.eiqscore.io/v1'

# Start an assessment
def start_assessment():
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
    }
    
    payload = {
        'assessmentType': 'standard',
        'domains': ['verbal_reasoning', 'quantitative_reasoning'],
        'questionCount': 20,
        'adaptiveDifficulty': True
    }
    
    response = requests.post(
        f'{BASE_URL}/eiq/assess',
        headers=headers,
        json=payload
    )
    
    data = response.json()
    print(f"Assessment started: {data['sessionId']}")
    return data

# Submit an answer
def submit_answer(session_id, question_id, answer):
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
    }
    
    payload = {
        'questionId': question_id,
        'answer': answer,
        'timeSpent': 45000  # milliseconds
    }
    
    response = requests.post(
        f'{BASE_URL}/eiq/assess/{session_id}/answer',
        headers=headers,
        json=payload
    )
    
    return response.json()`,
    curl: `# EIQ API - cURL Examples

# Start an assessment
curl -X POST https://api.eiqscore.io/v1/eiq/assess \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key-here" \\
  -d '{
    "assessmentType": "standard",
    "domains": ["verbal_reasoning", "quantitative_reasoning"],
    "questionCount": 20,
    "adaptiveDifficulty": true
  }'

# Get assessment status
curl -X GET https://api.eiqscore.io/v1/eiq/assess/{sessionId} \\
  -H "X-API-Key: your-api-key-here"

# Submit an answer
curl -X POST https://api.eiqscore.io/v1/eiq/assess/{sessionId}/answer \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key-here" \\
  -d '{
    "questionId": "q123",
    "answer": "B",
    "timeSpent": 45000
  }'

# Get assessment report
curl -X GET https://api.eiqscore.io/v1/eiq/assess/{sessionId}/report \\
  -H "X-API-Key: your-api-key-here"`
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Developer Portal</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Integrate EIQ assessments into your applications
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <Zap className="w-4 h-4 mr-1" />
            API v1.0
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">API Calls Today</p>
                  <p className="text-2xl font-bold">{usage.callsToday || 0}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Keys</p>
                  <p className="text-2xl font-bold">{apiKeys.filter(k => k.isActive).length}</p>
                </div>
                <Key className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rate Limit</p>
                  <p className="text-2xl font-bold">1000/hr</p>
                </div>
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                  <p className="text-2xl font-bold">99.9%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="keys" className="space-y-4">
          <TabsList>
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
            <TabsTrigger value="examples">Code Examples</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="keys" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Key Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter key name (e.g., Production API)"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                  <Button onClick={generateApiKey} disabled={isGenerating}>
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Generate Key
                      </>
                    )}
                  </Button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : apiKeys.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No API keys yet. Generate your first key to get started.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{key.name}</span>
                              {key.isActive ? (
                                <Badge variant="default" className="text-xs">Active</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">Revoked</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {key.key.substring(0, 20)}...
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(key.key)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Created: {new Date(key.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {key.isActive && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => revokeKey(key.id)}
                            >
                              Revoke
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Base URL</h3>
                  <code className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                    https://api.eiqscore.io/v1
                  </code>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Authentication</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    All API requests must include your API key in the header:
                  </p>
                  <code className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded block">
                    X-API-Key: your-api-key-here
                  </code>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Endpoints</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="font-mono text-sm">POST /eiq/assess</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Start a new assessment session
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-mono text-sm">GET /eiq/assess/:id</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get assessment status and current question
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="font-mono text-sm">POST /eiq/assess/:id/answer</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Submit an answer to a question
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-mono text-sm">GET /eiq/assess/:id/next</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get the next question in the assessment
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-mono text-sm">GET /eiq/assess/:id/report</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get detailed assessment report (completed assessments only)
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Rate Limits</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Default rate limit: 1000 requests per hour per API key
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="javascript">
                  <TabsList>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="javascript" className="mt-4">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{sampleCode.javascript}</code>
                    </pre>
                  </TabsContent>
                  
                  <TabsContent value="python" className="mt-4">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{sampleCode.python}</code>
                    </pre>
                  </TabsContent>
                  
                  <TabsContent value="curl" className="mt-4">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{sampleCode.curl}</code>
                    </pre>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Webhooks allow you to receive real-time notifications when assessments are completed.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input placeholder="https://your-app.com/webhooks/eiq" />
                </div>
                
                <div className="space-y-2">
                  <Label>Events</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Assessment Started</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Assessment Completed</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">Assessment Abandoned</span>
                    </label>
                  </div>
                </div>
                
                <Button>Save Webhook Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}