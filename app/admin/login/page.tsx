// app/admin/login/page.tsx
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import AdminLoginForm from "./AdminloginForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  // If already logged in, go straight to dashboard
  if (admin) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 relative">
      {/* Top-left logo */}
      <div className="hidden sm:flex items-center gap-2 absolute top-4 left-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-100 border border-orange-200 shadow-sm">
          <span className="text-lg font-semibold text-orange-600">ॐ</span>
        </div>
        <span className="text-sm font-semibold tracking-wide text-slate-800">
          Bhhakta<span className="text-orange-600">Sammilan</span>
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left side: image + branding */}
        <div className="relative bg-gradient-to-b from-orange-50 via-amber-50 to-slate-50 p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-xs mx-auto flex flex-col items-center text-center space-y-4">
            {/* Namaskar image */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-orange-200 shadow-lg bg-white">
              <Image
                src="/namskar.png" // make sure this file exists in /public
                alt="Namaskar"
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>

            {/* Logo text */}
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-orange-500">
                स्वागतं
              </p>
              <h2 className="text-xl font-semibold text-slate-900">
                <span className="text-orange-600">Bhhakta</span>
                <span className="text-slate-900">Sammilan</span>{" "}
                <span className="text-orange-500">ॐ</span>
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Sacred admin access for managing offerings and supporting the
                temple&apos;s seva with care and devotion.
              </p>
            </div>
          </div>
        </div>

        {/* Right side: login form */}
        <div className="p-6 md:p-8 flex items-center justify-center bg-white">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
