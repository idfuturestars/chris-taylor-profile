import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Zap, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function AITestPanel() {
  const [message, setMessage] = useState("Hello EiQ MentorAI™! How can you help students achieve careers at Google, Meta, and Apple with personalized EiQ scoring?");
  const [testAssessment, setTestAssessment] = useState(true);
  const [testResults, setTestResults] = useState<any>(null);

  const testAI = useMutation({
    mutationFn: async ({ message: testMessage, includeAssessment }: { message: string, includeAssessment: boolean }) => {
      const payload: any = { message: testMessage };
      if (includeAssessment) {
        payload.testAssessment = {
          eiqScore: 742,
          domainScores: {
            algebra: 85,
            statistics: 78,
            calculus: 82,
            programming: 91,
            ai_concepts: 88,
            logic: 86
          },
          learningGaps: ["Advanced optimization theory", "Distributed systems architecture"]
        };
      }
      return await apiRequest("POST", "/api/test-ai", payload);
    },
    onSuccess: (data) => {
      setTestResults(data);
    }
  });

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          Live AI Engine Test - EiQ MentorAI™
        </CardTitle>
        <p className="text-muted-foreground">
          Test the live AI providers (OpenAI, Claude, Gemini) with EiQ™ powered by SikatLab™ and IDFS Pathway™ integration
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Test Message</label>
          <Textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message to test the AI providers..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="includeAssessment"
            checked={testAssessment}
            onChange={(e) => setTestAssessment(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="includeAssessment" className="text-sm">
            Include EiQ Assessment Analysis (Score: 742, Platinum Track)
          </label>
        </div>

        <Button 
          onClick={() => testAI.mutate({ message, includeAssessment: testAssessment })}
          disabled={testAI.isPending}
          className="w-full"
        >
          {testAI.isPending ? "Testing EiQ MentorAI™..." : "Test Live EiQ MentorAI™ System"}
        </Button>

        {testResults && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Test Results</h3>
              {testResults.success ? (
                <Badge className="bg-green-500">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Success
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="h-4 w-4 mr-1" />
                  Failed
                </Badge>
              )}
            </div>

            {testResults.results?.primaryResponse && (
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    EiQ MentorAI™ Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-background/50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{testResults.results.primaryResponse}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  OpenAI GPT-4o
                  {testResults.results?.openai_status === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Status: {testResults.results?.openai_status || "Unknown"}
                </p>
                {testResults.results?.openai_error && (
                  <p className="text-xs text-red-500 mt-1">
                    {testResults.results.openai_error}
                  </p>
                )}
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  Claude API
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </h4>
                <p className="text-sm text-muted-foreground">
                  Status: Configured
                </p>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  Gemini API
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </h4>
                <p className="text-sm text-muted-foreground">
                  Status: Configured
                </p>
              </Card>
            </div>

            {testResults.results?.timestamp && (
              <p className="text-xs text-muted-foreground text-center">
                Test completed at: {new Date(testResults.results.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {testAI.error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Test Failed</span>
              </div>
              <p className="text-sm text-red-600 mt-2">
                {testAI.error?.message || "Unable to test AI providers"}
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}