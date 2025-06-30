// React Things
import { useTranslation } from "next-i18next";
import { useUser } from "@/components/hooks/useUser";

// Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styles/style.css";

// Components
import User from "./components/user";

export default function Authorized() {
  const { t } = useTranslation();
  const { user, logout } = useUser();

  return (
    <main className="home-container">
      <h1>{t("authorized.title")}</h1>
      <User user={user} logout={logout} />
    </main>
  );
}
