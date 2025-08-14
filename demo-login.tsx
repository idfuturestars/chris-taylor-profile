import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import EiQLogo from "@/components/common/EiQLogo";

export default function DemoLogin() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      // Simply redirect to dashboard since demo auth is now automatic
      window.location.href = "/";
    } catch (error) {
      console.error("Demo login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <EiQLogo size="lg" variant="full" />
          <CardTitle className="text-2xl font-bold">
            Demo Access
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Click below to access the EiQ™ platform with a demo account
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Demo Account</Label>
              <Input value="Demo User" disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value="demo@eiq.com" disabled />
            </div>
          </div>
          
          <Button 
            onClick={handleDemoLogin}
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Enter Demo Account"}
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              This demo account includes sample data for testing the achievement system
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}