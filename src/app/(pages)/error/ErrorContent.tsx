"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "Signin":
        return "Try signing in with a different account.";
      case "OAuthSignin":
        return "Try signing in with a different account.";
      case "OAuthCallback":
        return "Try signing in with a different account.";
      case "OAuthCreateAccount":
        return "Try signing in with a different account.";
      case "EmailCreateAccount":
        return "Try signing in with a different account.";
      case "Callback":
        return "Try signing in with a different account.";
      case "OAuthAccountNotLinked":
        return "To confirm your identity, sign in with the same account you used originally.";
      case "EmailSignin":
        return "Check your email address.";
      case "CredentialsSignin":
        return "Sign in failed. Check the details you provided are correct.";
      case "SessionRequired":
        return "Please sign in to access this page.";
      case "token_exchange":
        return "Failed to exchange the authorization code for a token.";
      case "user_info":
        return "Failed to retrieve user information.";
      case "server_error":
        return "An unexpected error occurred on the server.";
      default:
        return "An unexpected error occurred.";
    }
  };

  return (
    <>
      <p className="mt-4 text-gray-700">
        {getErrorMessage(error)}
      </p>
      <div className="mt-8">
        <p className="text-sm text-gray-500 mb-4">Error code: {error || "unknown"}</p>
        <Link 
          href="/login"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </>
  );
} 