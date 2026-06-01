"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(
    email
      ? `Enter the 6-digit code sent to ${email}.`
      : "Enter your email and verification code."
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("Verifying your code...");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Email verification failed.");
      }

      setStatus("success");
      setMessage("Email verified successfully. Redirecting to home...");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Email verification failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Verify Email</h1>
          <p
            className={`mb-6 ${
              status === "success"
                ? "text-green-700"
                : status === "error"
                  ? "text-red-700"
                  : "text-gray-700"
            }`}
          >
            {message}
          </p>
        </div>

        {status === "success" ? (
          <div className="space-y-4 text-center">
            <p className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm font-medium text-green-800">
              Verified now. Redirecting to home...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(event) => {
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                  if (status === "error") {
                    setStatus("idle");
                  }
                }}
                placeholder="Enter 6-digit code"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl font-semibold tracking-[0.35em] text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading" || code.length !== 6 || !email}
              className="w-full rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {status === "loading" ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
