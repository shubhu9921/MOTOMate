/**
 * Analytics utility to track meaningful conversion events.
 * Currently uses console.log as a placeholder.
 * Can be easily swapped with Google Analytics, Mixpanel, or PostHog.
 */

export const AnalyticsEvent = {
  HOMEPAGE_VIEW: 'homepage_view',
  SERVICE_VIEW: 'service_view',
  SERVICE_SELECTED: 'service_selected',
  VEHICLE_SELECTED: 'vehicle_selected',
  BOOKING_STARTED: 'booking_started',
  BOOKING_STEP_COMPLETED: 'booking_step_completed',
  BOOKING_COMPLETED: 'booking_completed',
};

export const trackEvent = (eventName, eventData = {}) => {
  // Prevent tracking of sensitive data
  const safeData = { ...eventData };
  delete safeData.password;
  delete safeData.token;
  delete safeData.jwt;
  delete safeData.creditCard;

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics Track] ${eventName}`, safeData);
  }

  // TODO: Add actual analytics provider integration here (e.g., window.gtag)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, safeData);
  }
};
