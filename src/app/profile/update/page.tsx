"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProfileGuard } from "@/components/profile-guard";
import { useToast } from "@/components/toast-provider";
import { authClient } from "@/lib/auth-client";

function UpdateProfileForm() {
  const router = useRouter();
  const showToast = useToast();
  const { data: session } = authClient.useSession();
  const [name, setName] = useState(session!.user.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedName = name.trim();
    if (!updatedName) {
      setErrorMessage("আপনার নাম লিখুন।");
      showToast("আপনার নাম লিখুন।", "error");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const result = await authClient.updateUser({ name: updatedName });
      if (result.error) {
        const message = result.error.message || "তথ্য আপডেট করা যায়নি।";
        setErrorMessage(message);
        showToast(message, "error");
        return;
      }
      showToast("প্রোফাইলের তথ্য আপডেট হয়েছে।", "success");
      router.push("/profile");
    } catch (error: unknown) {
      console.error("Could not update profile information:", error);
      const message =
        error instanceof Error
          ? error.message
          : "তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।";
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 justify-center bg-[#f0f5f1] px-4 py-8 sm:px-6 sm:py-12">
      <section className="h-fit w-full max-w-xl rounded-2xl border border-[#dce8df] bg-[#fbfdfb] p-5 shadow-sm sm:p-8">
        <Link
          className="text-sm font-medium text-[#06743f] no-underline hover:underline"
          href="/profile"
        >
          ← প্রোফাইলে ফিরে যান
        </Link>
        <h1 className="mt-5 text-2xl font-bold text-[#1f2b23] sm:text-3xl">
          প্রোফাইলের তথ্য পরিবর্তন
        </h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-[#34423a]"
              htmlFor="profile-name"
            >
              নাম
            </label>
            <input
              autoComplete="name"
              className="auth-form-input min-h-11 w-full rounded-lg border border-[#dce8df] bg-white px-3 text-sm text-[#28332e] outline-none transition focus:border-[#078b4b] focus:ring-2 focus:ring-[#078b4b]/15"
              id="profile-name"
              maxLength={100}
              onChange={(event) => setName(event.currentTarget.value)}
              required
              value={name}
            />
          </div>
          {errorMessage && (
            <p
              className="rounded-lg border border-[#f0d7d4] bg-[#fff7f6] px-3 py-2 text-sm leading-6 text-[#a33b2e]"
              role="alert"
            >
              {errorMessage}
            </p>
          )}
          <button
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#078b4b] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#06743f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078b4b] disabled:cursor-wait disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "আপডেট হচ্ছে…" : "তথ্য আপডেট করুন"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function UpdateProfilePage() {
  return (
    <ProfileGuard>
      <UpdateProfileForm />
    </ProfileGuard>
  );
}
