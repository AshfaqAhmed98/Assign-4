"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useToast } from "@/components/toast-provider";

export function AuthToastListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const showToast = useToast();

  useEffect(() => {
    if (pathname === "/" && searchParams.get("auth") === "success") {
      showToast("সাইন ইন সফল হয়েছে", "success");
      window.history.replaceState(null, "", pathname);
      return;
    }

    if (pathname === "/signin" && searchParams.get("redirect") === "protected") {
      showToast("এই পৃষ্ঠাটি দেখতে আগে সাইন ইন করুন।", "error");
      window.history.replaceState(null, "", pathname);
    }
  }, [pathname, searchParams, showToast]);

  return null;
}
