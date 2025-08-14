import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import EiQLogo from "@/components/common/EiQLogo";

export default function CheckUsername() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      // Check if user has set their username
      if (user.usernameSet) {
        // User already has a username, redirect to main app
        setLocation("/");
      } else {
        // User needs to set up their username
        setLocation("/username-setup");
      }
    }
  }, [user, isLoading, setLocation]);

  // Show loading while checking
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <EiQLogo size="lg" variant="full" />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Setting up your account...
        </p>
      </div>
    </div>
  );
}