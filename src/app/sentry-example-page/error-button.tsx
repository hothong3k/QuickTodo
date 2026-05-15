"use client";

import { Bug } from "lucide-react";

export default function ErrorButton() {
  return (
    <button
      type="button"
      onClick={() => {
        throw new Error("Sentry example page test error");
      }}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-background"
    >
      <Bug className="h-4 w-4" aria-hidden="true" />
      Trigger test error
    </button>
  );
}
