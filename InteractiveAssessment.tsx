import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  Timer, 
  CheckCircle, 
  ArrowRight,
  Lightbulb,
  Target,
  TrendingUp
} from "lucide-react";

interface Question {
  id: number;
  domain: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

interface InteractiveAssessmentProps {
  type: 'baseline' | 'comprehensive';
  onComplete: (score: number, results: any) => void;
}

export default function InteractiveAssessment({ type, onComplete }: InteractiveAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(
    type === 'baseline' ? 45 * 60 : 3.75 * 60 * 60 // 45 minutes for baseline, 3h 45m for comprehensive
  );
  const [showAIHint, setShowAIHint] = useState(false);
  const [score, setScore] = useState(0);

  // Sample questions for demonstration
  const questions: Question[] = [
    {
      id: 1,
      domain: "Logical Reasoning",
      question: "In the sequence 2, 6, 18, 54, ?, what number comes next?",
      options: ["108", "162", "216", "324"],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: "Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162"
    },
    {
      id: 2,
      domain: "Working Memory",
      question: "Remember this sequence: 7, 3, 9, 1, 5. Now, what is the sequence in reverse order?",
      options: ["5, 1, 9, 3, 7", "1, 3, 5, 7, 9", "9, 7, 5, 3, 1", "7, 9, 3, 1, 5"],
      correctAnswer: 0,
      difficulty: 'easy'
    },
    {
      id: 3,
      domain: "Verbal Comprehension",
      question: "What is the meaning of 'ubiquitous'?",
      options: ["Rare and unusual", "Present everywhere", "Extremely difficult", "Highly valuable"],
      correctAnswer: 1,
      difficulty: 'medium'
    },
    {
      id: 4,
      domain: "Perceptual Reasoning",
      question: "If you rotate a square 90 degrees clockwise, which direction will its top edge face?",
      options: ["Up", "Right", "Down", "Left"],
      correctAnswer: 1,
      difficulty: 'easy'
    },
    {
      id: 5,
      domain: "Processing Speed",
      question: "How many words contain the letter 'E' in this list: CAT, TREE, SUN, HOUSE, BIRD?",
      options: ["1", "2", "3", "4"],
      correctAnswer: 1,
      difficulty: 'easy'
    },
    {
      id: 6,
      domain: "Emotional Intelligence",
      question: "Your colleague seems upset after a meeting. What's the best response?",
      options: [
        "Ignore it - it's not your business",
        "Ask if they're okay and if you can help",
        "Tell them to cheer up",
        "Assume they'll get over it"
      ],
      correctAnswer: 1,
      difficulty: 'medium'
    }
  ];

  // Extended question set for comprehensive assessment
  const comprehensiveQuestions: Question[] = [
    ...questions,
    {
      id: 7,
      domain: "Logical Reasoning",
      question: "If all roses are flowers, and some flowers are red, which statement must be true?",
      options: ["All roses are red", "Some roses are red", "No roses are red", "None of the above"],
      correctAnswer: 3,
      difficulty: 'hard'
    },
    {
      id: 8,
      domain: "Working Memory",
      question: "Spell 'WORLD' backwards, then add the third letter of your result to the beginning.",
      options: ["LDLROW", "DLROW", "LDROW", "WDLRO"],
      correctAnswer: 2,
      difficulty: 'medium'
    },
    {
      id: 9,
      domain: "Verbal Comprehension",
      question: "In the context of literature, what does 'foreshadowing' mean?",
      options: ["A character's backstory", "Hints about future events", "The story's setting", "The main conflict"],
      correctAnswer: 1,
      difficulty: 'medium'
    },
    {
      id: 10,
      domain: "Perceptual Reasoning",
      question: "A cube has 6 faces. If you paint all faces red, then cut the cube into 27 smaller cubes, how many small cubes will have exactly 2 red faces?",
      options: ["8", "12", "6", "0"],
      correctAnswer: 1,
      difficulty: 'hard'
    },
    {
      id: 11,
      domain: "Processing Speed",
      question: "Count the number of times the letter 'T' appears in: THE CAT SAT ON THE MAT",
      options: ["4", "5", "6", "7"],
      correctAnswer: 2,
      difficulty: 'medium'
    },
    {
      id: 12,
      domain: "Emotional Intelligence",
      question: "A team member consistently interrupts others during meetings. As a team leader, what's the best approach?",
      options: [
        "Ignore it to avoid confrontation",
        "Speak to them privately about meeting etiquette",
        "Call them out publicly during the next meeting",
        "Start scheduling meetings without them"
      ],
      correctAnswer: 1,
      difficulty: 'medium'
    }
  ];

  const totalQuestions = type === 'baseline' ? 6 : 12;
  const displayQuestions = (type === 'comprehensive' ? comprehensiveQuestions : questions).slice(0, totalQuestions);
  const currentQuestion = displayQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    const answerIndex = parseInt(selectedAnswer);
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    // Calculate score
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer("");
      setShowAIHint(false);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const finalScore = Math.round((score / totalQuestions) * 800 + 200); // Scale to 200-800
    const results = {
      totalQuestions,
      correctAnswers: score,
      percentCorrect: (score / totalQuestions) * 100,
      eiqScore: finalScore,
      timeUsed: type === 'baseline' ? (45 * 60 - timeRemaining) : (3.75 * 60 * 60 - timeRemaining),
      domains: getDomainBreakdown()
    };
    onComplete(finalScore, results);
  };

  const getDomainBreakdown = () => {
    const domains = ['Logical Reasoning', 'Working Memory', 'Verbal Comprehension', 'Perceptual Reasoning', 'Processing Speed', 'Emotional Intelligence'];
    return domains.map(domain => ({
      name: domain,
      score: Math.floor(Math.random() * 100) + 50, // Mock domain scores
      level: Math.random() > 0.5 ? 'Strong' : 'Developing'
    }));
  };

  const getAIHint = () => {
    const hints = [
      "Consider the pattern or relationship between the numbers.",
      "Think about what each option means and eliminate obviously wrong answers.",
      "Remember the sequence and work backwards step by step.",
      "Visualize the problem in your mind before selecting an answer.",
      "Consider the emotional context and best practices for interpersonal communication."
    ];
    return hints[currentQuestionIndex] || "Take your time and think through each option carefully.";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                {type === 'baseline' ? 'Quick Baseline Assessment' : 'Comprehensive Assessment'}
              </CardTitle>
              <CardDescription>
                Domain: {currentQuestion.domain} • Question {currentQuestionIndex + 1} of {totalQuestions}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>
              <Badge variant="outline">
                {currentQuestion.difficulty}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* AI Hint */}
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIHint(!showAIHint)}
              className="w-full"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showAIHint ? 'Hide AI Hint' : 'Get AI Hint'}
            </Button>

            {showAIHint && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">AI Hint:</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{getAIHint()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Score: {score}/{currentQuestionIndex + (selectedAnswer ? 1 : 0)}
            </div>
            <Button 
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="min-w-[120px]"
            >
              {currentQuestionIndex === totalQuestions - 1 ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentQuestionIndex + (selectedAnswer ? 1 : 0)}/{totalQuestions}
              </div>
              <div className="text-sm text-muted-foreground">Answered</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}