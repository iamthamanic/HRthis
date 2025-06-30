import React, { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function withAnalytics(trackingId: string) {
  return function <P>(Component: React.ComponentType<P>) {
    return function AnalyticsWrapper(props: P) {
      useEffect(() => {
        console.log(`Component görüntülendi: ${Component.displayName || "Component"}`);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "page_view",
          page_path: window.location.pathname,
          component_name: Component.displayName,
          tracking_id: trackingId,
        });
      }, []);

      return <Component {...props} />;
    };
  };
}

// Kullanımı :
// const EnhancedComponent = withAnalytics("tracking-id")(Component);
