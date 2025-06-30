import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import RootLayout from "@/components/layout/root.layout";
import Authorized from "@/components/pages/authorized";

export default function AuthorizedPage() {
  return (
    <RootLayout>
      <Authorized />
    </RootLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations((locale as string) || "en", ["common"])),
    },
  };
};
