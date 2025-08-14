/**
 * Live Analytics Dashboard
 * Real-time data visualization for user behavior and AI learning insights
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Brain, 
  Clock, 
  Target,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Eye,
  MousePointer,
  Zap
} from 'lucide-react';

interface AnalyticsDashboard {
  timeRange: string;
  summary: {
    totalUsers: number;
    totalSessions: number;
    avgEngagement: number;
    aiLearningEvents: number;
    completionRate: number;
  };
  userBehavior: {
    uniqueUsers: number;
    totalInteractions: number;
    avgEngagement: number;
    topPages: [string, number][];
    deviceBreakdown: Record<string, number>;
  };
  sessionMetrics: {
    totalSessions: number;
    avgCompletionRate: number;
    sessionTypes: Record<string, number>;
    avgDuration: number;
  };
  aiLearning: {
    totalEvents: number;
    avgConfidence: number;
    dataTypes: Record<string, number>;
    validationStatus: Record<string, number>;
  };
  realTimeMetrics: any[];
  insights: string[];
  recommendations: string[];
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('overview');

  const { data: dashboard, isLoading, refetch } = useQuery<AnalyticsDashboard>({
    queryKey: ['/api/analytics/dashboard', timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics dashboard');
      }
      
      return response.json();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to load analytics dashboard. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number) => `${(num * 100).toFixed(1)}%`;

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Live Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Real-time user behavior tracking and AI learning insights
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => refetch()} 
              variant="outline"
              size="sm"
            >
              <Activity className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatNumber(dashboard.summary.totalUsers)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Sessions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatNumber(dashboard.summary.totalSessions)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Engagement
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {dashboard.summary.avgEngagement.toFixed(1)}/10
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    AI Events
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatNumber(dashboard.summary.aiLearningEvents)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Completion
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatPercentage(dashboard.summary.completionRate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights and Recommendations */}
        {(dashboard.insights.length > 0 || dashboard.recommendations.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {dashboard.insights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dashboard.insights.map((insight, index) => (
                      <div key={index} className="flex items-start">
                        <Badge variant="secondary" className="mr-2 mt-0.5">
                          {index + 1}
                        </Badge>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {dashboard.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dashboard.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start">
                        <Badge variant="outline" className="mr-2 mt-0.5">
                          {index + 1}
                        </Badge>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {rec}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Main Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="behavior">User Behavior</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="ai-learning">AI Learning</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real-time Metrics Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dashboard.realTimeMetrics.slice(-20)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="activeUsers" 
                        stroke="#10b981" 
                        fill="#10b981"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(dashboard.userBehavior.deviceBreakdown).map(([device, count]) => ({
                          name: device,
                          value: count
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(dashboard.userBehavior.deviceBreakdown).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Visited Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboard.userBehavior.topPages.slice(0, 8).map(([page, visits], index) => (
                      <div key={page} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {index + 1}
                          </Badge>
                          <span className="text-sm font-medium">{page}</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatNumber(visits)} visits
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Engagement</span>
                        <span>{dashboard.userBehavior.avgEngagement.toFixed(1)}/10</span>
                      </div>
                      <Progress 
                        value={dashboard.userBehavior.avgEngagement * 10} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatNumber(dashboard.userBehavior.uniqueUsers)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Unique Users
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <MousePointer className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatNumber(dashboard.userBehavior.totalInteractions)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactions
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Session Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Session Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(dashboard.sessionMetrics.sessionTypes).map(([type, count]) => ({
                      type,
                      count
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Session Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Session Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Completion Rate</span>
                        <span>{formatPercentage(dashboard.sessionMetrics.avgCompletionRate)}</span>
                      </div>
                      <Progress 
                        value={dashboard.sessionMetrics.avgCompletionRate * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {Math.round(dashboard.sessionMetrics.avgDuration / 60)}m
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Avg Duration
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatNumber(dashboard.sessionMetrics.totalSessions)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Total Sessions
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-learning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Data Types */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Learning Data Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(dashboard.aiLearning.dataTypes).map(([type, count]) => ({
                          name: type.replace('_', ' '),
                          value: count
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(dashboard.aiLearning.dataTypes).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* AI Learning Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Learning Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Confidence</span>
                        <span>{formatPercentage(dashboard.aiLearning.avgConfidence)}</span>
                      </div>
                      <Progress 
                        value={dashboard.aiLearning.avgConfidence * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-center">
                        <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatNumber(dashboard.aiLearning.totalEvents)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Learning Events
                        </p>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Validation Status</h4>
                        {Object.entries(dashboard.aiLearning.validationStatus).map(([status, count]) => (
                          <div key={status} className="flex justify-between items-center py-1">
                            <span className="text-sm capitalize">{status}</span>
                            <Badge variant={status === 'validated' ? 'default' : 'secondary'}>
                              {count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}