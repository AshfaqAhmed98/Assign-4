"use client";

import { useState } from "react";
import Image from "next/image";
import { ProfileGuard } from "@/components/profile-guard";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/toast-provider";
import type { FormEvent } from "react";

function ProfileContent() {
  const { data: session } = authClient.useSession();
  const user = session!.user;
  const showToast = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [name, setName] = useState(user.name);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        showToast(result.error.message || "সাইন আউট করা যায়নি।", "error");
        return;
      }
      showToast("সাইন আউট সফল হয়েছে", "success");
    } catch (error: unknown) {
      console.error("Could not sign out:", error);
      showToast("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।", "error");
    } finally {
      setIsSigningOut(false);
    }
  }

  async function handleUpdateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedName = name.trim();
    if (!updatedName) {
      const message = "আপনার নাম লিখুন।";
      setErrorMessage(message);
      showToast(message, "error");
      return;
    }

    setIsUpdating(true);
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
    } catch (error: unknown) {
      console.error("Could not update profile information:", error);
      const message =
        error instanceof Error
          ? error.message
          : "তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।";
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <main className="flex flex-1 justify-center bg-[#f0f5f1] px-4 py-8 sm:px-6 sm:py-12">
      <section className="h-fit w-full max-w-xl">
        <header className="mb-5">
          <h1 className="text-2xl font-bold text-[#1f2b23] sm:text-3xl">
            আমার প্রোফাইল
          </h1>
          <p className="mt-1 text-sm text-[#77827c]">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </header>

        <div className="flex flex-col gap-4 rounded-2xl border border-[#dce8df] bg-[#fbfdfb] p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#f0f5f1] text-xl font-bold text-[#06743f]">
              {user.image ? (
                <Image
                  alt=""
                  className="size-full object-cover"
                  height={56}
                  src={user.image}
                  unoptimized
                  width={56}
                />
              ) : (
                user.name.trim().charAt(0).toLocaleUpperCase("bn-BD") || "👤"
              )}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-[#28332e]">
                {user.name}
              </h2>
              <p className="truncate text-sm text-[#68736c]">{user.email}</p>
            </div>
          </div>
          <button
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#f0b5b0] px-4 text-sm font-semibold text-[#d13d39] transition-colors hover:bg-[#fff7f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d13d39] disabled:cursor-wait disabled:opacity-60 sm:ml-auto"
            disabled={isSigningOut}
            onClick={() => void handleSignOut()}
            type="button"
          >
            {isSigningOut ? "সাইন আউট হচ্ছে…" : "↪ সাইন আউট"}
          </button>
        </div>

        <section className="mt-4 rounded-2xl border border-[#dce8df] bg-[#fbfdfb] p-4 sm:p-5">
          <h2 className="text-base font-bold text-[#34423a]">তথ্য</h2>
          <form className="mt-5 space-y-3" onSubmit={handleUpdateProfile}>
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-[#59665d]"
                htmlFor="profile-name"
              >
                নাম
              </label>
              <input
                autoComplete="name"
                className="auth-form-input min-h-10 w-full rounded-lg border border-[#dce8df] bg-white px-3 text-sm text-[#28332e] outline-none transition focus:border-[#078b4b] focus:ring-2 focus:ring-[#078b4b]/15"
                id="profile-name"
                maxLength={100}
                onChange={(event) => setName(event.currentTarget.value)}
                placeholder="নাম লিখুন"
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
              className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-[#078b4b] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#06743f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078b4b] disabled:cursor-wait disabled:opacity-70"
              disabled={isUpdating}
              type="submit"
            >
              {isUpdating ? "আপডেট হচ্ছে…" : "আপডেট"}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <ProfileGuard>
      <ProfileContent />
    </ProfileGuard>
  );
}
