import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import EiQLogo from "@/components/common/EiQLogo";

export default function UsernameSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{
    isValid: boolean;
    error?: string;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<{
    firstName?: string;
    lastName?: string;
    displayName?: string;
  }>({});

  useEffect(() => {
    // Get user info for generating suggestions
    const fetchUserInfo = async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/user");
        setUserInfo({
          firstName: response.firstName,
          lastName: response.lastName,
          displayName: response.displayName
        });

        // Generate username suggestions
        const suggestResponse = await apiRequest("POST", "/api/auth/username-suggestions", {
          firstName: response.firstName,
          lastName: response.lastName
        });
        setSuggestions(suggestResponse.suggestions || []);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus(null);
      return;
    }

    setIsChecking(true);
    try {
      const response = await apiRequest("POST", "/api/auth/check-username", { username });
      setUsernameStatus(response);
    } catch (error) {
      setUsernameStatus({ isValid: false, error: "Error checking username" });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => checkUsername(username), 500);
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !usernameStatus?.isValid) return;

    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/set-username", { username });
      
      toast({
        title: "Screen name set!",
        description: `Welcome, ${username}! Your screen name has been saved.`
      });
      
      setTimeout(() => setLocation("/onboarding"), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set screen name. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setUsername(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <EiQLogo size="lg" variant="full" />
          </div>
          <CardTitle>Choose Your Screen Name</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Hello {userInfo.firstName}! Choose a unique screen name that others will see.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Screen Name</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your screen name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  className="pr-10"
                  maxLength={20}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {isChecking ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  ) : usernameStatus?.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : usernameStatus && !usernameStatus.isValid ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : null}
                </div>
              </div>
              
              {usernameStatus && !usernameStatus.isValid && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {usernameStatus.error}
                  </AlertDescription>
                </Alert>
              )}
              
              <p className="text-xs text-gray-500">
                3-20 characters, letters, numbers, underscores, and hyphens only
              </p>
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-2">
                <Label>Suggested Names</Label>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => selectSuggestion(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!username || !usernameStatus?.isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Screen Name...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}