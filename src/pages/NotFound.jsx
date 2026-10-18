import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  SearchX,
  ArrowUpRight,
} from "lucide-react";

const NotFound = () => {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[#090909] px-5 py-16 text-white sm:min-h-[85vh]">

      {/* Background Effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C0652B]/15 blur-[120px]" />

      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#C0652B]/50 to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">

        {/* Icon */}
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C0652B]/30 bg-[#C0652B]/10">
          <SearchX
            size={30}
            strokeWidth={1.5}
            className="text-[#E08A4F]"
          />
        </div>

        {/* Label */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#E08A4F] sm:text-sm">
          Page Not Found
        </p>

        {/* 404 */}
        <h1 className="text-7xl font-bold leading-none tracking-tighter text-white sm:text-8xl md:text-[10rem]">
          4<span className="text-[#C0652B]">0</span>4
        </h1>

        {/* Heading */}
        <h2 className="mt-7 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
          Oops! This Page Is Missing
        </h2>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/60 sm:text-base">
          The page you're looking for doesn't exist or may
          have been moved. Let's get you back on track.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">

          <Link
            to="/"
            className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-full bg-[#C0652B] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#D2743A]"
          >
            <Home size={18} />
            Back to Home
            <ArrowUpRight size={16} />
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[#E08A4F] hover:text-[#E08A4F]"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

        </div>

        {/* Contact Link */}
        <div className="mx-auto mt-14 max-w-md border-t border-white/10 pt-7">
          <p className="text-sm text-white/50">
            Still need help finding something?
          </p>

          <Link
            to="/contact"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#E08A4F] transition-colors hover:text-white"
          >
            Contact Our Team
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <span className="h-1 w-8 rounded-full bg-[#C0652B]" />
          <span className="h-1 w-2 rounded-full bg-white/20" />
          <span className="h-1 w-2 rounded-full bg-white/20" />
        </div>

      </div>
    </section>
  );
};

export default NotFound;