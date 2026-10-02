import type { Metadata } from "next";
import ContactContent from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact MOSSQR — Let's Talk About Your Digital Menu",
  description:
    "Have questions about MOSSQR, pricing, or getting your digital menu set up? Reach out and we'll help you figure out what works best for your restaurant or café.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact MOSSQR — Let's Talk About Your Digital Menu",
    description:
      "Have questions about MOSSQR, pricing, or getting your digital menu set up? Reach out to our team.",
    url: "https://getmossqr.com/contact",
    siteName: "MOSSQR",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
