import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import { settings } from "@/config/settings";
import Landing from "@/components/pages/landing";

/**
 * This is how you get token from props
 */

export default function Home({ token }: { token: string }) {
  return (
    <>
      <Head>
        <title>{settings.siteName}</title>
        <meta name="description" content={settings.siteDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Landing />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  // This is how you get token from request

  const user = await getToken({ req, secret: settings.nextAuthSecret });

  // If user is logged in, redirect to dashboard
  if (user) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations((locale as string) || "en", ["common"])),
      // token: user.accessToken, this is how we pass user token to client
    },
  };
};
