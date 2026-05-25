import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login · Portfolio",
  robots: "noindex",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
