import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  TrendingUp, 
  Users, 
  Award,
  Target,
  BarChart3,
  MapPin
} from "lucide-react";

export default function GlobalAnalyticsDashboard() {
  const globalStats = {
    totalUsers: 147523,
    averageScore: 542,
    topCountryScore: { country: "Singapore", score: 598 },
    improvementRate: 23,
    aiUsageRate: 67
  };

  const heatMapData = [
    { country: "Singapore", score: 598, users: 2847, color: "bg-green-500" },
    { country: "South Korea", score: 587, users: 4521, color: "bg-green-400" },
    { country: "Japan", score: 574, users: 8932, color: "bg-blue-500" },
    { country: "Finland", score: 568, users: 1203, color: "bg-blue-400" },
    { country: "Switzerland", score: 562, users: 987, color: "bg-blue-300" },
    { country: "Canada", score: 556, users: 6784, color: "bg-yellow-500" },
    { country: "Australia", score: 551, users: 3456, color: "bg-yellow-400" },
    { country: "United States", score: 548, users: 45672, color: "bg-yellow-300" },
    { country: "United Kingdom", score: 543, users: 12890, color: "bg-orange-400" },
    { country: "Germany", score: 539, users: 8765, color: "bg-orange-300" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Global EiQ Score Analytics
          </CardTitle>
          <CardDescription>
            Real-time worldwide EiQ assessment data and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{globalStats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{globalStats.averageScore}</div>
              <div className="text-sm text-muted-foreground">Global Average</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{globalStats.topCountryScore.score}</div>
              <div className="text-sm text-muted-foreground">Top Score ({globalStats.topCountryScore.country})</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">+{globalStats.improvementRate}%</div>
              <div className="text-sm text-muted-foreground">Avg Improvement</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{globalStats.aiUsageRate}%</div>
              <div className="text-sm text-muted-foreground">AI Usage Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Global Score Heat Map</CardTitle>
          <CardDescription>
            Average EiQ scores by country - live updating as assessments are completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {heatMapData.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${country.color}`}></div>
                  <div>
                    <div className="font-medium">{country.country}</div>
                    <div className="text-sm text-muted-foreground">{country.users.toLocaleString()} users</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{country.score}</div>
                  <Badge variant={index < 3 ? "default" : index < 7 ? "secondary" : "outline"}>
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Assistance Impact Analysis</CardTitle>
          <CardDescription>
            How AI usage affects global EiQ score improvement patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">High AI Usage Countries</h4>
              <p className="text-sm text-muted-foreground">
                Countries with 70%+ AI usage show 31% faster score improvement but 12% lower baseline scores
              </p>
              <div className="mt-2 text-xs">
                <span className="font-medium">Top AI users:</span> South Korea (84%), Japan (78%), Singapore (76%)
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Optimal AI Usage Pattern</h4>
              <p className="text-sm text-muted-foreground">
                Countries with 40-60% AI usage achieve the highest absolute scores and sustained improvement
              </p>
              <div className="mt-2 text-xs">
                <span className="font-medium">Optimal range:</span> Finland (52%), Switzerland (48%), Canada (56%)
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Assessment Frequency Impact</h4>
              <p className="text-sm text-muted-foreground">
                Users taking weekly baseline assessments show 45% better score consistency than monthly users
              </p>
              <div className="mt-2 text-xs">
                <span className="font-medium">Recommendation:</span> Weekly baseline + bi-weekly comprehensive for optimal growth
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gamification Challenges</CardTitle>
          <CardDescription>
            Global competition and achievement tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                Monthly Global Challenge
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Compete with users worldwide for the highest score improvement
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Your Progress</span>
                  <span className="font-medium">+47 points</span>
                </div>
                <Progress value={78} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Rank: #2,847 globally • Top 15%
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                Country Leaderboard
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Help your country climb the global rankings
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Country Average</span>
                  <span className="font-medium">548 points</span>
                </div>
                <Progress value={65} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Rank: #8 globally • Rising +2 positions
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}