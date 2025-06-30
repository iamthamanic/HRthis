// React Things
import { useTranslation } from "next-i18next";

// Components

// Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styles/style.css";
import Link from "next/link";

// Constants

export default function Landing() {
  const { t } = useTranslation();

  return (
    <main className="landing-container">
      This is home page
      <Link href="/authorized">
        Authorized Sample Page <span>(Protected via SSR)</span>
      </Link>
      <Link href="/auth/login">
        Login Sample Page
        <span>(If logged in, redirect to authorized page)</span>
      </Link>
    </main>
  );
}
