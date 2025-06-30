import "../styles/style.css";

type Props = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: Props) {
  return <div className="root-layout">{children}</div>;
}
