"use client";

import { Suspense } from "react";
import Link from "next/link";

// Composant client qui utilise useSearchParams
import ErrorContent from "./ErrorContent";

export default function AuthError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">Authentication Error</h1>
          <Suspense fallback={<p>Loading error details...</p>}>
            <ErrorContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 