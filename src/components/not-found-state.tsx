import Link from "next/link";

export function NotFoundState({
  title = "পাতাটি খুঁজে পাওয়া যায়নি",
  message = "আপনার খোঁজা পাতাটি নেই, অথবা ঠিকানাটি পরিবর্তিত হয়েছে।",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#f0f5f1] px-4 py-12 sm:px-6">
      <section
        aria-labelledby="not-found-title"
        className="w-full max-w-xl rounded-2xl border border-[#dce8df] bg-[#fbfdfb] px-5 py-10 text-center sm:px-8 sm:py-14"
      >
        <span
          aria-hidden="true"
          className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#e7f5ec] text-3xl"
        >
          🔎
        </span>
        <p className="mt-5 text-sm font-bold tracking-widest text-[#078b4b]">
          ৪০৪
        </p>
        <h1
          className="mt-2 text-2xl font-bold text-[#1f2b23] sm:text-3xl"
          id="not-found-title"
        >
          {title}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#68736c]">
          {message}
        </p>
        <Link
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#078b4b] px-5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#06743f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078b4b]"
          href="/"
        >
          হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
}
