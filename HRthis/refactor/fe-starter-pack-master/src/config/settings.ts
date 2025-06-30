export const settings = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Fe Starter Pack",
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Fe Starter Pack Description",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://sitename.com",
  apiBase: process.env.NEXT_PUBLIC_API_BASE || "https://backend-api.com",
  landingPage: process.env.NEXT_PUBLIC_LANDING_PAGE || "/",
  authPage: process.env.NEXT_PUBLIC_AUTH_PAGE || "/auth/login",
  accountPage: process.env.NEXT_PUBLIC_ACCOUNT_PAGE || "/account",
  dashboardPage: process.env.NEXT_PUBLIC_DASHBOARD_PAGE || "/authorized",
  adminPage: process.env.NEXT_PUBLIC_ADMIN_PAGE || "/admin",
  nextAuthSecret: process.env.AUTH_SECRET || "default-next-auth-secret",
  auth: {
    demoAccount: {
      email: "anna.admin@hrthis.de",
      password: "password",
      name: "Anna Admin",
      role: "admin",
    },
  },
};
