import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Brain, Target, Clock, Sparkles, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";

interface AIHint {
  id: string;
  hintType: 'conceptual' | 'procedural' | 'strategic' | 'encouragement' | 'personalized';
  content: string;
  confidence: number;
  aiReasoning: string;
  suggestedNextStep?: string;
  relatedConcepts?: string[];
  personalizedContext?: string;
  learningStyle?: 'visual' | 'analytical' | 'kinesthetic' | 'verbal';
  difficultyAdjustment?: 'simplify' | 'elaborate' | 'maintain';
}

interface HintBubbleProps {
  questionId: string;
  sessionId: string;
  attemptCount: number;
  timeSpent: number;
  userTheta: number;
  previousAnswers?: string[];
  userProfile?: any;
  onHintRequest: () => void;
  onHintUsed: (hintId: string) => void;
}

const hintTypeIcons = {
  conceptual: Brain,
  procedural: Target,
  strategic: Lightbulb,
  encouragement: Sparkles,
  personalized: Brain
};

const hintTypeColors = {
  conceptual: "bg-blue-500/20 border-blue-400/30 text-blue-300",
  procedural: "bg-green-500/20 border-green-400/30 text-green-300",
  strategic: "bg-yellow-500/20 border-yellow-400/30 text-yellow-300",
  encouragement: "bg-purple-500/20 border-purple-400/30 text-purple-300",
  personalized: "bg-pink-500/20 border-pink-400/30 text-pink-300"
};

