import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Brain, Target, Zap, Settings, Info, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";

export interface DifficultyConfig {
  level: 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
  displayName: string;
  description: string;
  estimatedTime: string;
  questionCount: number;
  adaptiveRange?: [number, number]; // IRT theta range
  icon: any;
  color: string;
  bgColor: string;
  features: string[];
}

const difficultyConfigs: DifficultyConfig[] = [
  {
    level: 'beginner',
    displayName: 'Foundation Level',
    description: 'Perfect for building core skills and confidence',
    estimatedTime: '30-45 min',
    questionCount: 40,
    adaptiveRange: [-2.0, 0.5],
    icon: Target,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    features: [
      'Fundamental concepts focus',
      'Step-by-step guidance',
      'Confidence building approach',
      'Basic EiQ skill assessment'
    ]
  },
  {
    level: 'intermediate',
    displayName: 'Standard Level',
    description: 'Balanced assessment for most learners',
    estimatedTime: '45-60 min',
    questionCount: 60,
    adaptiveRange: [-1.0, 1.5],
    icon: Brain,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    features: [
      'Comprehensive skill coverage',
      'Moderate challenge level',
      'Detailed analysis provided',
      'Full EiQ domain assessment'
    ]
  },
  {
    level: 'advanced',
    displayName: 'Challenge Level',
    description: 'For experienced learners seeking rigorous assessment',
    estimatedTime: '60-90 min',
    questionCount: 80,
    adaptiveRange: [0.0, 3.0],
    icon: Award,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    features: [
      'Complex problem solving',
      'Advanced reasoning tasks',
      'Expert-level insights',
      'Maximum EiQ precision'
    ]
  },
  {
    level: 'adaptive',
    displayName: 'AI-Adaptive Level',
    description: 'Smart difficulty that adjusts to your performance in real-time',
    estimatedTime: '45-75 min',
    questionCount: 60,
    adaptiveRange: [-3.0, 3.0],
    icon: Zap,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    features: [
      'Real-time difficulty adjustment',
      'Personalized question selection',
      'Optimal challenge maintenance',
      'Maximum learning efficiency'
    ]
  }
];

interface DifficultySelectorProps {
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: DifficultyConfig) => void;
  userProfile?: {
    previousAssessments?: number;
    averageScore?: number;
    preferredLearningStyle?: string;
  };
  onStartAssessment: () => void;
}

export default function DifficultySelector({
  selectedDifficulty,
  onDifficultyChange,
  userProfile,
  onStartAssessment
}: DifficultySelectorProps) {
  const [customAdaptiveLevel, setCustomAdaptiveLevel] = useState([0]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const getRecommendedDifficulty = () => {
    if (!userProfile?.previousAssessments) return 'beginner';
    if (userProfile.averageScore && userProfile.averageScore > 80) return 'advanced';
    if (userProfile.previousAssessments > 2) return 'intermediate';
    return 'beginner';
  };

  const recommendedLevel = getRecommendedDifficulty();

  return (
    <div className="space-y-6">
      <Card className="bg-black border-green-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-green-400" />
            <CardTitle className="text-green-400">Assessment Difficulty Selection</CardTitle>
          </div>
          <p className="text-gray-400">
            Choose your preferred difficulty level for an optimal learning experience
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Recommendation */}
          {userProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-medium">AI Recommendation</span>
              </div>
              <p className="text-gray-300 text-sm">
                Based on your {userProfile.previousAssessments || 0} previous assessments 
                {userProfile.averageScore && ` and ${userProfile.averageScore}% average score`}, 
                we recommend starting with <span className="text-blue-400 font-medium">
                  {difficultyConfigs.find(d => d.level === recommendedLevel)?.displayName}
                </span>
              </p>
            </motion.div>
          )}

          {/* Difficulty Options */}
          <div className="grid gap-4">
            {difficultyConfigs.map((config, index) => {
              const Icon = config.icon;
              const isSelected = selectedDifficulty === config.level;
              const isRecommended = config.level === recommendedLevel;

              return (
                <motion.div
                  key={config.level}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-green-400 bg-green-500/5' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => onDifficultyChange(config)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${config.bgColor}`}>
                            <Icon className={`w-5 h-5 ${config.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold ${config.color}`}>
                                {config.displayName}
                              </h3>
                              {isRecommended && (
                                <Badge variant="outline" className="text-xs text-blue-400 border-blue-400/50">
                                  Recommended
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mb-3">
                              {config.description}
                            </p>
                            
                            {/* Assessment Details */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="text-xs">
                                <span className="text-gray-500">Duration:</span>
                                <span className="text-gray-300 ml-1">{config.estimatedTime}</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-gray-500">Questions:</span>
                                <span className="text-gray-300 ml-1">{config.questionCount}</span>
                              </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-1">
                              {config.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                                  <div className="w-1 h-1 bg-green-400 rounded-full" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Selection Indicator */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'border-green-400 bg-green-400' 
                            : 'border-gray-600'
                        }`}>
                          {isSelected && (
                            <div className="w-2 h-2 bg-black rounded-full" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Advanced Adaptive Options */}
          {selectedDifficulty === 'adaptive' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="text-amber-400 hover:text-amber-300"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Adaptive Settings
                </Button>
              </div>

              {showAdvancedOptions && (
                <Card className="bg-amber-500/5 border-amber-400/20">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-amber-400 mb-2 block">
                        Starting Difficulty Level
                      </label>
                      <div className="space-y-2">
                        <Slider
                          value={customAdaptiveLevel}
                          onValueChange={setCustomAdaptiveLevel}
                          max={3}
                          min={-3}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Beginner (-3.0)</span>
                          <span className="text-amber-400">
                            Current: {customAdaptiveLevel[0].toFixed(1)}
                          </span>
                          <span>Expert (+3.0)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400 p-3 bg-amber-500/10 rounded-lg">
                      <Info className="w-4 h-4 inline mr-2" />
                      The AI will start at this level and adjust based on your responses. 
                      Higher values = more challenging initial questions.
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Start Assessment Button */}
          <div className="pt-4">
            <Button
              onClick={onStartAssessment}
              disabled={!selectedDifficulty}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Start {difficultyConfigs.find(d => d.level === selectedDifficulty)?.displayName} Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}