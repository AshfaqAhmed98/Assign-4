"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/toast-provider";

type AuthMode = "signin" | "signup";
type SocialProvider = "google" | "github";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="size-4 shrink-0" viewBox="0 0 24 24">
      <path
        d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.51h6.44a5.5 5.5 0 0 1-2.39 3.61v2.95h3.87c2.27-2.09 3.57-5.17 3.57-8.8Z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.96-1.08 7.95-2.93l-3.87-2.95c-1.08.72-2.46 1.15-4.08 1.15-3.14 0-5.8-2.12-6.75-4.97H1.25v3.04A12 12 0 0 0 12 24Z"
        fill="#34A853"
      />
      <path
        d="M5.25 14.3a7.2 7.2 0 0 1 0-4.6V6.66H1.25a12 12 0 0 0 0 10.68l4-3.04Z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.73c1.77 0 3.35.61 4.6 1.82l3.45-3.45C17.95 1.15 15.24 0 12 0A12 12 0 0 0 1.25 6.66l4 3.04C6.2 6.85 8.86 4.73 12 4.73Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0 fill-current"
      viewBox="0 0 24 24"
    >
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.51-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.7 2.62 1.21 3.26.93.1-.73.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.16 1.78 1.16 3 0 4.3-2.62 5.24-5.11 5.52.4.35.76 1.03.76 2.08v3.09c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

