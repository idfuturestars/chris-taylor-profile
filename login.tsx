import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import EiQLogo from "@/components/common/EiQLogo";

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <EiQLogo size="lg" variant="full" />
          </div>
          <CardTitle>Welcome to EIQ</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Sign in to access your personalized learning experience
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              className="w-full"
              variant="default"
            >
              Continue with Google
            </Button>
            
            <div className="text-center text-xs text-gray-500">
              By signing in, you agree to our terms of service and privacy policy.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}