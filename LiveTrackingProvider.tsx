/**
 * Live Tracking Provider - Global user behavior tracking context
 */

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLiveTracking, createTrackingConfig } from '@/hooks/useLiveTracking';

interface LiveTrackingContextType {
  trackClick: (element: string, data?: Record<string, any>) => void;
  trackFormSubmit: (formName: string, data?: Record<string, any>) => void;
  trackAssessment: (assessmentEvent: 'start' | 'answer' | 'hint' | 'complete', data?: Record<string, any>) => void;
  trackError: (error: Error, context?: Record<string, any>) => void;
  sessionId: string;
  getAnalytics: () => any;
}

const LiveTrackingContext = createContext<LiveTrackingContextType | undefined>(undefined);

interface LiveTrackingProviderProps {
  children: ReactNode;
}

export function LiveTrackingProvider({ children }: LiveTrackingProviderProps) {
  // Get user ID from session-based auth or default to anonymous
  const getUserId = () => {
    // For now, return anonymous since we're using session-based auth
    // The server will track the actual user ID when authenticated
    return 'anonymous';
  };
  
  const tracking = useLiveTracking(
    createTrackingConfig(getUserId(), {
      enableScrollTracking: true,
      enableClickTracking: true,
      enableTimingTracking: true,
      enableFocusTracking: true
    })
  );

  // Track any unhandled errors globally
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      tracking.trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'javascript_error'
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      tracking.trackError(new Error(`Unhandled promise rejection: ${event.reason}`), {
        type: 'promise_rejection'
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [tracking]);

  return (
    <LiveTrackingContext.Provider value={tracking}>
      {children}
    </LiveTrackingContext.Provider>
  );
}

export function useLiveTrackingContext(): LiveTrackingContextType {
  const context = useContext(LiveTrackingContext);
  if (!context) {
    throw new Error('useLiveTrackingContext must be used within a LiveTrackingProvider');
  }
  return context;
}

// Export convenience hook for common tracking patterns
export function useQuickTracking() {
  const tracking = useLiveTrackingContext();

  return {
    // Track button clicks with automatic element detection
    trackButtonClick: (buttonName: string, metadata?: any) => {
      tracking.trackClick(`button-${buttonName}`, {
        buttonType: 'primary',
        ...metadata
      });
    },

    // Track form interactions
    trackFormInteraction: (formName: string, action: 'focus' | 'blur' | 'submit', field?: string) => {
      tracking.trackFormSubmit(`${formName}-${action}`, {
        field,
        action,
        timestamp: Date.now()
      });
    },

    // Track navigation events
    trackNavigation: (from: string, to: string, method: 'click' | 'programmatic') => {
      tracking.trackClick('navigation', {
        from,
        to,
        method,
        timestamp: Date.now()
      });
    },

    // Track assessment interactions with enhanced metadata
    trackAssessmentInteraction: (
      type: 'start' | 'answer' | 'hint' | 'complete',
      questionId?: string,
      metadata?: any
    ) => {
      tracking.trackAssessment(type, {
        questionId,
        timestamp: Date.now(),
        ...metadata
      });
    },

    // Track feature usage
    trackFeatureUsage: (featureName: string, action: string, metadata?: any) => {
      tracking.trackClick(`feature-${featureName}`, {
        action,
        feature: featureName,
        timestamp: Date.now(),
        ...metadata
      });
    },

    // Track performance metrics
    trackPerformance: (metric: string, value: number, unit: string = 'ms') => {
      tracking.trackClick('performance-metric', {
        metric,
        value,
        unit,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      });
    }
  };
}