function SocialButton({
  provider,
  label,
  onClick,
  disabled,
  isLoading,
}: {
  provider: SocialProvider;
  label: string;
  onClick: (provider: SocialProvider) => void;
  disabled: boolean;
  isLoading: boolean;
}) {
  return (
    <button
      aria-label={label}
      aria-busy={isLoading}
      className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-[#dce8df] bg-white px-1.5 text-[10px] font-semibold whitespace-nowrap text-[#28332e] transition-colors hover:border-[#b8cfbf] hover:bg-[#f5f8f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078b4b] disabled:cursor-wait disabled:opacity-60 sm:min-h-10 sm:gap-2 sm:px-2 sm:text-xs"
      disabled={disabled}
      onClick={() => onClick(provider)}
      type="button"
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="size-5 shrink-0 animate-spin rounded-full border-2 border-[#078b4b]/25 border-t-[#078b4b]"
        />
      ) : provider === "google" ? (
        <GoogleIcon />
      ) : (
        <GitHubIcon />
      )}
      <span className="hidden min-[360px]:inline">
        {isLoading
          ? `${provider === "google" ? "Google" : "GitHub"}-এ যাচ্ছেন…`
          : label}
      </span>
      <span className="min-[360px]:hidden">
        {isLoading ? "যাচ্ছেন…" : provider === "google" ? "Google" : "GitHub"}
      </span>
    </button>
  );
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const isSignUp = mode === "signup";
  const router = useRouter();
  const showToast = useToast();
  const socialSignInPending = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialProviderPending, setSocialProviderPending] =
    useState<SocialProvider | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  function showError(message: string) {
    setErrorMessage(message);
    showToast(message, "error");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (isSignUp && !name) {
      showError("আপনার নাম লিখুন।");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("সঠিক ইমেইল ঠিকানা লিখুন।");
      return;
    }
    if (password.length < 8) {
      showError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      showError("দুটি পাসওয়ার্ড মিলছে না। আবার যাচাই করুন।");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: "/signin",
        });
        if (result.error) {
          showError(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
          return;
        }
        showToast("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।", "success");
        router.push("/signin");
        return;
      }

      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });
      if (result.error) {
        showError(result.error.message || "সাইন ইন করা যায়নি।");
        return;
      }
      showToast("সাইন ইন সফল হয়েছে", "success");
      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      console.error(`Could not ${mode} with email and password:`, error);
      showError(
        error instanceof Error
          ? error.message
          : "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSocialSignIn(provider: SocialProvider) {
    if (socialSignInPending.current) return;
    socialSignInPending.current = true;
    setErrorMessage("");
    setSocialProviderPending(provider);
    setIsSubmitting(true);
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/?auth=success",
      });
      if (result.error) {
        const providerName = provider === "google" ? "Google" : "GitHub";
        const message = result.error.message || "";
        showError(
          message.toLowerCase().includes("provider not found")
            ? `${providerName} OAuth সেটআপ করা নেই। .env.local-এ credentials যোগ করুন।`
            : message || `${providerName} দিয়ে সাইন ইন করা যায়নি।`,
        );
        socialSignInPending.current = false;
        setSocialProviderPending(null);
        setIsSubmitting(false);
      }
    } catch (error: unknown) {
      console.error(`Could not sign in with ${provider}:`, error);
      showError(
        `${provider === "google" ? "Google" : "GitHub"} দিয়ে সাইন ইন করা যায়নি। OAuth সেটিংস যাচাই করুন।`,
      );
      socialSignInPending.current = false;
      setSocialProviderPending(null);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex-1 bg-[#f0f5f1] px-4 py-10 sm:px-6 sm:py-14">
      <section className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl leading-relaxed font-bold text-[#1f2b23] sm:text-3xl">
            {isSignUp ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
          </h1>
          <p className="mt-1 text-sm leading-7 text-[#68736c]">
            {isSignUp
              ? "বিনামূল্যে অ্যাকাউন্ট খুলে বাজারদর দেখুন।"
              : "বাজারদরের তথ্য ও আপনার অ্যাকাউন্টে ফিরে আসুন।"}
          </p>
        </div>

        <div
          aria-busy={isSubmitting}
          className="rounded-2xl border border-[#dce8df] bg-[#fbfdfb] p-5 shadow-[0_1px_3px_rgba(31,43,35,0.04)] sm:p-7"
        >
          <form className="space-y-4" noValidate onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-[#34423a]"
                  htmlFor="auth-name"
                >
                  নাম
                </label>
                <input
                  autoComplete="name"
                  className="auth-form-input min-h-11 w-full rounded-lg border border-[#dce8df] bg-white px-3 text-sm text-[#28332e] outline-none transition focus:border-[#078b4b] focus:ring-2 focus:ring-[#078b4b]/15"
                  id="auth-name"
                  name="name"
                  placeholder="যেমন: রহিম উদ্দিন"
                  required
                  type="text"
                />
              </div>
            )}

            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-[#34423a]"
                htmlFor="auth-email"
              >
                ইমেইল
              </label>
              <input
                autoComplete="email"
                className="auth-form-input min-h-11 w-full rounded-lg border border-[#dce8df] bg-white px-3 text-sm text-[#28332e] outline-none transition focus:border-[#078b4b] focus:ring-2 focus:ring-[#078b4b]/15"
                id="auth-email"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-[#34423a]"
                htmlFor="auth-password"
              >
                পাসওয়ার্ড
              </label>
              <input
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="auth-form-input min-h-11 w-full rounded-lg border border-[#dce8df] bg-white px-3 text-sm text-[#28332e] outline-none transition focus:border-[#078b4b] focus:ring-2 focus:ring-[#078b4b]/15"
                id="auth-password"
                minLength={8}
                name="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                required
                type="password"
              />
            </div>

            {isSignUp && (
              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-[#34423a]"
                  htmlFor="auth-confirm-password"
                >
                  পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <input
                  autoComplete="new-password"
                  className="auth-form-input min-h-11 w-full rounded-lg border border-[#dce8df] bg-white px-3 text-sm text-[#28332e] outline-none transition focus:border-[#078b4b] focus:ring-2 focus:ring-[#078b4b]/15"
                  id="auth-confirm-password"
                  minLength={8}
                  name="confirmPassword"
                  placeholder="আবার লিখুন"
                  required
                  type="password"
                />
              </div>
            )}

            {errorMessage && (
              <p
                className="rounded-lg border border-[#f0d7d4] bg-[#fff7f6] px-3 py-2 text-sm leading-6 text-[#a33b2e]"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            <button
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#078b4b] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#06743f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078b4b] disabled:cursor-wait disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting && (
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              )}
              {isSubmitting
                ? "অপেক্ষা করুন…"
                : isSignUp
                  ? "অ্যাকাউন্ট তৈরি করুন"
                  : "সাইন ইন"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#e0e9e2]" />
            <span className="text-xs text-[#77827c]">অথবা</span>
            <span className="h-px flex-1 bg-[#e0e9e2]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <SocialButton
              disabled={isSubmitting}
              label="Google দিয়ে চালিয়ে যান"
              isLoading={socialProviderPending === "google"}
              onClick={handleSocialSignIn}
              provider="google"
            />
            <SocialButton
              disabled={isSubmitting}
              label="GitHub দিয়ে চালিয়ে যান"
              isLoading={socialProviderPending === "github"}
              onClick={handleSocialSignIn}
              provider="github"
            />
          </div>

          <p className="mt-5 text-center text-sm text-[#68736c]">
            {isSignUp ? "অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"}{" "}
            <Link
              className="font-semibold text-[#078b4b] no-underline hover:text-[#06743f]"
              href={isSignUp ? "/signin" : "/signup"}
            >
              {isSignUp ? "সাইন ইন করুন" : "সাইন আপ করুন"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
