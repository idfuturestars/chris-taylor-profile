import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  MessageCircle, 
  Video, 
  Monitor, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  Send, 
  UserPlus, 
  Settings,
  FileText,
  Code,
  Calculator,
  Share2,
  Clock,
  CheckCircle,
  Circle
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CollaborationRoom {
  id: string;
  name: string;
  type: 'study_session' | 'assessment' | 'project' | 'tutoring';
  participants: Participant[];
  currentActivity: string;
  maxParticipants: number;
  isPrivate: boolean;
  createdAt: string;
  createdBy: string;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'host' | 'collaborator' | 'observer';
  status: 'online' | 'away' | 'busy';
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  lastSeen: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'system' | 'file' | 'code';
  reactions?: { [emoji: string]: string[] };
}

interface SharedDocument {
  id: string;
  title: string;
  type: 'whiteboard' | 'code' | 'assessment' | 'notes';
  content: string;
  lastModified: string;
  modifiedBy: string;
  collaborators: string[];
}

export default function RealTimeCollaboration() {
  const [currentRoom, setCurrentRoom] = useState<CollaborationRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch active collaboration rooms
  const { data: activeRooms, isLoading } = useQuery({
    queryKey: ["/api/collaboration/rooms"],
  });

  const { data: sharedDocuments } = useQuery({
    queryKey: ["/api/collaboration/documents"],
    enabled: !!currentRoom,
  });

  // WebSocket connection
  useEffect(() => {
    if (currentRoom) {
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setConnectionStatus('connected');
        setSocket(ws);
        
        // Join room
        ws.send(JSON.stringify({
          type: 'join_room',
          roomId: currentRoom.id,
          userId: 'current_user_id' // Would come from auth context
        }));
        
        toast({
          title: "Connected",
          description: `Joined ${currentRoom.name} collaboration room`,
        });
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        setSocket(null);
      };

      ws.onerror = () => {
        setConnectionStatus('disconnected');
        toast({
          title: "Connection Error",
          description: "Failed to connect to collaboration server",
          variant: "destructive",
        });
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    }
  }, [currentRoom, toast]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'chat_message':
        setMessages(prev => [...prev, data.message]);
        break;
      case 'user_joined':
        toast({
          title: "User Joined",
          description: `${data.userName} joined the room`,
        });
        break;
      case 'user_left':
        toast({
          title: "User Left", 
          description: `${data.userName} left the room`,
        });
        break;
      case 'document_update':
        queryClient.invalidateQueries({ queryKey: ["/api/collaboration/documents"] });
        break;
      case 'screen_share_started':
        toast({
          title: "Screen Share",
          description: `${data.userName} started screen sharing`,
        });
        break;
    }
  };

  // Join room mutation
  const joinRoomMutation = useMutation({
    mutationFn: async (roomId: string) => {
      return apiRequest("POST", `/api/collaboration/rooms/${roomId}/join`);
    },
    onSuccess: (room) => {
      setCurrentRoom(room);
    },
  });

  // Create room mutation
  const createRoomMutation = useMutation({
    mutationFn: async (roomData: { name: string; type: string; isPrivate: boolean }) => {
      return apiRequest("POST", "/api/collaboration/rooms", roomData);
    },
    onSuccess: (room) => {
      setCurrentRoom(room);
      queryClient.invalidateQueries({ queryKey: ["/api/collaboration/rooms"] });
    },
  });

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || connectionStatus !== 'connected') return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: 'current_user_id',
      userName: 'Current User',
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    socket.send(JSON.stringify({
      type: 'chat_message',
      roomId: currentRoom?.id,
      message
    }));

    setNewMessage("");
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (socket && connectionStatus === 'connected') {
      socket.send(JSON.stringify({
        type: 'audio_toggle',
        roomId: currentRoom?.id,
        enabled: !isAudioEnabled
      }));
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (socket && connectionStatus === 'connected') {
      socket.send(JSON.stringify({
        type: 'video_toggle',
        roomId: currentRoom?.id,
        enabled: !isVideoEnabled
      }));
    }
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    if (socket && connectionStatus === 'connected') {
      socket.send(JSON.stringify({
        type: 'screen_share_toggle',
        roomId: currentRoom?.id,
        enabled: !isScreenSharing
      }));
    }
  };

  // Mock data
  const mockRooms: CollaborationRoom[] = [
    {
      id: "room_1",
      name: "Advanced Mathematics Study Group",
      type: "study_session",
      participants: [
        { id: "1", name: "Alice Chen", role: "host", status: "online", isAudioEnabled: true, isVideoEnabled: false, isScreenSharing: false, lastSeen: "now" },
        { id: "2", name: "Bob Smith", role: "collaborator", status: "online", isAudioEnabled: true, isVideoEnabled: true, isScreenSharing: false, lastSeen: "now" },
        { id: "3", name: "Carol Davis", role: "collaborator", status: "away", isAudioEnabled: false, isVideoEnabled: false, isScreenSharing: false, lastSeen: "5 min ago" }
      ],
      currentActivity: "Working on calculus problems",
      maxParticipants: 8,
      isPrivate: false,
      createdAt: new Date().toISOString(),
      createdBy: "Alice Chen"
    },
    {
      id: "room_2", 
      name: "System Design Interview Prep",
      type: "project",
      participants: [
        { id: "4", name: "David Wilson", role: "host", status: "online", isAudioEnabled: true, isVideoEnabled: true, isScreenSharing: true, lastSeen: "now" },
        { id: "5", name: "Eva Rodriguez", role: "collaborator", status: "online", isAudioEnabled: true, isVideoEnabled: false, isScreenSharing: false, lastSeen: "now" }
      ],
      currentActivity: "Designing distributed systems",
      maxParticipants: 4,
      isPrivate: true,
      createdAt: new Date().toISOString(),
      createdBy: "David Wilson"
    }
  ];

  const mockMessages: ChatMessage[] = [
    {
      id: "1",
      userId: "1",
      userName: "Alice Chen",
      message: "Welcome everyone! Let's start with the integration problems from chapter 12.",
      timestamp: "2025-01-08T16:30:00Z",
      type: "text"
    },
    {
      id: "2",
      userId: "2", 
      userName: "Bob Smith",
      message: "Great! I've been struggling with problem 15. Could we work through that together?",
      timestamp: "2025-01-08T16:31:00Z",
      type: "text"
    },
    {
      id: "3",
      userId: "system",
      userName: "System",
      message: "Carol Davis joined the room",
      timestamp: "2025-01-08T16:32:00Z",
      type: "system"
    }
  ];

  const mockDocuments: SharedDocument[] = [
    {
      id: "doc_1",
      title: "Calculus Problem Set",
      type: "whiteboard",
      content: "Working on integration by parts...",
      lastModified: "2 minutes ago",
      modifiedBy: "Alice Chen",
      collaborators: ["Alice Chen", "Bob Smith", "Carol Davis"]
    },
    {
      id: "doc_2",
      title: "Study Notes - Chapter 12",
      type: "notes",
      content: "Key concepts and formulas...",
      lastModified: "5 minutes ago", 
      modifiedBy: "Bob Smith",
      collaborators: ["Alice Chen", "Bob Smith"]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-purple-500" />
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Real-Time Collaboration</h1>
                </div>
                <Badge variant="secondary" className="text-xs">Live Study Rooms</Badge>
              </div>
              <Button onClick={() => {
                createRoomMutation.mutate({
                  name: "New Study Room",
                  type: "study_session",
                  isPrivate: false
                });
              }}>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Room
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockRooms.map((room) => (
              <Card key={room.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => joinRoomMutation.mutate(room.id)}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <CardDescription className="capitalize">{room.type.replace('_', ' ')}</CardDescription>
                    </div>
                    <Badge variant={room.isPrivate ? "destructive" : "default"}>
                      {room.isPrivate ? "Private" : "Public"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{room.currentActivity}</p>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{room.participants.length}/{room.maxParticipants} participants</span>
                  </div>

                  <div className="flex -space-x-2">
                    {room.participants.slice(0, 4).map((participant) => (
                      <Avatar key={participant.id} className="border-2 border-white">
                        <AvatarFallback className="text-xs">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {room.participants.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                        +{room.participants.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-gray-500">Created by {room.createdBy}</span>
                    <Button size="sm" variant="outline">Join Room</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Room Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setCurrentRoom(null)}>
                ← Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{currentRoom.name}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{currentRoom.currentActivity}</p>
              </div>
              <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
                {connectionStatus}
              </Badge>
            </div>

            {/* Media Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant={isAudioEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleAudio}
              >
                {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={isVideoEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleVideo}
              >
                {isVideoEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={isScreenSharing ? "default" : "outline"}
                size="sm"
                onClick={toggleScreenShare}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="whiteboard" className="flex-1">
            <div className="border-b border-gray-200 dark:border-gray-700 px-4">
              <TabsList className="h-10">
                <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="code">Code Editor</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="whiteboard" className="flex-1 p-4">
              <div className="h-full bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Collaborative Whiteboard</h3>
                  <p className="text-gray-600 dark:text-gray-400">Real-time collaborative drawing and note-taking space</p>
                  <Button className="mt-4">Start Drawing</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="flex-1 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockDocuments.map((doc) => (
                  <Card key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{doc.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {doc.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{doc.content}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Modified {doc.lastModified}</span>
                          <span>by {doc.modifiedBy}</span>
                        </div>
                        <div className="flex -space-x-1">
                          {doc.collaborators.slice(0, 3).map((collaborator, index) => (
                            <Avatar key={index} className="w-6 h-6 border border-white">
                              <AvatarFallback className="text-xs">
                                {collaborator.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="code" className="flex-1 p-4">
              <div className="h-full bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-green-400" />
                    <span className="text-white font-medium">Collaborative Code Editor</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">JavaScript</Badge>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-800 rounded border h-96 p-4 font-mono text-sm text-green-400">
                  <div className="text-gray-500">// Collaborative coding session</div>
                  <div className="text-blue-300">function</div> <div className="text-yellow-300">calculateDistance</div>(x1, y1, x2, y2) {'{'}
                  <div className="pl-4">
                    <div className="text-blue-300">const</div> dx = x2 - x1;
                  </div>
                  <div className="pl-4">
                    <div className="text-blue-300">const</div> dy = y2 - y1;
                  </div>
                  <div className="pl-4">
                    <div className="text-blue-300">return</div> Math.sqrt(dx * dx + dy * dy);
                  </div>
                  {'}'}
                  <div className="mt-2 text-gray-500">// Type your code here...</div>
                  <div className="w-2 h-4 bg-green-400 animate-pulse"></div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assessment" className="flex-1 p-4">
              <div className="h-full bg-white dark:bg-gray-800 rounded-lg border flex items-center justify-center">
                <div className="text-center">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Collaborative Assessment</h3>
                  <p className="text-gray-600 dark:text-gray-400">Work together on practice problems and assessments</p>
                  <Button className="mt-4">Start Assessment</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          <Tabs defaultValue="chat" className="flex-1">
            <TabsList className="grid w-full grid-cols-2 m-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col px-4 pb-4">
              <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="space-y-3">
                  {mockMessages.map((message) => (
                    <div key={message.id} className={`${message.type === 'system' ? 'text-center' : ''}`}>
                      {message.type === 'system' ? (
                        <div className="text-sm text-gray-500 italic">{message.message}</div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {message.userName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{message.userName}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="text-sm ml-8">{message.message}</div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="flex space-x-2 mt-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="participants" className="flex-1 px-4 pb-4">
              <div className="space-y-3">
                {currentRoom.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{participant.name}</span>
                        <Badge variant="outline" className="text-xs">{participant.role}</Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <div className={`w-2 h-2 rounded-full ${
                          participant.status === 'online' ? 'bg-green-500' :
                          participant.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}></div>
                        <span>{participant.status}</span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {participant.isAudioEnabled ? (
                        <Mic className="h-3 w-3 text-green-500" />
                      ) : (
                        <MicOff className="h-3 w-3 text-gray-400" />
                      )}
                      {participant.isVideoEnabled ? (
                        <Camera className="h-3 w-3 text-green-500" />
                      ) : (
                        <CameraOff className="h-3 w-3 text-gray-400" />
                      )}
                      {participant.isScreenSharing && (
                        <Monitor className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}