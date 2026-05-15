import ErrorButton from "./error-button";

export default function SentryExamplePage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[var(--background)] px-4 py-16">
      <section className="w-full max-w-xl rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
          Sentry test
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-title">
          Sentry Example Page
        </h1>
        <p className="mb-6 text-sm leading-6 text-muted-foreground">
          Click the button below to throw a client-side test error. If your
          Sentry DSN is configured, the event should appear in Sentry shortly
          after the error is triggered.
        </p>
        <ErrorButton />
      </section>
    </main>
  );
}
