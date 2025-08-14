import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Clock, Target } from "lucide-react";

interface HintContext {
  userId: string;
  questionId?: string;
  currentAnswer?: string;
  attemptCount: number;
  timeSpent: number;
  previousHints: string[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  subject: string;
  learningObjective: string;
}

interface LearningHint {
  id: string;
  content: string;
  type: 'conceptual' | 'procedural' | 'strategic' | 'motivational';
  difficulty: 'easy' | 'medium' | 'hard';
  relevanceScore: number;
  timestamp: Date;
}

interface ContextualHintProviderProps {
  context: HintContext;
  onHintUsed?: (hint: LearningHint, wasUseful: boolean) => void;
  isVisible?: boolean;
  autoShow?: boolean;
  showAfterTime?: number; // seconds
}

const hintTypeIcons = {
  conceptual: '💡',
  procedural: '📝',
  strategic: '🎯',
  motivational: '🌟'
};

const hintTypeColors = {
  conceptual: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  procedural: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  strategic: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  motivational: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
};

export function ContextualHintProvider({
  context,
  onHintUsed,
  isVisible = true,
  autoShow = true,
  showAfterTime = 30
}: ContextualHintProviderProps) {
  const [currentHint, setCurrentHint] = useState<LearningHint | null>(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [hintHistory, setHintHistory] = useState<LearningHint[]>([]);
  const [showHintHistory, setShowHintHistory] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer effect for auto-showing hints
  useEffect(() => {
    if (!autoShow || !isVisible) return;

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [autoShow, isVisible]);

  // Auto-show hint after specified time
  useEffect(() => {
    if (autoShow && timeElapsed >= showAfterTime && !currentHint && context.attemptCount >= 1) {
      handleGenerateHint();
    }
  }, [timeElapsed, showAfterTime, currentHint, context.attemptCount, autoShow]);

  const generateHint = useCallback(async (context: HintContext): Promise<LearningHint> => {
    try {
      const response = await fetch('/api/learning/generate-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });

      if (!response.ok) {
        throw new Error('Failed to generate hint');
      }

      return await response.json();
    } catch (error) {
      console.error('[HINT PROVIDER] Error generating hint:', error);
      
      // Fallback hint generation
      const fallbackHints = {
        conceptual: "Think about the core concepts involved in this problem. What fundamental principles apply here?",
        procedural: "Break this problem down into smaller steps. What would be your first step?",
        strategic: "Consider different approaches to this problem. Which strategy might work best?",
        motivational: "You're doing great! Take your time and think through this carefully."
      };

      const hintType = context.attemptCount >= 3 ? 'strategic' : 
                     context.attemptCount >= 2 ? 'conceptual' :
                     context.timeSpent > 45 ? 'procedural' : 'motivational';

      return {
        id: `fallback_${Date.now()}`,
        content: hintTypeIcons[hintType] + ' ' + fallbackHints[hintType],
        type: hintType,
        difficulty: context.userLevel === 'beginner' ? 'easy' : 
                   context.userLevel === 'intermediate' ? 'medium' : 'hard',
        relevanceScore: 0.7,
        timestamp: new Date()
      };
    }
  }, []);

  const handleGenerateHint = async () => {
    setIsGeneratingHint(true);
    try {
      const newHint = await generateHint(context);
      setCurrentHint(newHint);
      setIsHintVisible(true);
      setHintHistory(prev => [...prev, newHint]);
    } catch (error) {
      console.error('[HINT PROVIDER] Failed to generate hint:', error);
    } finally {
      setIsGeneratingHint(false);
    }
  };

  const handleHintFeedback = (hint: LearningHint, wasUseful: boolean) => {
    onHintUsed?.(hint, wasUseful);
    
    // Store feedback locally for better hint generation
    const feedback = {
      hintId: hint.id,
      wasUseful,
      context: {
        attemptCount: context.attemptCount,
        timeSpent: context.timeSpent,
        subject: context.subject
      },
      timestamp: new Date()
    };
    
    // You could store this in localStorage or send to analytics
    console.log('[HINT PROVIDER] User feedback:', feedback);
  };

  const handleDismissHint = () => {
    setIsHintVisible(false);
    setCurrentHint(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {/* Hint Generation Button */}
      {!isHintVisible && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateHint}
          disabled={isGeneratingHint}
          className="shadow-lg bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600"
        >
          <Lightbulb className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
          {isGeneratingHint ? 'Getting hint...' : 'Need a hint?'}
        </Button>
      )}

      {/* Current Hint Display */}
      <AnimatePresence>
        {isHintVisible && currentHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 shadow-xl bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <Badge 
                    variant="secondary" 
                    className={hintTypeColors[currentHint.type]}
                  >
                    {currentHint.type}
                  </Badge>
                  <Badge variant="outline">
                    {currentHint.difficulty}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissHint}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </Button>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {currentHint.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Target className="w-3 h-3" />
                  <span>Relevance: {Math.round(currentHint.relevanceScore * 100)}%</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Helpful?</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHintFeedback(currentHint, true)}
                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHintFeedback(currentHint, false)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint History Toggle */}
      {hintHistory.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHintHistory(!showHintHistory)}
          className="w-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <Clock className="w-4 h-4 mr-2" />
          {hintHistory.length} hint{hintHistory.length > 1 ? 's' : ''} received
          {showHintHistory ? (
            <ChevronUp className="w-4 h-4 ml-2" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2" />
          )}
        </Button>
      )}

      {/* Hint History */}
      <AnimatePresence>
        {showHintHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 max-h-60 overflow-y-auto"
          >
            {hintHistory.slice(-3).reverse().map((hint, index) => (
              <Card key={hint.id} className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="secondary" 
                    className={`${hintTypeColors[hint.type]} text-xs`}
                  >
                    {hint.type}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(hint.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {hint.content}
                </p>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      {autoShow && timeElapsed < showAfterTime && (
        <div className="text-xs text-gray-500 text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          Hint available in {showAfterTime - timeElapsed}s
        </div>
      )}
    </div>
  );
}

export default ContextualHintProvider;