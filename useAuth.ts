import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    // Circuit breaker: if we get 401, consider it resolved (not authenticated)
    queryFn: async () => {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
      });
      
      // If 401, user is not authenticated - return null instead of throwing
      if (response.status === 401) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
  };
}