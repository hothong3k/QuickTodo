import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  includeLocalVariables: true,
  beforeSend(event, hint) {
    const originalException = hint.originalException;
    const errorName =
      originalException instanceof Error
        ? originalException.name
        : event.exception?.values?.[0]?.type;
    const errorMessage =
      originalException instanceof Error
        ? originalException.message
        : event.exception?.values?.[0]?.value;

    if (
      errorName === "MongoServerSelectionError" ||
      errorMessage?.includes("Server selection timed out")
    ) {
      event.tags = {
        ...event.tags,
        "db.system": "mongodb",
        "db.error_type": "server_selection_timeout",
        runtime: "server",
      };
    }

    return event;
  },
});
