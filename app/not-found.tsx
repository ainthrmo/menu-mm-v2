"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#111111] font-sans antialiased flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-lg text-center">
        {/* MOSSQR Brand */}
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white border border-[#E5E3DE] shadow-sm">
            <Image
              src="/icon.png"
              alt="MOSSQR"
              width={42}
              height={42}
              className="h-10 w-10 object-contain"
              priority
            />
          </div>

          <Image
            src="/moss_logo.jpg"
            alt="MOSSQR"
            width={180}
            height={60}
            className="h-auto w-36 object-contain"
            priority
          />
        </div>

        <p className="font-mono text-sm font-medium tracking-[0.2em] text-[#777777]">
          ERROR 404
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          This page got lost.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#666666] sm:text-base">
          The page or menu you&apos;re looking for doesn&apos;t exist anymore,
          or the link may be incorrect.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#111111] px-5 text-sm font-semibold text-white transition hover:bg-[#2a2a2a] active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            Go to MOSSQR
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#D8D6D0] bg-white px-5 text-sm font-semibold text-[#222222] transition hover:bg-[#F1F0EC] active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>

        <p className="mt-10 text-xs text-[#999999]">
          MOSSQR — Digital menus, made simple.
        </p>
      </div>
    </main>
  );
}
