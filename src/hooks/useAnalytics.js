import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA4_ID = import.meta.env.VITE_GA4_ID || "G-6SDBFM0M8K";

/**
 * Google Analytics 4 hook for tracking page views and custom events
 */

// Track page views on route changes
export function usePageViews() {
  const location = useLocation();

  useEffect(() => {
    if (typeof gtag === "function" && GA4_ID) {
      gtag("config", GA4_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}

// Track custom events
export function trackEvent(eventName, eventParams = {}) {
  if (typeof gtag === "function" && GA4_ID) {
    gtag("event", eventName, eventParams);
  } else {
    console.log(`[GA4 Event] ${eventName}:`, eventParams);
  }
}

// Predefined event tracking helpers
export const trackEvents = {
  // Booking funnel
  bookingStarted: () =>
    trackEvent("booking_started", { event_category: "booking" }),

  bookingStepCompleted: (stepNumber, stepName) =>
    trackEvent("booking_step_completed", {
      event_category: "booking",
      step_number: stepNumber,
      step_name: stepName,
    }),

  bookingCompleted: (bookingReference, totalValue) =>
    trackEvent("booking_completed", {
      event_category: "booking",
      booking_reference: bookingReference,
      value: totalValue,
      currency: "PHP",
    }),

  // Service interactions
  serviceViewed: (serviceName) =>
    trackEvent("service_viewed", {
      event_category: "engagement",
      service_name: serviceName,
    }),

  serviceSelected: (serviceName) =>
    trackEvent("service_selected", {
      event_category: "booking",
      service_name: serviceName,
    }),

  // Location interactions
  locationSelected: (locationName) =>
    trackEvent("location_selected", {
      event_category: "booking",
      location_name: locationName,
    }),

  locationClicked: (locationName) =>
    trackEvent("location_clicked", {
      event_category: "engagement",
      location_name: locationName,
    }),

  // Contact interactions
  callClicked: (phoneNumber) =>
    trackEvent("call_clicked", {
      event_category: "contact",
      phone_number: phoneNumber,
    }),

  emailClicked: (emailAddress) =>
    trackEvent("email_clicked", {
      event_category: "contact",
      email_address: emailAddress,
    }),

  contactFormSubmitted: () =>
    trackEvent("contact_form_submitted", { event_category: "contact" }),

  // Social interactions
  socialClicked: (platform) =>
    trackEvent("social_clicked", {
      event_category: "engagement",
      platform: platform,
    }),

  // CTA buttons
  ctaClicked: (ctaName, location) =>
    trackEvent("cta_clicked", {
      event_category: "engagement",
      cta_name: ctaName,
      location: location,
    }),

  // Gallery interactions
  galleryImageClicked: (imageName) =>
    trackEvent("gallery_image_clicked", {
      event_category: "engagement",
      image_name: imageName,
    }),

  // Promotions
  promotionViewed: (promotionName) =>
    trackEvent("promotion_viewed", {
      event_category: "promotion",
      promotion_name: promotionName,
    }),

  promotionClicked: (promotionName) =>
    trackEvent("promotion_clicked", {
      event_category: "promotion",
      promotion_name: promotionName,
    }),

  // Testimonials
  testimonialViewed: (reviewerName) =>
    trackEvent("testimonial_viewed", {
      event_category: "engagement",
      reviewer_name: reviewerName,
    }),

  // PWA
  pwaInstallPrompted: () =>
    trackEvent("pwa_install_prompted", { event_category: "pwa" }),

  pwaInstalled: () =>
    trackEvent("pwa_installed", { event_category: "pwa" }),
};
