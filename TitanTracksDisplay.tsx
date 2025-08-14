import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { BookOpen, Users, Trophy, Star, Target, ArrowRight } from "lucide-react";

interface TitanTrack {
  name: string;
  displayName: string;
  description: string;
  audience: string;
  focus: string;
  ageRange: {
    min: number;
    max: number;
    grades?: string;
  };
  focusAreas: string[];
  learningObjectives: string[];
  prerequisites: string[];
  industryPartners: string[];
}

interface TitanTracksDisplayProps {
  showAssignButton?: boolean;
  userAge?: number;
  userGrade?: string;
}

export function TitanTracksDisplay({ showAssignButton = false, userAge, userGrade }: TitanTracksDisplayProps) {
  const { toast } = useToast();
  const [selectedTrack, setSelectedTrack] = useState<TitanTrack | null>(null);

  const { data: tracksData, isLoading: tracksLoading } = useQuery({
    queryKey: ['/api/tracks/all'],
    enabled: true
  });

  const { data: myTrackData, isLoading: myTrackLoading } = useQuery({
    queryKey: ['/api/tracks/my-track'],
    enabled: showAssignButton
  });

  const assignTrackMutation = useMutation({
    mutationFn: async (trackName: string) => {
      const response = await fetch('/api/tracks/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackName,
          age: userAge,
          gradeLevel: userGrade
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign track');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Track Assigned!",
        description: `You've been assigned to ${data.track.displayName}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tracks/my-track'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Assignment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const tracks = (tracksData as any)?.tracks || [];
  const currentTrack = (myTrackData as any)?.track;

  const getTrackIcon = (trackName: string) => {
    switch (trackName) {
      case 'JOBS_COOK': return '🍎';
      case 'PAGE_PICHAI': return '🔍';
      case 'GATES_BALLMER': return '🚪';
      case 'ZUCK_HUANG': return '🚀';
      case 'ELLISON_CATZ': return '💼';
      case 'BUFFET_APFEL': return '🎯';
      default: return '⭐';
    }
  };

  const getTrackColor = (trackName: string) => {
    switch (trackName) {
      case 'JOBS_COOK': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20';
      case 'PAGE_PICHAI': return 'bg-green-50 border-green-200 dark:bg-green-900/20';
      case 'GATES_BALLMER': return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20';
      case 'ZUCK_HUANG': return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20';
      case 'ELLISON_CATZ': return 'bg-red-50 border-red-200 dark:bg-red-900/20';
      case 'BUFFET_APFEL': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20';
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20';
    }
  };

  if (tracksLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Track Display */}
      {currentTrack && (
        <Card className="border-2 border-green-200 bg-green-50/50 dark:bg-green-900/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getTrackIcon(currentTrack.name)}</div>
              <div>
                <CardTitle className="text-green-800 dark:text-green-200">
                  Your Current Track: {currentTrack.displayName}
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  {currentTrack.audience} • {currentTrack.focus}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
              <Trophy className="h-4 w-4" />
              <span>Active Learning Track</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Tracks Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track: TitanTrack) => (
          <Card 
            key={track.name} 
            className={`transition-all hover:shadow-lg ${getTrackColor(track.name)} ${
              currentTrack?.name === track.name ? 'ring-2 ring-green-400' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getTrackIcon(track.name)}</div>
                  <div>
                    <CardTitle className="text-lg leading-tight">
                      {track.displayName}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {track.audience}
                    </Badge>
                  </div>
                </div>
                {currentTrack?.name === track.name && (
                  <Badge className="bg-green-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Current
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed">
                {track.description}
              </CardDescription>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Focus Areas
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {track.focusAreas.slice(0, 3).map((area, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                        {area}
                      </Badge>
                    ))}
                    {track.focusAreas.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        +{track.focusAreas.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Industry Partners
                  </h4>
                  <div className="text-xs text-muted-foreground">
                    {track.industryPartners.slice(0, 2).join(', ')}
                    {track.industryPartners.length > 2 && ` +${track.industryPartners.length - 2} more`}
                  </div>
                </div>

                {showAssignButton && currentTrack?.name !== track.name && (
                  <Button
                    onClick={() => assignTrackMutation.mutate(track.name)}
                    disabled={assignTrackMutation.isPending}
                    className="w-full mt-4"
                    variant="outline"
                  >
                    {assignTrackMutation.isPending ? (
                      "Assigning..."
                    ) : (
                      <>
                        Switch to This Track
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTrack(track)}
                  className="w-full text-xs"
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Track Details Modal (Simple Version) */}
      {selectedTrack && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getTrackIcon(selectedTrack.name)}</div>
                  <div>
                    <CardTitle>{selectedTrack.displayName}</CardTitle>
                    <CardDescription>{selectedTrack.audience}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTrack(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{selectedTrack.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Focus Areas</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTrack.focusAreas.map((area, index) => (
                    <Badge key={index} variant="secondary" className="justify-start">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Learning Objectives</h3>
                <ul className="text-sm space-y-1">
                  {selectedTrack.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Industry Partners</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTrack.industryPartners.map((partner, index) => (
                    <Badge key={index} variant="outline">
                      {partner}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedTrack.prerequisites.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Prerequisites</h3>
                  <ul className="text-sm space-y-1">
                    {selectedTrack.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">•</span>
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default TitanTracksDisplay;