import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { useRouter } from "next/router";
import { useTranslation, i18n } from "next-i18next";
import { cn } from "@/lib/utils";

export default function LanguageChanger({ className = "" }: { className?: string }) {
  const router = useRouter();
  const locale = router?.locale || "en";

  const handleLanguageChange = (newLocale: string) => {
    if (typeof window === "undefined") {
      return;
    }

    if (i18n) {
      i18n.changeLanguage(newLocale);
    }

    const { pathname, asPath, query } = router;

    router.push({ pathname, query }, asPath, {
      locale: newLocale,
      scroll: false,
      shallow: false,
    });
  };
  return (
    <Select onValueChange={handleLanguageChange}>
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder={locale === "en" ? "EN" : "TR"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">EN</SelectItem>
        <SelectItem value="tr">TR</SelectItem>
      </SelectContent>
    </Select>
  );
}
