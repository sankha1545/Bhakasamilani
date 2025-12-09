// app/admin/layout.tsx
import type { ReactNode } from "react";

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // No auth check here — login must be accessible
  return <>{children}</>;
}
