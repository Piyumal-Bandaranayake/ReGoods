"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMsg("Account created! Please log in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target[0].value;
    const password = e.target[1].value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/dashboard"); // Redirect on success
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h2>
        </div>


        {/* Email Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {successMsg && <div className="text-green-600 text-sm text-center">{successMsg}</div>}
          
          <div className="space-y-4">
            <input
              name="email"
              type="email"
              required
              className="block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 px-4"
              placeholder="Email"
            />
            <input
              name="password"
              type="password"
              required
              className="block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 px-4"
              placeholder="Password"
            />
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/auth/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}