"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Check,
  Edit3,
  Languages,
  Loader2,
  Menu,
  QrCode,
  Search,
  Send,
  Sparkles,
  Store,
  UtensilsCrossed,
  X,
} from "lucide-react";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";
import { motion } from "motion/react";

const smoothEase = [0.21, 0.47, 0.32, 0.98] as const;

const fadeInUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: smoothEase },
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Inquiry form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [township, setTownship] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!name.trim() || !phone.trim() || !restaurantName.trim() || !township.trim()) {
      setSubmitError("Please fill in your name, phone/viber, restaurant name, and township.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_name: restaurantName.trim(),
          contact_name: name.trim(),
          phone: phone.trim(),
          city: township.trim(),
          notes: message.trim() ? message.trim() : `Township: ${township.trim()}`,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit. Please try again or reach out on Viber.");
      }

      setSubmitSuccess(true);
      setName("");
      setPhone("");
      setRestaurantName("");
      setTownship("");
      setMessage("");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setSubmitError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E5E1] p-3 sm:p-6 lg:p-8 font-[family-name:var(--font-space-grotesk)] font-sans text-[#121410] antialiased selection:bg-[#C6F24E] selection:text-[#121410]">
      {/* Skip to Main Content Link for Keyboard / Screen Reader Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#121410] focus:text-[#C6F24E] focus:rounded-lg focus:font-semibold focus:text-sm focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C6F24E]"
      >
        Skip to content
      </a>

      {/* Outer Rounded White Sheet */}
      <div className="max-w-[1240px] mx-auto bg-white rounded-[28px] sm:rounded-[36px] border border-[#D5D5CF] shadow-xs overflow-hidden">
        
        {/* ====================================================
            NAVIGATION
        ==================================================== */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EAEAE5] px-6 sm:px-10 py-4 transition-colors">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 select-none rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] focus-visible:ring-offset-2"
              aria-label="MOSSQR Home"
            >
              <span className="w-8 h-8 rounded-lg bg-[#121410] text-[#C6F24E] flex items-center justify-center font-bold text-sm tracking-tight">
                M
              </span>
              <span className="font-semibold text-lg tracking-[-0.02em] text-[#121410]">
                MOSSQR
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
              <a
                href="#capabilities"
                className="text-sm font-medium text-[#55584D] hover:text-[#121410] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410]"
              >
                Product
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-[#55584D] hover:text-[#121410] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410]"
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-[#55584D] hover:text-[#121410] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410]"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-sm font-medium text-[#55584D] hover:text-[#121410] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410]"
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="text-sm font-medium text-[#55584D] hover:text-[#121410] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410]"
              >
                Contact
              </a>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/menu?demo=true"
                className="inline-flex items-center justify-center bg-[#121410] text-white px-5 py-2.5 rounded-[10px] text-sm font-semibold hover:bg-[#232720] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] focus-visible:ring-offset-2 shadow-xs"
              >
                Explore demo
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-[10px] text-[#121410] hover:bg-[#F3F3EF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-3 border-t border-[#EAEAE5] mt-3 flex flex-col gap-1.5">
              <a
                href="#capabilities"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#121410] py-2.5 px-2.5 min-h-[44px] flex items-center rounded-lg hover:bg-[#F3F3EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] transition-colors"
              >
                Product
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#121410] py-2.5 px-2.5 min-h-[44px] flex items-center rounded-lg hover:bg-[#F3F3EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] transition-colors"
              >
                How it works
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#121410] py-2.5 px-2.5 min-h-[44px] flex items-center rounded-lg hover:bg-[#F3F3EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] transition-colors"
              >
                Pricing
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#121410] py-2.5 px-2.5 min-h-[44px] flex items-center rounded-lg hover:bg-[#F3F3EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] transition-colors"
              >
                FAQ
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#121410] py-2.5 px-2.5 min-h-[44px] flex items-center rounded-lg hover:bg-[#F3F3EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] transition-colors"
              >
                Contact
              </a>
              <div className="pt-2">
                <Link
                  href="/menu?demo=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center min-h-[44px] bg-[#121410] text-white px-5 py-3 rounded-[10px] text-sm font-semibold hover:bg-[#232720] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] focus-visible:ring-offset-2"
                >
                  Explore demo
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Main Content Landmark */}
        <main id="main-content">

          {/* ====================================================
              1. HERO SECTION
          ==================================================== */}
          <section className="px-6 sm:px-10 lg:px-16 pt-16 pb-16 sm:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="text-center max-w-[880px] mx-auto"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-[#121410] leading-[1.12]">
                Your menu,{" "}
                <span className="bg-[#C6F24E] text-[#121410] px-2.5 py-0.5 rounded-[6px] inline-block">
                  always up to date.
                </span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#55584D] max-w-[620px] mx-auto leading-relaxed">
                A digital menu for your restaurant or café. Update dishes and prices from one place.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  href="/menu?demo=true"
                  className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-[10px] bg-[#121410] text-white font-semibold text-sm hover:bg-[#232720] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] focus-visible:ring-offset-2 shadow-xs active:scale-[0.98]"
                >
                  Explore the live demo
                </Link>
                <a
                  href="#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-[10px] bg-white text-[#121410] border-2 border-[#121410] font-semibold text-sm hover:bg-[#F3F3EF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  Contact MOSSQR
                </a>
              </div>
            </motion.div>

            {/* Hero Visual: Two phone mockups on soft grey circle with star & lime dot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: smoothEase }}
              className="mt-14 sm:mt-18 relative max-w-[640px] mx-auto flex items-center justify-center"
            >
              {/* Tactile Outlined Tabletop Pedestal Card */}
              <div
                className="w-[330px] h-[260px] sm:w-[500px] sm:h-[310px] rounded-[28px] sm:rounded-[36px] bg-[#F3F3EF] border-2 border-[#121410] shadow-[0_6px_0_#121410] absolute inset-0 m-auto -z-0 pointer-events-none"
                aria-hidden="true"
              >
                {/* Subtle inner mat hairline */}
                <div className="absolute inset-2 sm:inset-3 rounded-[20px] sm:rounded-[28px] border border-[#121410]/10 pointer-events-none" />
              </div>

              {/* Small black four-point star accent */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.45, delay: 0.35, ease: "easeOut" }}
                className="absolute -top-3 left-6 sm:left-12 z-20 pointer-events-none"
                aria-hidden="true"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#121410" aria-hidden="true">
                  <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" />
                </svg>
              </motion.div>

              {/* Lime dot accent */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
                className="absolute bottom-6 right-8 sm:right-16 w-3.5 h-3.5 rounded-full bg-[#C6F24E] border border-[#121410]/20 z-20 shadow-xs pointer-events-none"
                aria-hidden="true"
              />

              {/* Phone Mockups Wrapper */}
              <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-6 py-6 sm:py-8">
                
                {/* Phone 1 (Foreground / Customer Menu) */}
                <motion.div
                  whileHover={{ scale: 1.025, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="w-[170px] sm:w-[220px] bg-white border-2 border-[#121410] rounded-[24px] sm:rounded-[30px] p-3 shadow-[0_5px_0_#121410] flex flex-col justify-between transform -rotate-2 cursor-default select-none"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAEAE5]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#C6F24E] inline-block" />
                      <span className="text-[10px] font-bold text-[#121410]">Golden Spoon</span>
                    </div>
                    <span className="text-[9px] font-semibold text-[#55584D]">QR Menu</span>
                  </div>
                  <div className="py-2.5 space-y-2">
                    <div className="bg-[#F3F3EF] rounded-xl p-2">
                      <p className="text-[10.5px] font-bold text-[#121410]">Grilled Fish</p>
                      <p className="text-[9.5px] font-semibold text-[#55584D]">9,000 Ks</p>
                    </div>
                    <div className="bg-[#F3F3EF] rounded-xl p-2">
                      <p className="text-[10.5px] font-bold text-[#121410]">Shan Noodles</p>
                      <p className="text-[9.5px] font-semibold text-[#55584D]">3,500 Ks</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#EAEAE5] text-center">
                    <span className="text-[9px] font-medium text-[#55584D]">No app needed</span>
                  </div>
                </motion.div>

                {/* Phone 2 (Background / Admin Dashboard) */}
                <motion.div
                  whileHover={{ scale: 1.025, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="w-[170px] sm:w-[220px] bg-[#121410] text-white border-2 border-[#121410] rounded-[24px] sm:rounded-[30px] p-3 shadow-[0_5px_0_#C6F24E] flex flex-col justify-between transform rotate-2 cursor-default select-none"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-[10px] font-bold text-[#C6F24E]">MOSS Dashboard</span>
                    <span className="text-[9px] font-medium text-white/60">Live</span>
                  </div>
                  <div className="py-2.5 space-y-2">
                    <div className="bg-white/10 rounded-xl p-2">
                      <p className="text-[10px] text-white/70">Quick Price Update</p>
                      <p className="text-[10.5px] font-bold text-[#C6F24E]">9,000 Ks Saved</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2">
                      <p className="text-[10px] text-white/70">Dishes online</p>
                      <p className="text-[10.5px] font-bold text-white">42 dishes active</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-center">
                    <span className="text-[9px] font-medium text-[#C6F24E]">Updates instantly</span>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </section>

        {/* ====================================================
            2. PROBLEM AND SOLUTION (Alt Background #F3F3EF)
        ==================================================== */}
        <section className="bg-[#F3F3EF] px-6 sm:px-10 lg:px-16 py-16 sm:py-20 border-t border-b border-[#D5D5CF]">
          <motion.div
            {...fadeInUp}
            className="max-w-[760px] mx-auto text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#121410] leading-tight">
              Menu changes shouldn&apos;t mean{" "}
              <span className="bg-[#C6F24E] text-[#121410] px-2 py-0.5 rounded-[6px] inline-block">
                starting over.
              </span>
            </h2>
            <p className="mt-3.5 text-[#55584D] text-base sm:text-lg leading-relaxed">
              Update prices and dishes without reprinting. Keep your printed menu if you like.
            </p>
          </motion.div>

          {/* Visual: Two cards with an arrow */}
          <div className="max-w-[820px] mx-auto flex flex-col md:flex-row items-center justify-center gap-5 sm:gap-6">
            
            {/* Card 1: You update */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: smoothEase }}
              whileHover={{ y: -4 }}
              className="w-full md:flex-1 bg-white border-2 border-[#121410] rounded-3xl p-6 sm:p-7 shadow-[0_5px_0_#121410] transition-shadow hover:shadow-[0_8px_0_#121410]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#55584D]">
                  You update
                </span>
                <span className="bg-[#C6F24E] text-[#121410] text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Check className="w-3 h-3" /> Saved
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#121410]">Grilled Fish</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-sm text-[#55584D] line-through">8,500 Ks</span>
                <span className="text-xl font-bold text-[#121410]">9,000 Ks</span>
              </div>
              <p className="text-xs text-[#55584D] mt-3">
                Price modified directly from your dashboard in seconds.
              </p>
            </motion.div>

            {/* Connecting Arrow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex items-center justify-center p-2 rounded-full bg-white border-2 border-[#121410] text-[#121410] shadow-[0_3px_0_#121410] shrink-0"
              aria-hidden="true"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>

            {/* Card 2: Customers see (Dark Card) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
              whileHover={{ y: -4 }}
              className="w-full md:flex-1 bg-[#121410] text-white border-2 border-[#121410] rounded-3xl p-6 sm:p-7 shadow-[0_5px_0_#C6F24E] transition-shadow hover:shadow-[0_8px_0_#C6F24E]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A4A89C]">
                  Customers see
                </span>
                <span className="text-[11px] font-bold text-[#C6F24E]">
                  Live on Phone
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Grilled Fish</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#C6F24E]">9,000 Ks</span>
              </div>
              <p className="text-xs text-[#A4A89C] mt-3">
                Updated immediately on every guest&apos;s phone. No reprints.
              </p>
            </motion.div>

          </div>
        </section>

        {/* ====================================================
            3. HOW IT WORKS
        ==================================================== */}
        <section id="how-it-works" className="px-6 sm:px-10 lg:px-16 py-16 sm:py-24">
          <motion.div
            {...fadeInUp}
            className="max-w-[760px] mx-auto text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#121410] leading-tight">
              From your menu to your customers in{" "}
              <span className="bg-[#C6F24E] text-[#121410] px-2 py-0.5 rounded-[6px] inline-block">
                three steps.
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1020px] mx-auto">
            {/* Step 1: Create */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.05, ease: smoothEase }}
              whileHover={{ y: -4 }}
              className="bg-white border-2 border-[#121410] rounded-3xl p-7 shadow-[0_5px_0_#121410] hover:shadow-[0_8px_0_#121410] transition-shadow flex flex-col justify-between"
            >
              <div>
                <span className="w-9 h-9 rounded-lg bg-[#C6F24E] text-[#121410] font-bold text-sm flex items-center justify-center border border-[#121410]/20 mb-6">
                  1
                </span>
                <h3 className="text-xl font-bold text-[#121410]">Create</h3>
                <p className="text-[#55584D] text-sm mt-2 leading-relaxed">
                  Add your dishes
                </p>
              </div>
            </motion.div>

            {/* Step 2: Connect (Dark Card) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.15, ease: smoothEase }}
              whileHover={{ y: -4 }}
              className="bg-[#121410] text-white border-2 border-[#121410] rounded-3xl p-7 shadow-[0_5px_0_#C6F24E] hover:shadow-[0_8px_0_#C6F24E] transition-shadow flex flex-col justify-between"
            >
              <div>
                <span className="w-9 h-9 rounded-lg bg-[#C6F24E] text-[#121410] font-bold text-sm flex items-center justify-center mb-6">
                  2
                </span>
                <h3 className="text-xl font-bold text-white">Connect</h3>
                <p className="text-[#E0E2D8] text-sm mt-2 leading-relaxed">
                  Generate your QR code
                </p>
              </div>
            </motion.div>

            {/* Step 3: Share */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.25, ease: smoothEase }}
              whileHover={{ y: -4 }}
              className="bg-white border-2 border-[#121410] rounded-3xl p-7 shadow-[0_5px_0_#121410] hover:shadow-[0_8px_0_#121410] transition-shadow flex flex-col justify-between"
            >
              <div>
                <span className="w-9 h-9 rounded-lg bg-[#C6F24E] text-[#121410] font-bold text-sm flex items-center justify-center border border-[#121410]/20 mb-6">
                  3
                </span>
                <h3 className="text-xl font-bold text-[#121410]">Share</h3>
                <p className="text-[#55584D] text-sm mt-2 leading-relaxed">
                  Customers scan and browse
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ====================================================
            4. SEE A REAL MENU (Grey Panel #F3F3EF)
        ==================================================== */}
        <section className="bg-[#F3F3EF] px-6 sm:px-10 lg:px-16 py-16 sm:py-20 border-t border-b border-[#D5D5CF]">
          <div className="max-w-[1020px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* Left Column: Heading, description, CTA button */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="max-w-[520px]"
            >
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#121410] leading-tight">
                See a{" "}
                <span className="bg-[#C6F24E] text-[#121410] px-2 py-0.5 rounded-[6px] inline-block">
                  real menu.
                </span>
              </h2>
              <p className="mt-3.5 text-[#55584D] text-base leading-relaxed">
                Open a live sample menu, exactly as your customers would on their phones.
              </p>
              <div className="mt-6">
                <Link
                  href="/menu?demo=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-[10px] bg-[#121410] text-white font-semibold text-sm hover:bg-[#232720] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] focus-visible:ring-offset-2 shadow-xs active:scale-[0.98]"
                >
                  Open the demo menu
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Real sample restaurant card */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
              whileHover={{ y: -4 }}
              className="w-full lg:w-auto lg:min-w-[340px]"
            >
              <div className="bg-white border-2 border-[#121410] rounded-3xl p-6 sm:p-7 shadow-[0_5px_0_#121410] hover:shadow-[0_8px_0_#121410] transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#121410] text-[#C6F24E] flex items-center justify-center font-bold text-base">
                    G
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#121410] leading-snug">
                      Golden Spoon Cuisine (ရွှေဇွန်း)
                    </h3>
                    <p className="text-xs text-[#55584D]">Bahan, Yangon</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-[#121410] pt-3 border-t border-[#EAEAE5]">
                  Opens a live menu. No app needed.
                </p>
              </div>
            </motion.div>

          </div>
        </section>


        {/* ====================================================
            5. CAPABILITIES (Alt Background #F3F3EF)
        ==================================================== */}
        <section id="capabilities" className="px-6 sm:px-10 lg:px-16 py-16 sm:py-24">
          <motion.div
            {...fadeInUp}
            className="max-w-[760px] mx-auto text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#121410] leading-tight">
              Everything your{" "}
              <span className="bg-[#C6F24E] text-[#121410] px-2 py-0.5 rounded-[6px] inline-block">
                digital menu
              </span>{" "}
              needs.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1020px] mx-auto">
            {[
              { icon: UtensilsCrossed, title: "Easy menu updates" },
              { icon: Camera, title: "Dish photos" },
              { icon: Search, title: "Search" },
              { icon: Languages, title: "English and Myanmar" },
              { icon: Store, title: "Restaurant info" },
              { icon: QrCode, title: "QR code generation" },
            ].map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: idx * 0.06, ease: smoothEase }}
                  whileHover={{ y: -3 }}
                  className="bg-white border-2 border-[#121410] rounded-3xl p-6 shadow-[0_5px_0_#121410] hover:shadow-[0_8px_0_#121410] transition-shadow flex items-center gap-4 cursor-default select-none"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#C6F24E] text-[#121410] flex items-center justify-center border border-[#121410]/20 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-base text-[#121410]">{cap.title}</h3>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ====================================================
            6. PRICING (White Section #FFFFFF)
        ==================================================== */}
        <section id="pricing" className="bg-[#F3F3EF] px-6 sm:px-10 lg:px-16 py-16 sm:py-24 border-t border-b border-[#D5D5CF]">
          <motion.div
            {...fadeInUp}
            className="max-w-[760px] mx-auto text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#121410] leading-tight">
              Simple{" "}
              <span className="bg-[#C6F24E] text-[#121410] px-2 py-0.5 rounded-[6px] inline-block">
                yearly pricing.
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[840px] mx-auto items-stretch">
            {/* Starter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.08, ease: smoothEase }}
              whileHover={{ y: -4 }}
              className="bg-white border-2 border-[#121410] rounded-3xl p-7 sm:p-8 shadow-[0_5px_0_#121410] hover:shadow-[0_8px_0_#121410] transition-shadow flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#55584D]">
                  Starter
                </span>
                <div className="mt-4 mb-2 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#121410]">
                    69,000 Ks
                  </span>
                  <span className="text-sm font-medium text-[#55584D]">/ year</span>
                </div>
                <p className="text-sm font-medium text-[#121410] mt-3">
                  Up to 50 dishes
                </p>
              </div>
              <div className="pt-8 mt-6 border-t border-[#EAEAE5]">
                <a
                  href="#contact"
                  className="w-full inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-[10px] bg-[#121410] text-white font-semibold text-sm hover:bg-[#232720] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  Get Started
                </a>
              </div>
            </motion.div>

            {/* Pro Plan (Dark Card with Founding price tag) */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.18, ease: smoothEase }}
              whileHover={{ y: -4 }}
              className="bg-[#121410] text-white border-2 border-[#121410] rounded-3xl p-7 sm:p-8 shadow-[0_5px_0_#C6F24E] hover:shadow-[0_8px_0_#C6F24E] transition-shadow flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A4A89C]">
                    Pro
                  </span>
                  <span className="bg-[#C6F24E] text-[#121410] text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Founding price
                  </span>
                </div>
                <div className="mt-4 mb-2 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    125,000 Ks
                  </span>
                  <span className="text-sm font-medium text-[#A4A89C]">/ year</span>
                </div>
                <p className="text-sm font-medium text-white mt-3">
                  Up to 100 dishes
                </p>
              </div>
              <div className="pt-8 mt-6 border-t border-white/10">
                <a
                  href="#contact"
                  className="w-full inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-[10px] bg-[#C6F24E] text-[#121410] font-semibold text-sm hover:bg-[#b5e03e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F24E] focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  Get Started
                </a>
              </div>
            </motion.div>
          </div>

          <p className="text-sm text-[#55584D] text-center max-w-[560px] mx-auto mt-8 leading-relaxed">
            Both plans include core digital menu features and guided onboarding. Outside Myanmar? Contact us for availability.
          </p>
        </section>

        {/* ====================================================
            7. FAQ (Alt Background #F3F3EF)
        ==================================================== */}
        <section id="faq" className="px-6 sm:px-10 lg:px-16 py-16 sm:py-24">
          <motion.div
            {...fadeInUp}
            className="max-w-[760px] mx-auto text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#121410] leading-tight">
              Good to{" "}
              <span className="bg-[#C6F24E] text-[#121410] px-2 py-0.5 rounded-[6px] inline-block">
                know.
              </span>
            </h2>
          </motion.div>

          <div className="max-w-[760px] mx-auto space-y-4">
            {[
              {
                q: "Do customers need an app?",
                a: "No, they scan your QR code and browse in their phone's browser.",
              },
              {
                q: "Can I update prices after publishing?",
                a: "Yes, from your dashboard, without reprinting your menu.",
              },
              {
                q: "Does it replace my printed menu?",
                a: "Not necessarily. Use MOSSQR alongside it.",
              },
              {
                q: "Does it support online ordering or payments?",
                a: "No. MOSSQR is a digital menu.",
              },
              {
                q: "How do I get started?",
                a: "Contact us, choose a plan, and we'll set up your menu with you.",
              },
            ].map((faq, idx) => (
              <motion.details
                key={faq.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: idx * 0.06, ease: smoothEase }}
                whileHover={{ y: -2 }}
                className="group bg-white border-2 border-[#121410] rounded-2xl p-5 shadow-[0_4px_0_#121410] hover:shadow-[0_6px_0_#121410] transition-all"
              >
                <summary className="font-semibold text-base sm:text-[17px] text-[#121410] cursor-pointer flex items-center justify-between gap-4 list-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] rounded-sm">
                  <span>{faq.q}</span>
                  <span className="w-6 h-6 rounded-md bg-[#F3F3EF] flex items-center justify-center text-xs font-bold group-open:rotate-45 transition-transform duration-200 shrink-0">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[#55584D] leading-relaxed pt-2 border-t border-[#EAEAE5]">
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </div>
        </section>

        {/* ====================================================
            8. INQUIRY FORM (White Section)
        ==================================================== */}
        <section id="contact" className="bg-[#F3F3EF] px-6 sm:px-10 lg:px-16 py-16 sm:py-24 border-t border-b border-[#D5D5CF]">
          <motion.div
            {...fadeInUp}
            className="max-w-[760px] mx-auto text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#121410] leading-tight">
              Tell us about{" "}
              <span className="bg-[#C6F24E] text-[#121410] px-2 py-0.5 rounded-[6px] inline-block">
                your restaurant.
              </span>
            </h2>
            <p className="mt-3 text-[#55584D] text-base leading-relaxed">
              Share a few details and we&apos;ll get back to you to set up your menu.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className="max-w-[580px] mx-auto bg-white border-2 border-[#121410] rounded-3xl p-6 sm:p-9 shadow-[0_5px_0_#121410]"
          >
            {submitSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#C6F24E] text-[#121410] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#121410]">Message Received</h3>
                <p className="text-sm text-[#55584D]">
                  Thank you! We&apos;ll get in touch with you shortly on Phone or Viber to set up your menu.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-4 text-xs font-semibold text-[#121410] underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] py-1 px-1.5 inline-block active:scale-[0.98]"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium" role="alert">
                    {submitError}
                  </div>
                )}

                <div>
                  <label htmlFor="inquiry-name" className="block text-xs font-bold text-[#121410] mb-1.5">
                    Your name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="inquiry-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ko Aung"
                    className="w-full bg-[#F3F3EF] border border-[#D5D5CF] rounded-xl px-4 py-3 text-sm text-[#121410] placeholder:text-[#55584D] focus:outline-none focus:ring-2 focus:ring-[#121410] transition-all font-medium min-h-[48px]"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-phone" className="block text-xs font-bold text-[#121410] mb-1.5">
                    Phone or Viber <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="inquiry-phone"
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09..."
                    className="w-full bg-[#F3F3EF] border border-[#D5D5CF] rounded-xl px-4 py-3 text-sm text-[#121410] placeholder:text-[#55584D] focus:outline-none focus:ring-2 focus:ring-[#121410] transition-all font-medium min-h-[48px]"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-restaurant" className="block text-xs font-bold text-[#121410] mb-1.5">
                    Restaurant name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="inquiry-restaurant"
                    type="text"
                    required
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="e.g. Tea Leaf Café"
                    className="w-full bg-[#F3F3EF] border border-[#D5D5CF] rounded-xl px-4 py-3 text-sm text-[#121410] placeholder:text-[#55584D] focus:outline-none focus:ring-2 focus:ring-[#121410] transition-all font-medium min-h-[48px]"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-township" className="block text-xs font-bold text-[#121410] mb-1.5">
                    Township <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="inquiry-township"
                    type="text"
                    required
                    value={township}
                    onChange={(e) => setTownship(e.target.value)}
                    placeholder="e.g. Bahan, Yangon"
                    className="w-full bg-[#F3F3EF] border border-[#D5D5CF] rounded-xl px-4 py-3 text-sm text-[#121410] placeholder:text-[#55584D] focus:outline-none focus:ring-2 focus:ring-[#121410] transition-all font-medium min-h-[48px]"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-message" className="block text-xs font-bold text-[#121410] mb-1.5">
                    Message <span className="text-[11px] font-normal text-[#55584D]">(optional)</span>
                  </label>
                  <textarea
                    id="inquiry-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any specific questions about your menu?"
                    className="w-full bg-[#F3F3EF] border border-[#D5D5CF] rounded-xl px-4 py-3 text-sm text-[#121410] placeholder:text-[#55584D] focus:outline-none focus:ring-2 focus:ring-[#121410] transition-all font-medium"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full min-h-[48px] px-6 py-3 rounded-[10px] bg-[#121410] text-white font-semibold text-sm hover:bg-[#232720] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] focus-visible:ring-offset-2 flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 active:scale-[0.98]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </section>

        {/* ====================================================
            9. FINAL CTA (Black Panel)
        ==================================================== */}
        <section className="px-4 sm:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className="bg-[#121410] text-white rounded-3xl p-8 sm:p-14 text-center border-2 border-[#121410] shadow-[0_5px_0_#C6F24E]"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-white leading-tight max-w-[620px] mx-auto">
              Ready to{" "}
              <span className="bg-[#C6F24E] text-[#121410] px-2 py-0.5 rounded-[6px] inline-block">
                upgrade
              </span>{" "}
              your menu?
            </h2>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/menu?demo=true"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-[10px] bg-[#C6F24E] text-[#121410] font-semibold text-sm hover:bg-[#b5e03e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F24E] focus-visible:ring-offset-2 active:scale-[0.98]"
              >
                Explore the live demo
              </Link>
              <a
                href="#contact"
                onClick={scrollToContact}
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-[10px] border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 active:scale-[0.98]"
              >
                Talk to MOSSQR
              </a>
            </div>
          </motion.div>
        </section>
        </main>

        {/* ====================================================
            10. FOOTER (Halftone Wordmark Footer as rounded card)
        ==================================================== */}
        <footer className="px-4 sm:px-8 pb-8" aria-label="Site Footer">
          <div className="rounded-3xl overflow-hidden border-2 border-[#121410] shadow-[0_5px_0_#121410]">
            <HalftoneWordmarkFooter
              wordmark="mossqr"
              label="MOSSQR"
              meta="Digital menus for restaurants & cafés"
              palette={{
                background: "#121410",
                ink: "#F6F3EA",
                warm: "#C6F24E",
              }}
              fontFamily='"Fraunces", Georgia, serif'
              fontWeight={900}
              height="520px"
              columns={[
                {
                  title: "Product",
                  links: [
                    { label: "How it works", href: "#how-it-works" },
                    { label: "Pricing", href: "#pricing" },
                    { label: "FAQ", href: "#faq" },
                  ],
                },
                {
                  title: "Demo",
                  links: [
                    { label: "Explore the live demo", href: "/menu?demo=true" },
                  ],
                },
                {
                  title: "Contact",
                  links: [
                    { label: "Telegram", href: "https://t.me/mossqrSupport" },
                    { label: "Viber 09969069005", href: "viber://chat?number=%2B959969069005" },
                    { label: "TikTok", href: "https://www.tiktok.com/@mossqr" },
                  ],
                },
              ]}
            />
          </div>
        </footer>

      </div>
    </div>
  );
}
