import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  Brain,
  Zap,
  Eye,
  Headphones,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useDropzone } from 'react-dropzone';

interface AssessmentTask {
  id: string;
  type: 'text' | 'audio' | 'visual' | 'video' | 'multimodal';
  title: string;
  description: string;
  instruction: string;
  timeLimit?: number;
  mediaUrl?: string;
  expectedFormat: 'text' | 'audio' | 'file' | 'selection';
}

interface AssessmentResponse {
  taskId: string;
  type: string;
  content: any;
  timestamp: number;
  duration?: number;
}

interface AssessmentResult {
  sessionId: string;
  overallScore: number;
  modalityScores: Record<string, number>;
  cognitiveProfile: {
    verbalReasoning: number;
    visualProcessing: number;
    auditoryProcessing: number;
    multimodalIntegration: number;
    creativeProblemSolving: number;
  };
  recommendations: string[];
  detailedAnalysis: string;
}

export default function MultiModalAssessmentPage() {
  const [currentTask, setCurrentTask] = useState(0);
  const [tasks, setTasks] = useState<AssessmentTask[]>([]);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [assessmentState, setAssessmentState] = useState<'setup' | 'active' | 'completed'>('setup');
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [textResponse, setTextResponse] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  
  const { toast } = useToast();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const sampleTasks: AssessmentTask[] = [
    {
      id: 'text-reasoning',
      type: 'text',
      title: 'Verbal Reasoning',
      description: 'Analyze complex written information and draw logical conclusions',
      instruction: 'Read the passage below and provide a comprehensive analysis of the main argument, identifying key assumptions and potential counterarguments.',
      timeLimit: 300,
      expectedFormat: 'text'
    },
    {
      id: 'audio-pattern',
      type: 'audio',
      title: 'Auditory Pattern Recognition',
      description: 'Identify and analyze complex audio patterns',
      instruction: 'Listen to the audio sequence and describe the pattern you hear. Then, predict what the next 3 elements in the sequence would be.',
      timeLimit: 180,
      expectedFormat: 'audio'
    },
    {
      id: 'visual-analysis',
      type: 'visual',
      title: 'Visual-Spatial Processing',
      description: 'Analyze complex visual information and spatial relationships',
      instruction: 'Examine the image and describe the spatial relationships, patterns, and any transformations you observe.',
      timeLimit: 240,
      expectedFormat: 'text'
    },
    {
      id: 'multimodal-integration',
      type: 'multimodal',
      title: 'Cross-Modal Integration',
      description: 'Integrate information from multiple sensory modalities',
      instruction: 'You will receive information through text, audio, and visual channels simultaneously. Synthesize all inputs and provide a unified response.',
      timeLimit: 420,
      expectedFormat: 'text'
    }
  ];

  const startAssessment = async () => {
    try {
      const response = await apiRequest('POST', '/api/multi-modal/assessment/start', {
        userId: 'demo_user', // Use actual auth user
        assessmentType: 'comprehensive',
        includeModalities: ['text', 'audio', 'visual', 'multimodal']
      });
      
      const data = await response.json();
      setSessionId(data.sessionId);
      setTasks(data.tasks || sampleTasks);
      setCurrentTask(0);
      setAssessmentState('active');
      startTaskTimer(data.tasks?.[0] || sampleTasks[0]);
      
      toast({
        title: "Assessment Started",
        description: "Complete each task within the time limit for best results."
      });
    } catch (error) {
      console.error('Failed to start assessment:', error);
      // Fallback to demo mode
      setTasks(sampleTasks);
      setCurrentTask(0);
      setAssessmentState('active');
      startTaskTimer(sampleTasks[0]);
    }
  };

  const startTaskTimer = (task: AssessmentTask) => {
    if (task.timeLimit) {
      setTimeLeft(task.timeLimit);
      timerInterval.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTaskComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const stopTaskTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        handleAudioResponse(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      recordingInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording Started",
        description: "Speak your response clearly."
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Recording Failed",
        description: "Please check microphone permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
        recordingInterval.current = null;
      }
    }
  };

  const handleAudioResponse = (audioBlob: Blob) => {
    const response: AssessmentResponse = {
      taskId: tasks[currentTask].id,
      type: 'audio',
      content: audioBlob,
      timestamp: Date.now(),
      duration: recordingDuration
    };
    
    setResponses(prev => [...prev, response]);
    toast({
      title: "Audio Response Recorded",
      description: `${recordingDuration} seconds recorded.`
    });
  };

  const handleTextResponse = () => {
    if (textResponse.trim()) {
      const response: AssessmentResponse = {
        taskId: tasks[currentTask].id,
        type: 'text',
        content: textResponse,
        timestamp: Date.now()
      };
      
      setResponses(prev => [...prev, response]);
      setTextResponse('');
      
      toast({
        title: "Text Response Saved",
        description: "Response recorded successfully."
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const response: AssessmentResponse = {
        taskId: tasks[currentTask].id,
        type: 'file',
        content: file,
        timestamp: Date.now()
      };
      
      setResponses(prev => [...prev, response]);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully.`
      });
    }
  }, [tasks, currentTask]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    maxFiles: 1
  });

  const handleTaskComplete = () => {
    stopTaskTimer();
    
    if (currentTask < tasks.length - 1) {
      setCurrentTask(prev => prev + 1);
      startTaskTimer(tasks[currentTask + 1]);
      setTextResponse('');
    } else {
      completeAssessment();
    }
  };

  const completeAssessment = async () => {
    setAssessmentState('completed');
    
    try {
      const response = await apiRequest('POST', '/api/multi-modal/assessment/complete', {
        sessionId,
        responses: responses.map(r => ({
          ...r,
          content: r.type === 'audio' || r.type === 'file' ? 'binary_data' : r.content
        }))
      });
      
      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Assessment Complete!",
        description: "Your comprehensive cognitive profile has been generated."
      });
    } catch (error) {
      console.error('Failed to complete assessment:', error);
      // Generate demo result
      setResult({
        sessionId: 'demo',
        overallScore: 742,
        modalityScores: {
          text: 785,
          audio: 720,
          visual: 760,
          multimodal: 701
        },
        cognitiveProfile: {
          verbalReasoning: 78,
          visualProcessing: 82,
          auditoryProcessing: 75,
          multimodalIntegration: 70,
          creativeProblemSolving: 85
        },
        recommendations: [
          "Strong verbal reasoning abilities - consider advanced analytical roles",
          "Excellent visual processing - suitable for design and spatial tasks",
          "Good multimodal integration - effective in complex information environments"
        ],
        detailedAnalysis: "Your cognitive profile shows strong analytical and creative capabilities with particularly high performance in visual-spatial processing and verbal reasoning domains."
      });
    }
  };

  const task = tasks[currentTask];
  const progress = tasks.length > 0 ? ((currentTask + 1) / tasks.length) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getModalityIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="w-5 h-5" />;
      case 'audio': return <Headphones className="w-5 h-5" />;
      case 'visual': return <Eye className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'multimodal': return <Brain className="w-5 h-5" />;
      default: return <MessageSquare className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
            <Brain className="text-purple-500" />
            Multi-Modal Assessment
            <Zap className="text-yellow-500" />
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comprehensive cognitive evaluation across multiple sensory modalities
          </p>
        </div>

        {assessmentState === 'setup' && (
          <Card>
            <CardHeader>
              <CardTitle>Multi-Modal Cognitive Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Assessment Includes:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Verbal Reasoning & Text Analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-green-500" />
                      <span>Auditory Pattern Recognition</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-500" />
                      <span>Visual-Spatial Processing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-orange-500" />
                      <span>Cross-Modal Integration</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">What You'll Need:</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Microphone for audio responses</li>
                    <li>• Speakers or headphones</li>
                    <li>• Webcam (optional)</li>
                    <li>• Quiet environment</li>
                    <li>• Approximately 20-30 minutes</li>
                  </ul>
                </div>
              </div>
              
              <Button onClick={startAssessment} size="lg" className="w-full">
                Begin Assessment
              </Button>
            </CardContent>
          </Card>
        )}

        {assessmentState === 'active' && task && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getModalityIcon(task.type)}
                    <h2 className="text-xl font-semibold">{task.title}</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    {timeLeft > 0 && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-500">{formatTime(timeLeft)}</p>
                        <p className="text-xs text-gray-500">Time Left</p>
                      </div>
                    )}
                    <Badge variant="secondary">
                      {currentTask + 1} of {tasks.length}
                    </Badge>
                  </div>
                </div>
                <Progress value={progress} className="w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{task.description}</p>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="font-medium">{task.instruction}</p>
                  </div>
                </div>

                {task.mediaUrl && (
                  <div className="border rounded-lg p-4">
                    {task.type === 'audio' && (
                      <audio controls className="w-full">
                        <source src={task.mediaUrl} type="audio/mpeg" />
                      </audio>
                    )}
                    {task.type === 'visual' && (
                      <img src={task.mediaUrl} alt="Assessment visual" className="max-w-full h-auto" />
                    )}
                    {task.type === 'video' && (
                      <video controls className="w-full max-w-md">
                        <source src={task.mediaUrl} type="video/mp4" />
                      </video>
                    )}
                  </div>
                )}

                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="text">Text Response</TabsTrigger>
                    <TabsTrigger value="audio">Audio Response</TabsTrigger>
                    <TabsTrigger value="file">File Upload</TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <Label htmlFor="text-response">Written Response</Label>
                      <Textarea
                        id="text-response"
                        placeholder="Type your detailed response here..."
                        value={textResponse}
                        onChange={(e) => setTextResponse(e.target.value)}
                        rows={6}
                        className="mt-2"
                      />
                    </div>
                    <Button 
                      onClick={handleTextResponse} 
                      disabled={!textResponse.trim()}
                    >
                      Submit Text Response
                    </Button>
                  </TabsContent>

                  <TabsContent value="audio" className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        variant={isRecording ? "destructive" : "default"}
                        size="lg"
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="w-4 h-4 mr-2" />
                            Stop Recording ({recordingDuration}s)
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-2" />
                            Start Recording
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {isRecording && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span>Recording... Speak clearly into your microphone</span>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="file" className="space-y-4">
                    <div
                      {...getRootProps()}
                      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                        isDragActive 
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg mb-2">
                        {isDragActive 
                          ? "Drop the file here..." 
                          : "Drag & drop a file here, or click to select"
                        }
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports images, videos, and audio files
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Responses saved: {responses.filter(r => r.taskId === task.id).length}
                  </p>
                  <Button onClick={handleTaskComplete} variant="outline">
                    {currentTask < tasks.length - 1 ? 'Next Task' : 'Complete Assessment'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {assessmentState === 'completed' && result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Assessment Complete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{result.overallScore}</div>
                <p className="text-gray-600 dark:text-gray-300">Overall EIQ Score</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Modality Scores</h3>
                  <div className="space-y-2">
                    {Object.entries(result.modalityScores).map(([modality, score]) => (
                      <div key={modality} className="flex justify-between items-center">
                        <span className="capitalize">{modality}</span>
                        <Badge variant="secondary">{score}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Cognitive Profile</h3>
                  <div className="space-y-2">
                    {Object.entries(result.cognitiveProfile).map(([skill, score]) => (
                      <div key={skill}>
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span>{score}%</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">Detailed Analysis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{result.detailedAnalysis}</p>
              </div>

              <div className="flex justify-center">
                <Button onClick={() => window.location.reload()} size="lg">
                  Take Another Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}