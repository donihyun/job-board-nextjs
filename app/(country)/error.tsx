"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Country page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Something went wrong
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          We encountered an error while loading the country information. Please try
          again or return to the homepage.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="rounded-md border border-gray-300 px-6 py-3 hover:bg-gray-50"
          >
            Go to homepage
          </Button>
        </div>
        {error.digest && (
          <p className="mt-6 text-sm text-gray-500">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
