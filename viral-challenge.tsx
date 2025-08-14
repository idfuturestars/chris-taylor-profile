import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Timer, Trophy, Share2, Zap, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Question {
  id: string;
  question: string;
  options: string[];
  timeEstimate: number;
  category: string;
}

interface ChallengeResult {
  sessionId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  rank: number;
  shareCode: string;
  shareUrl: string;
  percentile: number;
  badge: 'genius' | 'expert' | 'proficient' | 'learner';
}

interface LeaderboardEntry {
  rank: number;
  userName: string;
  profileImage?: string;
  score: number;
  timeSpent: number;
  shareCode: string;
  completedAt: string;
}

export default function ViralChallengePage() {
  const [gameState, setGameState] = useState<'idle' | 'active' | 'completed'>('idle');
  const [challengeType, setChallengeType] = useState<'15_second' | '30_second' | '60_second'>('15_second');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(15);
  const [startTime, setStartTime] = useState(0);
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { toast } = useToast();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string>('');

  const challengeConfig = {
    '15_second': { time: 15, questions: 3, title: '15-Second Lightning' },
    '30_second': { time: 30, questions: 5, title: '30-Second Sprint' },
    '60_second': { time: 60, questions: 10, title: '60-Second Marathon' }
  };

  const badgeConfig = {
    genius: { color: 'bg-purple-500', icon: '🧠', label: 'Genius' },
    expert: { color: 'bg-blue-500', icon: '🎯', label: 'Expert' },
    proficient: { color: 'bg-green-500', icon: '⭐', label: 'Proficient' },
    learner: { color: 'bg-yellow-500', icon: '🌟', label: 'Learner' }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [challengeType]);

  useEffect(() => {
    if (gameState === 'active' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'active') {
      completeChallenge();
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, gameState]);

  const loadLeaderboard = async () => {
    try {
      const response = await apiRequest('GET', `/api/viral/challenge/leaderboard?challengeType=${challengeType}&limit=10&timeframe=week`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  const startChallenge = async () => {
    try {
      const response = await apiRequest('POST', '/api/viral/challenge/start', {
        challengeType,
        difficulty,
        userId: 'demo_user' // Use actual auth user when available
      });
      
      const data = await response.json();
      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setTimeLeft(challengeConfig[challengeType].time);
      setStartTime(Date.now());
      setGameState('active');
      sessionIdRef.current = data.sessionId;
      
      toast({
        title: "Challenge Started!",
        description: `You have ${challengeConfig[challengeType].time} seconds to complete ${data.questions.length} questions.`
      });
    } catch (error) {
      console.error('Failed to start challenge:', error);
      toast({
        title: "Failed to start challenge",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const selectAnswer = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    
    // Auto-advance to next question
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 300);
    } else {
      // All questions answered, complete challenge
      setTimeout(() => {
        completeChallenge();
      }, 300);
    }
  };

  const completeChallenge = async () => {
    if (gameState !== 'active') return;
    
    setGameState('completed');
    
    try {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const responses = questions.map(q => ({
        questionId: q.id,
        answer: selectedAnswers[q.id] ?? -1
      }));
      
      const response = await apiRequest('POST', `/api/viral/challenge/${sessionIdRef.current}/complete`, {
        responses,
        timeSpent
      });
      
      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Challenge Complete!",
        description: `You scored ${data.score} points and ranked #${data.rank}!`
      });
      
      // Reload leaderboard to show updated rankings
      loadLeaderboard();
    } catch (error) {
      console.error('Failed to complete challenge:', error);
      toast({
        title: "Failed to complete challenge",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const shareResult = async (platform: string) => {
    if (!result) return;
    
    try {
      const response = await apiRequest('POST', `/api/viral/challenge/${result.shareCode}/share`, {
        platform
      });
      
      const data = await response.json();
      
      if (platform === 'copy') {
        navigator.clipboard.writeText(data.shareUrl);
        toast({
          title: "Link copied!",
          description: "Share your challenge result with friends."
        });
      } else {
        window.open(`https://${platform}.com/intent/tweet?text=${encodeURIComponent(data.content)}`);
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const resetChallenge = () => {
    setGameState('idle');
    setResult(null);
    setQuestions([]);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
            <Zap className="text-yellow-500" />
            EIQ Viral Challenge
            <Brain className="text-purple-500" />
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Test your cognitive abilities in lightning-fast challenges
          </p>
        </div>

        {gameState === 'idle' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Challenge Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Start Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Challenge Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(challengeConfig).map(([type, config]) => (
                      <Button
                        key={type}
                        variant={challengeType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setChallengeType(type as any)}
                        className="text-xs"
                      >
                        {config.title}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <Button
                        key={level}
                        variant={difficulty === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDifficulty(level as any)}
                        className="text-xs capitalize"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button onClick={startChallenge} className="w-full" size="lg">
                  Start {challengeConfig[challengeType].title}
                </Button>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {leaderboard.map((entry) => (
                    <div key={entry.rank} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center text-xs">
                          #{entry.rank}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{entry.userName}</p>
                          <p className="text-xs text-gray-500">{entry.timeSpent}s</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{entry.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {gameState === 'active' && currentQuestion && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-red-500" />
                  <span className="text-2xl font-bold text-red-500">{timeLeft}s</span>
                </div>
                <Badge variant="secondary">
                  {currentQuestionIndex + 1} of {questions.length}
                </Badge>
              </div>
              <Progress value={progress} className="w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswers[currentQuestion.id] === index ? "default" : "outline"}
                      size="lg"
                      onClick={() => selectAnswer(currentQuestion.id, index)}
                      className="h-auto p-4 text-left whitespace-normal"
                      disabled={selectedAnswers[currentQuestion.id] !== undefined}
                    >
                      <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {gameState === 'completed' && result && (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Challenge Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.score}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Score</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">#{result.rank}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Rank</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{result.percentile}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Percentile</p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{result.timeSpent}s</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Time</p>
                </div>
              </div>

              <div className="flex justify-center">
                <Badge className={`${badgeConfig[result.badge].color} text-white text-lg px-4 py-2`}>
                  {badgeConfig[result.badge].icon} {badgeConfig[result.badge].label}
                </Badge>
              </div>

              <div className="flex justify-center gap-2">
                <Button onClick={() => shareResult('twitter')} size="sm" variant="outline">
                  <Share2 className="w-4 h-4 mr-1" />
                  Twitter
                </Button>
                <Button onClick={() => shareResult('copy')} size="sm" variant="outline">
                  Share Link
                </Button>
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={resetChallenge} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => setShowLeaderboard(!showLeaderboard)} variant="secondary">
                  <Trophy className="w-4 h-4 mr-1" />
                  View Leaderboard
                </Button>
              </div>

              {showLeaderboard && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-4">Weekly Leaderboard</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {leaderboard.map((entry) => (
                      <div key={entry.rank} className="flex items-center justify-between p-2 rounded bg-white dark:bg-gray-700">
                        <div className="flex items-center gap-3">
                          <Badge variant={entry.rank <= 3 ? "default" : "secondary"} className="w-8 h-8 rounded-full flex items-center justify-center text-xs">
                            #{entry.rank}
                          </Badge>
                          <div>
                            <p className="font-medium text-sm">{entry.userName}</p>
                            <p className="text-xs text-gray-500">{entry.timeSpent}s</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{entry.score}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}