// Next.js
import { type AppProps, type AppType } from "next/app";
import { Geist } from "next/font/google";
import { useRouter } from "next/router";

// React
import { useEffect } from "react";

// Navigation
import NProgress from "nprogress";
import "@/styles/nprogress.css";

// Styles
import "@/styles/globals.css";

// UI Components
import { Toaster } from "@/components/ui/sonner";

// Auth
import { SessionProvider } from "next-auth/react";

// Data Fetching
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// i18n
import { appWithTranslation } from "next-i18next";

// State Management
import { ReduxProvider } from "@/store/provider";

const geist = Geist({
  subsets: ["latin"],
});
const queryClient = new QueryClient();
const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      console.log("Locale changed to:", router.locale);
    }
  }, [router.isReady, router.locale]);

  // Sayfalar arası geçişte loading bar oluşturur.
  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      minimum: 0.1,
      easing: "ease",
      speed: 300,
    });

    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () => {
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
  }, [router.events]);

  return (
    <div className={geist.className}>
      <SessionProvider session={session}>
        <ReduxProvider>
          <Toaster />
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </ReduxProvider>
      </SessionProvider>
    </div>
  );
};

export default appWithTranslation(MyApp);
