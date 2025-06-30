import { getSession, signIn, signOut } from "next-auth/react";

// For v4, we use getSession instead of the auth function
const getServerSession = async () => {
  return getSession();
};

export { getServerSession, signIn, signOut };