export default function AIHintBubbles({
  questionId,
  sessionId,
  attemptCount,
  timeSpent,
  userTheta,
  previousAnswers = [],
  userProfile,
  onHintRequest,
  onHintUsed
}: HintBubbleProps) {
  const [availableHints, setAvailableHints] = useState<AIHint[]>([]);
  const [activeHint, setActiveHint] = useState<AIHint | null>(null);
  const [showBubbles, setShowBubbles] = useState(false);
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [hintTriggers, setHintTriggers] = useState({
    timeThreshold: false,
    attemptThreshold: false,
    strugglingPattern: false,
    personalizedRecommendation: false
  });

  const bubbleContainer = useRef<HTMLDivElement>(null);

  // Monitor user behavior for hint triggers
  useEffect(() => {
    const triggers = {
      timeThreshold: timeSpent > 120000, // 2 minutes
      attemptThreshold: attemptCount >= 2,
      strugglingPattern: attemptCount >= 3 && userTheta < -0.5,
      personalizedRecommendation: userProfile && attemptCount >= 1
    };

    setHintTriggers(triggers);

    // Auto-show bubbles when triggers are met
    if (Object.values(triggers).some(Boolean) && availableHints.length === 0) {
      setShowBubbles(true);
    }
  }, [timeSpent, attemptCount, userTheta, userProfile, availableHints.length]);

  // Generate personalized hints based on triggers
  const generatePersonalizedHints = async () => {
    if (isGeneratingHint) return;
    
    setIsGeneratingHint(true);
    try {
      const hintRequest = {
        sessionId,
        questionId,
        attemptCount,
        timeSpent,
        userTheta,
        previousIncorrectAnswers: previousAnswers,
        userProfile,
        learningStyle: userProfile?.preferredLearningStyle || 'analytical',
        personalContext: {
          strugglingAreas: userProfile?.strugglingConcepts || [],
          strongAreas: userProfile?.masteredConcepts || [],
          assessmentHistory: userProfile?.assessmentHistory || []
        }
      };

      const response = await apiRequest("POST", "/api/assessment/hints/generate-personalized-hints", hintRequest);

      setAvailableHints(response.hints || []);
      onHintRequest();
    } catch (error) {
      console.error('[HINT BUBBLES] Error generating hints:', error);
      // Provide fallback hints
      setAvailableHints([{
        id: 'fallback-1',
        hintType: 'strategic',
        content: 'Try breaking down the problem into smaller parts and tackling each one step by step.',
        confidence: 0.7,
        aiReasoning: 'Fallback hint for problem-solving strategy',
        suggestedNextStep: 'Identify the key information given in the problem'
      }]);
    } finally {
      setIsGeneratingHint(false);
    }
  };

  // Handle hint bubble click
  const handleHintClick = async (hint: AIHint) => {
    setActiveHint(hint);
    onHintUsed(hint.id);

    // Track hint usage analytics
    try {
      await apiRequest("POST", "/api/assessment/track-hint-usage", {
        sessionId,
        questionId,
        hintId: hint.id,
        hintType: hint.hintType,
        timeTaken: timeSpent,
        attemptNumber: attemptCount
      });
    } catch (error) {
      console.error('[HINT TRACKING] Error tracking hint usage:', error);
    }
  };

  // Render floating hint bubbles
  const renderHintBubbles = () => {
    if (!showBubbles || availableHints.length === 0) return null;

    return (
      <div ref={bubbleContainer} className="absolute top-4 right-4 space-y-2 z-50">
        <AnimatePresence>
          {availableHints.slice(0, 3).map((hint, index) => {
            const Icon = hintTypeIcons[hint.hintType];
            const colorClass = hintTypeColors[hint.hintType];
            
            return (
              <motion.div
                key={hint.id}
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: 1,
                  y: [0, -5, 0] // Floating animation
                }}
                exit={{ opacity: 0, x: 50, scale: 0.8 }}
                transition={{ 
                  delay: index * 0.2,
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className={`relative p-3 ${colorClass} border-2 backdrop-blur-sm cursor-pointer
                    hover:scale-105 transition-all duration-200 rounded-full min-w-[60px] min-h-[60px]
                    flex items-center justify-center group`}
                  onClick={() => handleHintClick(hint)}
                >
                  <Icon className="w-5 h-5" />
                  
                  {/* Pulse effect for new hints */}
                  {hint.confidence > 0.8 && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-current"
                      animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap pointer-events-none">
                    {hint.hintType} hint
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                      border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Generate hints button when no hints available */}
        {availableHints.length === 0 && (showBubbles || Object.values(hintTriggers).some(Boolean)) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 
                text-blue-300 hover:scale-105 transition-all duration-200 rounded-full p-3"
              onClick={generatePersonalizedHints}
              disabled={isGeneratingHint}
            >
              {isGeneratingHint ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <Lightbulb className="w-5 h-5" />
              )}
            </Button>
          </motion.div>
        )}
      </div>
    );
  };

  // Render expanded hint modal
  const renderHintModal = () => {
    if (!activeHint) return null;

    const Icon = hintTypeIcons[activeHint.hintType];
    const colorClass = hintTypeColors[activeHint.hintType];

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveHint(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className={`w-full max-w-lg ${colorClass} border-2`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    <div>
                      <Badge variant="outline" className="mb-1 capitalize">
                        {activeHint.hintType} Hint
                      </Badge>
                      <div className="text-xs opacity-70">
                        Confidence: {Math.round(activeHint.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveHint(null)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Hint</h4>
                    <p className="text-sm opacity-90">{activeHint.content}</p>
                  </div>

                  {activeHint.suggestedNextStep && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ChevronRight className="w-4 h-4" />
                        Next Step
                      </h4>
                      <p className="text-sm opacity-90">{activeHint.suggestedNextStep}</p>
                    </div>
                  )}

                  {activeHint.personalizedContext && (
                    <div>
                      <h4 className="font-medium mb-2">Why This Helps You</h4>
                      <p className="text-sm opacity-90">{activeHint.personalizedContext}</p>
                    </div>
                  )}

                  {activeHint.relatedConcepts && activeHint.relatedConcepts.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Related Concepts</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeHint.relatedConcepts.map((concept, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs opacity-60 border-t pt-3">
                    <strong>AI Reasoning:</strong> {activeHint.aiReasoning}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      {renderHintBubbles()}
      {renderHintModal()}
    </>
  );
}