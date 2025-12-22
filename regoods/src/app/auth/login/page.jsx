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
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-none border border-gray-200 shadow-none">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold tracking-tight text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue to ReGoods.
          </p>
        </div>


        {/* Email Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {successMsg && <div className="text-green-600 text-sm text-center">{successMsg}</div>}

          <div className="space-y-4">
            <input
              name="email"
              type="email"
              required
              className="block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black px-4 bg-gray-50"
              placeholder="Email"
            />
            <input
              name="password"
              type="password"
              required
              className="block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black px-4 bg-gray-50"
              placeholder="Password"
            />
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center rounded-full bg-blue-950 px-3 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-black disabled:opacity-70 transition-all shadow-md hover:shadow-lg hover:shadow-blue-900/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/auth/register" className="font-bold text-gray-900 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}