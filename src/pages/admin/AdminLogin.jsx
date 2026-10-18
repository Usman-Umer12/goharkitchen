
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { LockKeyhole, Mail, ArrowRight, LoaderCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) throw loginError;

      const isAdmin = data.user?.app_metadata?.role === "admin";

      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error(
          "This account does not have admin access. Please contact the administrator."
        );
      }

      setAuthenticated(true);
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authenticated) {
    return <Navigate to="/admin/products" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">
        <section className="relative flex min-h-64 flex-col justify-between overflow-hidden bg-[#f97316] p-8 text-black sm:p-10 md:min-h-[570px]">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[35px] border-black/10" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full border-[35px] border-black/10" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
              <LockKeyhole size={22} />
            </div>
            <span className="text-lg font-black tracking-wide">
              GOHAR KITCHEN
            </span>
          </div>

          <div className="relative z-10 my-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em]">
              Administration
            </p>
            <h1 className="max-w-sm text-4xl font-black leading-tight sm:text-5xl">
              Manage your kitchen products.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-black/75">
              Keep your product catalogue updated with a simple, secure
              management dashboard.
            </p>
          </div>

          <p className="relative z-10 text-xs font-semibold text-black/70">
            Authorized access only
          </p>
        </section>

        <section className="flex items-center p-7 sm:p-10 md:p-12">
          <div className="w-full">
            <p className="text-sm font-bold uppercase tracking-widest text-[#f97316]">
              Admin Portal
            </p>
            <h2 className="mt-3 text-3xl font-black text-black">
              Welcome back
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Sign in with your authorized administrator account.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Email address
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 focus-within:border-[#f97316]">
                  <Mail size={18} className="shrink-0 text-gray-400" />
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-transparent py-3.5 text-sm text-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 focus-within:border-[#f97316]">
                  <LockKeyhole size={18} className="shrink-0 text-gray-400" />
                  <input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent py-3.5 text-sm text-black outline-none"
                  />
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#f97316] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <Link
              to="/"
              className="mt-7 inline-block text-sm font-medium text-gray-500 transition-colors hover:text-[#f97316]"
            >
              ← Back to website
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
