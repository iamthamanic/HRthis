// Components
import RootLayout from "@/components/layout/root.layout";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Next
import Link from "next/link";

// React Hook Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// i18Next
import { useTranslation } from "next-i18next";

// Next-Auth
import { useUser } from "@/components/hooks/useUser";
import { useRouter } from "next/router";
import { settings } from "@/config/settings";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const { t } = useTranslation();
  const { login } = useUser();

  const router = useRouter();

  const { register, handleSubmit, watch, formState } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: any) => {
    const res = await login(data.email, data.password);

    if (res) {
      router.push("/authorized");
    }
  };

  const isButtonDisabled =
    formState.isSubmitting || watch("email") === "" || watch("password") === "";

  return (
    <RootLayout>
      <div className="flex max-w-[390px] flex-col gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input placeholder="example@gmail.com" {...register("email")} />
            {formState.errors.email ? (
              <span className="text-xs text-red-500">
                {formState.errors.email.message}
              </span>
            ) : (
              <span className="text-xs text-black/50">Email</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="********"
                type="password"
                {...register("password")}
              />
            </div>
            {formState.errors.password ? (
              <span className="text-xs text-red-500">
                {formState.errors.password.message}
              </span>
            ) : (
              <span className="text-xs text-black/50">
                {t("auth.password-placeholder")}
              </span>
            )}
          </div>

          <Button
            disabled={isButtonDisabled}
            variant="default"
            className="bg-primary"
            type="submit"
          >
            {t("auth.login")}
          </Button>
        </form>

        <div className="flex flex-col gap-2">
          <span>Sample Email & Password</span>
          <span>{settings.auth.demoAccount.email}</span>
          <span>{settings.auth.demoAccount.password}</span>
        </div>
      </div>
    </RootLayout>
  );
}
