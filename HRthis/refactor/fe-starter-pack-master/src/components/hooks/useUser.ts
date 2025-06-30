import { useSession, signIn, signOut } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * NextAuth'u kullanan basit bir auth hook'u
 *
 * Bu hook, NextAuth oturumunu kullanarak kullanıcı girişi, çıkışı ve oturum durumunu yönetir.
 */

// Domain bağımsız, yani her yerde kullanılabilecek hook'lar @hooks klasöründe tutulmalıdır.

export const useUser = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { t } = useTranslation();

  /**
   * Kullanıcı girişi yapar
   * @param email Kullanıcı e-posta adresi
   * @param password Kullanıcı şifresi
   * @returns Giriş başarılı ise true, değilse false
   */
  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        role,
        redirect: false,
      });

      if (result?.error) {
        toast.error(t("auth.login.error"));
        return false;
      }

      toast.success(t("auth.login.success"));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(t("auth.login.error"));
      return false;
    }
  };

  /**
   * Kullanıcı çıkışı yapar
   */
  const logout = async (): Promise<void> => {
    try {
      await signOut({ redirect: false });
      router.push("/auth/login");
      toast.success(t("auth.logout.success"));
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t("auth.logout.error"));
    }
  };

  return {
    user: session?.user,
    session,
    loading: status === "loading",
    isCurrentPageAuthenticated: status === "authenticated",
    login,
    logout,
  };
};
