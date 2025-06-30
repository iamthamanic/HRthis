import { type User } from "next-auth";

type Props = {
  user: User;
  logout: () => void;
};

export default function User({ user, logout }: Props) {
  return (
    <>
      <p>{user?.email}</p>
      <p>{user?.role}</p>
      <button className="cursor-pointer" onClick={logout}>
        Logout
      </button>
    </>
  );
}
