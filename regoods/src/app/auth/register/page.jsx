"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // If successful, send them to login page
      router.push("/login?registered=true");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-indigo-600">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join LoopLane to start buying and selling.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <input
              name="name"
              type="text"
              required
              className="block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 px-4"
              placeholder="Full Name"
            />
            <input
              name="email"
              type="email"
              required
              className="block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 px-4"
              placeholder="Email Address"
            />
            <input
              name="phone"
              type="tel"
              required
              className="block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 px-4"
              placeholder="Phone Number"
            />
            <input
              name="nationality"
              type="text"
              required
              className="block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 px-4"
              placeholder="Nationality"
            />
            <input
              name="password"
              type="password"
              required
              className="block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 px-4"
              placeholder="Password"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{" "}
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Terms and Conditions
              </a>
            </label>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}