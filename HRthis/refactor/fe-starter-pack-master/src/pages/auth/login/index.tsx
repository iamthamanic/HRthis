import Login from "@/components/pages/auth/login";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function LoginPage() {
  return <Login />;
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations((locale as string) || "en", ["common"])),
    },
  };
};
