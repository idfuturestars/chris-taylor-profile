import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Brain, 
  Share,
  Download,
  RefreshCw,
  Star,
  FileText,
  Link,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssessmentResultsProps {
  score: number;
  results: {
    totalQuestions: number;
    correctAnswers: number;
    percentCorrect: number;
    eiqScore: number;
    timeUsed: number;
    domains: Array<{
      name: string;
      score: number;
      level: string;
    }>;
  };
  type: 'baseline' | 'comprehensive';
  onRetakeAssessment: () => void;
  onBackToDashboard: () => void;
}

export default function AssessmentResults({ 
  score, 
  results, 
  type, 
  onRetakeAssessment, 
  onBackToDashboard 
}: AssessmentResultsProps) {
  
  const getScoreLevel = (score: number) => {
    if (score >= 700) return { level: "Exceptional", color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-950" };
    if (score >= 600) return { level: "Above Average", color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950" };
    if (score >= 500) return { level: "Average", color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950" };
    if (score >= 400) return { level: "Below Average", color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-950" };
    return { level: "Developing", color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-950" };
  };

  const scoreInfo = getScoreLevel(score);
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getRecommendations = () => {
    const weakDomains = results.domains.filter(d => d.score < 70);
    const strongDomains = results.domains.filter(d => d.score >= 80);
    
    return {
      improve: weakDomains.length > 0 ? weakDomains.map(d => d.name) : [],
      strengths: strongDomains.length > 0 ? strongDomains.map(d => d.name) : []
    };
  };

  const recommendations = getRecommendations();
  const { toast } = useToast();

  const generateReportData = () => {
    const reportDate = new Date().toLocaleDateString();
    return {
      title: `EiQ™ ${type === 'baseline' ? 'Baseline' : 'Comprehensive'} Assessment Report`,
      date: reportDate,
      score: results.eiqScore,
      level: scoreInfo.level,
      timeUsed: formatTime(results.timeUsed),
      accuracy: results.percentCorrect,
      domains: results.domains,
      recommendations: recommendations,
      totalQuestions: results.totalQuestions,
      correctAnswers: results.correctAnswers
    };
  };

  const downloadPDFReport = () => {
    const reportData = generateReportData();
    
    // Create a detailed HTML report
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${reportData.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
          .score-box { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
          .score-number { font-size: 48px; font-weight: bold; color: #3b82f6; }
          .domain-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
          .domain-item { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; }
          .section { margin: 30px 0; }
          .section h3 { color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
          ul { padding-left: 20px; }
          .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">EiQ™ Assessment Report</div>
          <p style="color: #6b7280;">Powered by SikatLabs™</p>
          <p>Generated on ${reportData.date}</p>
        </div>
        
        <div class="score-box">
          <div class="score-number">${reportData.score}</div>
          <h2 style="margin: 10px 0; color: #374151;">${reportData.level}</h2>
          <p>Emotional Intelligence Quotient (EiQ™)</p>
        </div>
        
        <div class="section">
          <h3>Assessment Overview</h3>
          <ul>
            <li><strong>Assessment Type:</strong> ${type === 'baseline' ? 'Baseline Assessment (45 minutes)' : 'Comprehensive Assessment (3h 45m)'}</li>
            <li><strong>Time Used:</strong> ${reportData.timeUsed}</li>
            <li><strong>Questions:</strong> ${reportData.correctAnswers}/${reportData.totalQuestions} correct (${reportData.accuracy}%)</li>
            <li><strong>Overall Accuracy:</strong> ${reportData.accuracy}%</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>Domain Breakdown</h3>
          <div class="domain-grid">
            ${reportData.domains.map(domain => `
              <div class="domain-item">
                <h4 style="margin: 0 0 10px 0; color: #374151;">${domain.name}</h4>
                <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${domain.score}%</div>
                <div style="color: #6b7280;">${domain.level}</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        ${reportData.recommendations.strengths.length > 0 ? `
        <div class="section">
          <h3>Your Strengths</h3>
          <ul>
            ${reportData.recommendations.strengths.map(strength => `<li>${strength}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        ${reportData.recommendations.improve.length > 0 ? `
        <div class="section">
          <h3>Areas for Improvement</h3>
          <ul>
            ${reportData.recommendations.improve.map(area => `<li>${area}</li>`).join('')}
          </ul>
          <p><em>Consider retaking the assessment after focused practice in these areas.</em></p>
        </div>
        ` : ''}
        
        <div class="footer">
          <p>This report was generated by EiQ™ Assessment Platform</p>
          <p>© ${new Date().getFullYear()} SikatLabs™. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
    
    // Create and download the HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EiQ_Assessment_Report_${reportData.date.replace(/\//g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Your EiQ™ assessment report has been saved as an HTML file."
    });
  };

  const shareResults = async () => {
    const reportData = generateReportData();
    const shareText = `🧠 Just completed my EiQ™ Assessment!\n\nScore: ${reportData.score} (${reportData.level})\nAccuracy: ${reportData.accuracy}%\n\nTake your EiQ™ assessment at: ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My EiQ™ Assessment Results',
          text: shareText,
          url: window.location.origin
        });
      } catch (error) {
        // Fallback to copying to clipboard
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Results Copied!",
        description: "Your EiQ™ results have been copied to clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please copy manually.",
        variant: "destructive"
      });
    }
  };

  const copyReportLink = () => {
    const reportUrl = `${window.location.origin}?eiq=${results.eiqScore}&level=${encodeURIComponent(scoreInfo.level)}`;
    copyToClipboard(reportUrl);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Score Display */}
      <Card className={scoreInfo.bgColor}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg">
              <Trophy className={`w-12 h-12 ${scoreInfo.color}`} />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            Your EiQ™ Score: {score}
          </CardTitle>
          <CardDescription className="text-lg">
            <Badge variant="outline" className={`${scoreInfo.color} border-current`}>
              {scoreInfo.level}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">{results.percentCorrect.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{results.correctAnswers}/{results.totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatTime(results.timeUsed)}</div>
              <div className="text-sm text-muted-foreground">Time Used</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Domain Analysis
          </CardTitle>
          <CardDescription>
            Your performance across different cognitive areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.domains.map((domain, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{domain.name}</div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={domain.level === 'Strong' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {domain.level}
                    </Badge>
                    <span className="text-sm font-medium">{domain.score}/100</span>
                  </div>
                </div>
                <Progress value={domain.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Star className="w-5 h-5" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.strengths.length > 0 ? (
              <div className="space-y-2">
                {recommendations.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-3">
                  Continue practicing these areas to maintain your strong performance.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete more questions to identify your strongest cognitive areas.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Improvement Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Target className="w-5 h-5" />
              Areas for Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.improve.length > 0 ? (
              <div className="space-y-2">
                {recommendations.improve.map((area, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">{area}</span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-3">
                  Focus on these areas in your next practice sessions for maximum improvement.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Great job! All your domain scores are strong. Consider taking the comprehensive assessment for deeper insights.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Score Interpretation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Understanding Your EiQ™ Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Score Range Meanings:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>700-800:</span>
                  <span className="text-purple-600 font-medium">Exceptional</span>
                </div>
                <div className="flex justify-between">
                  <span>600-699:</span>
                  <span className="text-blue-600 font-medium">Above Average</span>
                </div>
                <div className="flex justify-between">
                  <span>500-599:</span>
                  <span className="text-green-600 font-medium">Average</span>
                </div>
                <div className="flex justify-between">
                  <span>400-499:</span>
                  <span className="text-yellow-600 font-medium">Below Average</span>
                </div>
                <div className="flex justify-between">
                  <span>200-399:</span>
                  <span className="text-red-600 font-medium">Developing</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Next Steps:</h4>
              <div className="space-y-2 text-sm">
                <p>• Practice daily for 15-30 minutes</p>
                <p>• Focus on weaker cognitive domains</p>
                <p>• Retake assessment in 4 weeks</p>
                <p>• Use AI assistance for learning</p>
                <p>• Track your improvement over time</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onBackToDashboard} variant="outline" className="flex-1">
          Back to Dashboard
        </Button>
        <Button onClick={onRetakeAssessment} variant="outline" className="flex-1">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retake Assessment
        </Button>
        <Button onClick={shareResults} className="flex-1">
          <Share className="w-4 h-4 mr-2" />
          Share Results
        </Button>
        <Button onClick={downloadPDFReport} variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>
      
      {/* Additional Share Options */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Share Your Achievement
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Let others know about your EiQ™ score and inspire them to take the assessment!
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={copyReportLink} variant="outline" size="sm" className="text-xs">
                <Link className="w-3 h-3 mr-1" />
                Copy Link
              </Button>
              <Button onClick={() => copyToClipboard(`Check out my EiQ™ score: ${results.eiqScore} (${scoreInfo.level}) on ${window.location.origin}`)} variant="outline" size="sm" className="text-xs">
                <Copy className="w-3 h-3 mr-1" />
                Copy Text
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}