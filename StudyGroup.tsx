import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Users, MessageCircle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyGroupProps {
  userId: string;
}

export default function StudyGroup({ userId }: StudyGroupProps) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [feedItems, setFeedItems] = useState([
    {
      id: 1,
      title: "Python Fundamentals",
      content: "New lesson: Object-Oriented Programming basics",
      time: "2 minutes ago",
      color: "border-primary"
    },
    {
      id: 2,
      title: "Mathematics Review",
      content: "Practice set updated: Calculus applications in ML",
      time: "15 minutes ago",
      color: "border-orange-500"
    },
    {
      id: 3,
      title: "AI Ethics Discussion",
      content: "New forum post: Bias in recommendation systems",
      time: "1 hour ago",
      color: "border-blue-500"
    }
  ]);

  const { data: studyGroups = [] } = useQuery({
    queryKey: ["/api/study-groups"],
    enabled: !!userId
  });

  const { data: courseFeed = [] } = useQuery({
    queryKey: ["/api/course-feed"],
    enabled: !!userId
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?token=${encodeURIComponent(token)}&room=general`;
    
    const websocket = new WebSocket(wsUrl);
    
    websocket.onopen = () => {
      console.log("WebSocket connected");
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);
      // Handle incoming real-time updates
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
      setWs(null);
    };

    return () => {
      websocket.close();
    };
  }, [userId]);

  const activeStudyGroup = {
    name: "AI Ethics & Society",
    topic: "AI Ethics",
    members: [
      { id: 1, initials: "JD", name: "John Doe" },
      { id: 2, initials: "SM", name: "Sarah Miller" },
      { id: 3, initials: "MJ", name: "Mike Johnson" }
    ],
    totalMembers: 5,
    progress: 85
  };

  return (
    <>
      {/* Live Course Feed */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Live Course Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedItems.map((item) => (
              <div key={item.id} className={cn("border-l-4 pl-4 py-2", item.color)}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={cn("w-2 h-2 rounded-full", 
                    item.color === "border-primary" ? "bg-primary" :
                    item.color === "border-orange-500" ? "bg-orange-500" : 
                    "bg-blue-500"
                  )}></span>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.content}</p>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
            
            <div className="w-full h-32 bg-muted rounded-lg mt-4 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Collaborative Learning Environment</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Group Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Study Group Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Active Study Group */}
            <Card className="bg-muted border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{activeStudyGroup.name}</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-xs text-muted-foreground">Active</span>
                  </div>
                </div>
                
                <div className="w-full h-20 bg-card rounded mb-3 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Group Collaboration Space</span>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  {activeStudyGroup.members.map((member) => (
                    <Avatar key={member.id} className="w-8 h-8">
                      <AvatarFallback className="bg-muted-foreground text-background text-xs">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {activeStudyGroup.totalMembers > activeStudyGroup.members.length && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-muted-foreground text-background text-xs">
                        +{activeStudyGroup.totalMembers - activeStudyGroup.members.length}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {activeStudyGroup.totalMembers} members • Active discussion
                </p>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => ws?.send(JSON.stringify({ type: "join_discussion", groupId: "ai-ethics" }))}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Join Discussion
                </Button>
              </CardContent>
            </Card>

            {/* Group Progress */}
            <Card className="bg-muted border-border">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Group Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reasoning Assessment</span>
                    <span className="text-sm text-primary">{activeStudyGroup.progress}%</span>
                  </div>
                  <Progress value={activeStudyGroup.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
