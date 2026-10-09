"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

export function ProfileGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signin?redirect=protected");
    }
  }, [isPending, router, session?.user]);

  if (isPending || !session?.user) {
    return (
      <main
        aria-busy="true"
        aria-label="প্রোফাইল লোড হচ্ছে"
        className="flex flex-1 items-start justify-center bg-[#f0f5f1] px-4 py-10 sm:px-6"
      >
        <div className="w-full max-w-2xl animate-pulse space-y-4">
          <div className="h-32 rounded-2xl border border-[#dce8df] bg-white" />
          <div className="h-14 rounded-xl bg-white" />
          <p className="sr-only" role="status">
            প্রোফাইল লোড হচ্ছে…
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
