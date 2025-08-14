/**
 * Live User Tracking Hook
 * Real-time behavior tracking for AI learning and analytics
 */

import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

interface TrackingConfig {
  userId?: string;
  sessionId: string;
  enableScrollTracking?: boolean;
  enableClickTracking?: boolean;
  enableTimingTracking?: boolean;
  enableFocusTracking?: boolean;
}

interface UserInteractionEvent {
  eventType: 'page_view' | 'button_click' | 'form_submit' | 'assessment_start' | 'hint_request' | 'question_answer' | 'error' | 'completion';
  eventData: Record<string, any>;
  page: string;
  component?: string;
  responseTime?: number;
  timeOnPage?: number;
  scrollDepth?: number;
}

export function useLiveTracking(config: TrackingConfig) {
  const [location] = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const scrollDepthRef = useRef<number>(0);
  const clickPathRef = useRef<string[]>([]);
  const focusTimeRef = useRef<number>(0);
  const idleTimeRef = useRef<number>(0);
  const lastActivityRef = useRef<number>(Date.now());
  const isActiveRef = useRef<boolean>(true);

  // Generate unique session ID if not provided
  const sessionId = config.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Track user interaction event
   */
  const trackEvent = useCallback(async (event: UserInteractionEvent) => {
    try {
      const deviceInfo = {
        type: getDeviceType(),
        browser: getBrowserType(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };

      const enrichedEvent = {
        ...event,
        userId: config.userId,
        sessionId,
        page: location,
        timeOnPage: Math.floor((Date.now() - startTimeRef.current) / 1000),
        scrollDepth: scrollDepthRef.current,
        userAgent: navigator.userAgent,
        deviceInfo,
        eventData: {
          ...event.eventData,
          clickPath: clickPathRef.current,
          focusTime: focusTimeRef.current,
          idleTime: idleTimeRef.current,
          connectionSpeed: getConnectionSpeed(),
          timestamp: Date.now()
        }
      };

      await apiRequest('POST', '/api/analytics/track-behavior', enrichedEvent);

      console.log('[LIVE_TRACKING] Event tracked:', event.eventType);
    } catch (error) {
      console.error('[LIVE_TRACKING] Failed to track event:', error);
    }
  }, [config.userId, sessionId, location]);

  /**
   * Track page view
   */
  const trackPageView = useCallback(() => {
    startTimeRef.current = Date.now();
    scrollDepthRef.current = 0;
    clickPathRef.current = [];

    trackEvent({
      eventType: 'page_view',
      eventData: {
        referrer: document.referrer,
        timestamp: Date.now()
      },
      page: location
    });
  }, [location, trackEvent]);

  /**
   * Track button click
   */
  const trackClick = useCallback((element: string, data: Record<string, any> = {}) => {
    clickPathRef.current.push(element);
    
    trackEvent({
      eventType: 'button_click',
      eventData: {
        element,
        ...data,
        clickSequence: clickPathRef.current.length
      },
      page: location,
      component: element
    });
  }, [location, trackEvent]);

  /**
   * Track form submission
   */
  const trackFormSubmit = useCallback((formName: string, data: Record<string, any> = {}) => {
    trackEvent({
      eventType: 'form_submit',
      eventData: {
        formName,
        ...data
      },
      page: location,
      component: formName
    });
  }, [location, trackEvent]);

  /**
   * Track assessment events
   */
  const trackAssessment = useCallback((assessmentEvent: 'start' | 'answer' | 'hint' | 'complete', data: Record<string, any> = {}) => {
    const eventTypeMap = {
      start: 'assessment_start' as const,
      answer: 'question_answer' as const,
      hint: 'hint_request' as const,
      complete: 'completion' as const
    };

    trackEvent({
      eventType: eventTypeMap[assessmentEvent],
      eventData: data,
      page: location,
      component: 'assessment-engine'
    });
  }, [location, trackEvent]);

  /**
   * Track errors
   */
  const trackError = useCallback((error: Error, context: Record<string, any> = {}) => {
    trackEvent({
      eventType: 'error',
      eventData: {
        errorMessage: error.message,
        errorStack: error.stack,
        ...context
      },
      page: location
    });
  }, [location, trackEvent]);

  // Set up scroll tracking
  useEffect(() => {
    if (!config.enableScrollTracking) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScrollDepth = Math.floor((scrollTop / scrollHeight) * 100);
      
      if (currentScrollDepth > scrollDepthRef.current) {
        scrollDepthRef.current = currentScrollDepth;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [config.enableScrollTracking]);

  // Set up click tracking
  useEffect(() => {
    if (!config.enableClickTracking) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const elementInfo = getElementIdentifier(target);
      
      if (elementInfo) {
        clickPathRef.current.push(elementInfo);
        
        // Keep only last 20 clicks to prevent memory issues
        if (clickPathRef.current.length > 20) {
          clickPathRef.current = clickPathRef.current.slice(-20);
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [config.enableClickTracking]);

  // Set up focus and idle tracking
  useEffect(() => {
    if (!config.enableFocusTracking) return;

    const updateActivity = () => {
      const now = Date.now();
      if (isActiveRef.current) {
        focusTimeRef.current += now - lastActivityRef.current;
      } else {
        idleTimeRef.current += now - lastActivityRef.current;
      }
      lastActivityRef.current = now;
    };

    const handleFocus = () => {
      updateActivity();
      isActiveRef.current = true;
    };

    const handleBlur = () => {
      updateActivity();
      isActiveRef.current = false;
    };

    const handleActivity = () => {
      updateActivity();
      isActiveRef.current = true;
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [config.enableFocusTracking]);

  // Track page view on location change
  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  // Send final page metrics on unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      // Use sendBeacon for reliable data sending on page unload
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          userId: config.userId,
          sessionId,
          eventType: 'page_exit',
          eventData: {
            timeOnPage,
            scrollDepth: scrollDepthRef.current,
            clickPath: clickPathRef.current,
            focusTime: focusTimeRef.current,
            idleTime: idleTimeRef.current
          },
          page: location
        });

        navigator.sendBeacon('/api/analytics/track-behavior', data);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [config.userId, sessionId, location]);

  return {
    trackEvent,
    trackClick,
    trackFormSubmit,
    trackAssessment,
    trackError,
    sessionId,
    getAnalytics: () => ({
      timeOnPage: Math.floor((Date.now() - startTimeRef.current) / 1000),
      scrollDepth: scrollDepthRef.current,
      clickCount: clickPathRef.current.length,
      focusTime: focusTimeRef.current,
      idleTime: idleTimeRef.current
    })
  };
}

// Utility functions

function getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getBrowserType(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'chrome';
  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('Safari')) return 'safari';
  if (ua.includes('Edge')) return 'edge';
  return 'unknown';
}

function getConnectionSpeed(): string {
  // @ts-ignore - Navigator.connection is experimental
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    return connection.effectiveType || 'unknown';
  }
  return 'unknown';
}

function getElementIdentifier(element: HTMLElement): string | null {
  // Priority: id, data-testid, className, tagName
  if (element.id) return `#${element.id}`;
  if (element.dataset.testid) return `[data-testid="${element.dataset.testid}"]`;
  if (element.className) return `.${element.className.split(' ')[0]}`;
  return element.tagName.toLowerCase();
}

// Export tracking configuration helper
export function createTrackingConfig(userId?: string, options: Partial<TrackingConfig> = {}): TrackingConfig {
  return {
    userId,
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    enableScrollTracking: true,
    enableClickTracking: true,
    enableTimingTracking: true,
    enableFocusTracking: true,
    ...options
  };
}