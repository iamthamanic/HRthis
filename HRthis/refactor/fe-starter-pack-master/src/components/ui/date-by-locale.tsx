import { useRouter } from "next/router";
import { tr, enUS } from "date-fns/locale";
import { format } from "date-fns";

export const DateByLocale = () => {
  const router = useRouter();
  const locale = router.locale === "tr" ? tr : enUS;
  return (
    <p className="text-sm text-gray-500">{format(new Date(), "EEEE, d MMM yyyy", { locale })}</p>
  );
};
