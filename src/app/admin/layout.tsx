import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import AdminSidebar from "./components/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin · Portfolio",
  robots: "noindex",
};

import AdminShell from "./components/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
