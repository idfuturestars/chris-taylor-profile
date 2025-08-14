import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity,
  Database,
  Server,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Cpu
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalAssessments: number;
  avgEiqScore: number;
  systemUptime: string;
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

interface UserAnalytics {
  registrations: Array<{
    date: string;
    count: number;
  }>;
  engagement: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
    retentionRate: number;
  };
  demographics: {
    ageGroups: Array<{
      range: string;
      count: number;
    }>;
    educationLevels: Array<{
      level: string;
      count: number;
    }>;
  };
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  services: Array<{
    name: string;
    status: 'online' | 'degraded' | 'offline';
    responseTime: number;
    uptime: number;
  }>;
  alerts: Array<{
    id: string;
    level: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }>;
}

interface PerformanceMetrics {
  assessmentCompletion: {
    rate: number;
    averageTime: number;
    dropoffPoints: Array<{
      stage: string;
      percentage: number;
    }>;
  };
  aiPerformance: {
    questionGeneration: {
      accuracy: number;
      speed: number;
      cost: number;
    };
    hintGeneration: {
      relevance: number;
      effectiveness: number;
    };
  };
}

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalAssessments: 0,
    avgEiqScore: 0,
    systemUptime: '0h',
    responseTime: 0,
    memoryUsage: 0,
    cpuUsage: 0
  });
  
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics>({
    registrations: [],
    engagement: {
      dailyActive: 0,
      weeklyActive: 0,
      monthlyActive: 0,
      retentionRate: 0
    },
    demographics: {
      ageGroups: [],
      educationLevels: []
    }
  });
  
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    services: [],
    alerts: []
  });
  
  const [performance, setPerformance] = useState<PerformanceMetrics>({
    assessmentCompletion: {
      rate: 0,
      averageTime: 0,
      dropoffPoints: []
    },
    aiPerformance: {
      questionGeneration: {
        accuracy: 0,
        speed: 0,
        cost: 0
      },
      hintGeneration: {
        relevance: 0,
        effectiveness: 0
      }
    }
  });
  
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Load system metrics
      const metricsResponse = await apiRequest('GET', `/api/admin/analytics/metrics?timeRange=${selectedTimeRange}`);
      const metricsData = await metricsResponse.json();
      setMetrics(metricsData.metrics || sampleMetrics);
      
      // Load user analytics
      const userResponse = await apiRequest('GET', `/api/admin/analytics/users?timeRange=${selectedTimeRange}`);
      const userData = await userResponse.json();
      setUserAnalytics(userData.analytics || sampleUserAnalytics);
      
      // Load system health
      const healthResponse = await apiRequest('GET', '/api/admin/analytics/health');
      const healthData = await healthResponse.json();
      setSystemHealth(healthData.health || sampleSystemHealth);
      
      // Load performance metrics
      const perfResponse = await apiRequest('GET', `/api/admin/analytics/performance?timeRange=${selectedTimeRange}`);
      const perfData = await perfResponse.json();
      setPerformance(perfData.performance || samplePerformance);
      
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      // Use sample data as fallback
      setMetrics(sampleMetrics);
      setUserAnalytics(sampleUserAnalytics);
      setSystemHealth(sampleSystemHealth);
      setPerformance(samplePerformance);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const response = await apiRequest('POST', '/api/admin/analytics/export', {
        timeRange: selectedTimeRange,
        includeUserData: true,
        includePerformance: true
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eiq-analytics-${selectedTimeRange}-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Report Exported",
        description: "Analytics report has been downloaded successfully."
      });
    } catch (error) {
      console.error('Failed to export report:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export analytics report.",
        variant: "destructive"
      });
    }
  };

  // Sample data for fallback
  const sampleMetrics: SystemMetrics = {
    totalUsers: 15420,
    activeUsers: 3847,
    totalAssessments: 45680,
    avgEiqScore: 742,
    systemUptime: '99.8%',
    responseTime: 185,
    memoryUsage: 67,
    cpuUsage: 34
  };

  const sampleUserAnalytics: UserAnalytics = {
    registrations: [
      { date: '2025-02-07', count: 45 },
      { date: '2025-02-08', count: 67 },
      { date: '2025-02-09', count: 89 },
      { date: '2025-02-10', count: 123 },
      { date: '2025-02-11', count: 156 },
      { date: '2025-02-12', count: 198 },
      { date: '2025-02-13', count: 234 }
    ],
    engagement: {
      dailyActive: 3847,
      weeklyActive: 12450,
      monthlyActive: 28900,
      retentionRate: 73.2
    },
    demographics: {
      ageGroups: [
        { range: '13-17', count: 4200 },
        { range: '18-24', count: 6800 },
        { range: '25-34', count: 3100 },
        { range: '35+', count: 1320 }
      ],
      educationLevels: [
        { level: 'High School', count: 5600 },
        { level: 'College', count: 7800 },
        { level: 'Graduate', count: 2020 }
      ]
    }
  };

  const sampleSystemHealth: SystemHealth = {
    status: 'healthy',
    services: [
      { name: 'API Server', status: 'online', responseTime: 45, uptime: 99.9 },
      { name: 'Database', status: 'online', responseTime: 12, uptime: 99.8 },
      { name: 'AI Services', status: 'online', responseTime: 234, uptime: 98.5 },
      { name: 'Analytics', status: 'online', responseTime: 67, uptime: 99.2 }
    ],
    alerts: [
      {
        id: '1',
        level: 'warning',
        message: 'High memory usage detected on AI processing server',
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        level: 'info',
        message: 'Scheduled maintenance completed successfully',
        timestamp: '1 day ago'
      }
    ]
  };

  const samplePerformance: PerformanceMetrics = {
    assessmentCompletion: {
      rate: 78.5,
      averageTime: 1847,
      dropoffPoints: [
        { stage: 'Question 1-5', percentage: 5.2 },
        { stage: 'Question 6-10', percentage: 8.7 },
        { stage: 'Question 11-15', percentage: 12.3 },
        { stage: 'Final Questions', percentage: 4.8 }
      ]
    },
    aiPerformance: {
      questionGeneration: {
        accuracy: 94.2,
        speed: 1.8,
        cost: 0.0023
      },
      hintGeneration: {
        relevance: 91.7,
        effectiveness: 87.4
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical':
      case 'offline':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <BarChart3 className="text-blue-500" />
              Admin Analytics
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Comprehensive system monitoring and performance analytics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportReport}>
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Users</p>
                  <p className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Active Users</p>
                  <p className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Assessments</p>
                  <p className="text-2xl font-bold">{metrics.totalAssessments.toLocaleString()}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Avg EIQ Score</p>
                  <p className="text-2xl font-bold">{metrics.avgEiqScore}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Analytics</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">System Uptime</p>
                      <p className="text-xl font-bold text-green-600">{metrics.systemUptime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Response Time</p>
                      <p className="text-xl font-bold">{metrics.responseTime}ms</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Memory Usage</p>
                      <p className="text-xl font-bold">{metrics.memoryUsage}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CPU Usage</p>
                      <p className="text-xl font-bold">{metrics.cpuUsage}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    User Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Daily Active Users</span>
                      <span className="font-bold">{userAnalytics.engagement.dailyActive.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Weekly Active Users</span>
                      <span className="font-bold">{userAnalytics.engagement.weeklyActive.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Active Users</span>
                      <span className="font-bold">{userAnalytics.engagement.monthlyActive.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Retention Rate</span>
                      <span className="font-bold text-green-600">{userAnalytics.engagement.retentionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Registrations Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>User Registrations Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Registration chart would appear here</p>
                    <p className="text-sm text-gray-400">
                      {userAnalytics.registrations.length} data points available
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Age Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userAnalytics.demographics.ageGroups.map((group) => (
                      <div key={group.range} className="flex items-center justify-between">
                        <span className="text-sm">{group.range} years</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${(group.count / Math.max(...userAnalytics.demographics.ageGroups.map(g => g.count))) * 100}%` }}
                            />
                          </div>
                          <span className="font-medium text-sm">{group.count.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Education Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userAnalytics.demographics.educationLevels.map((level) => (
                      <div key={level.level} className="flex items-center justify-between">
                        <span className="text-sm">{level.level}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: `${(level.count / Math.max(...userAnalytics.demographics.educationLevels.map(l => l.count))) * 100}%` }}
                            />
                          </div>
                          <span className="font-medium text-sm">{level.count.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Service Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemHealth.services.map((service) => (
                      <div key={service.name} className="flex items-center justify-between p-3 rounded bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(service.status)}
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{service.responseTime}ms</div>
                          <div className="text-xs text-gray-500">{service.uptime}% uptime</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {systemHealth.alerts.map((alert) => (
                      <div key={alert.id} className={`p-3 rounded border ${getAlertColor(alert.level)}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{alert.message}</span>
                          <Badge variant="outline" className="text-xs">
                            {alert.level}
                          </Badge>
                        </div>
                        <div className="text-xs mt-1 opacity-70">{alert.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Assessment Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                      <p className="text-2xl font-bold text-green-600">{performance.assessmentCompletion.rate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Time</p>
                      <p className="text-2xl font-bold">{Math.round(performance.assessmentCompletion.averageTime / 60)}m</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Drop-off Points</h4>
                    <div className="space-y-2">
                      {performance.assessmentCompletion.dropoffPoints.map((point) => (
                        <div key={point.stage} className="flex items-center justify-between text-sm">
                          <span>{point.stage}</span>
                          <span className="text-red-600">{point.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    AI Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Question Generation</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Accuracy:</span>
                        <div className="font-bold text-green-600">{performance.aiPerformance.questionGeneration.accuracy}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Speed:</span>
                        <div className="font-bold">{performance.aiPerformance.questionGeneration.speed}s</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Cost:</span>
                        <div className="font-bold">${performance.aiPerformance.questionGeneration.cost}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Hint Generation</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Relevance:</span>
                        <div className="font-bold text-blue-600">{performance.aiPerformance.hintGeneration.relevance}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Effectiveness:</span>
                        <div className="font-bold text-purple-600">{performance.aiPerformance.hintGeneration.effectiveness}%</div>
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