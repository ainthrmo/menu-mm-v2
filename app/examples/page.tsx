import Link from "next/link";

const examples = [
  {
    name: "Koura Bistro",
    type: "Restaurant",
    description: "A clean dinner menu built around rich food photography and simple categories.",
    dishes: ["Lamb ragu", "Herb chicken", "Mushroom toast"],
    accent: "#C4694E",
  },
  {
    name: "Moss Café",
    type: "Café",
    description: "A compact café menu that makes drinks, desserts, and daily specials easy to browse.",
    dishes: ["Iced latte", "Matcha cream", "Lemon tart"],
    accent: "#7D8C48",
  },
  {
    name: "Sakura Kitchen",
    type: "Restaurant",
    description: "A mobile-first menu designed to help guests find dishes quickly without a paper menu.",
    dishes: ["Miso ramen", "Teriyaki bowl", "Panna cotta"],
    accent: "#C2677A",
  },
];

export default function ExamplesPage() {
  return (
    <main className="min-h-screen" style={{ background: "#F4F1EA", color: "#2B2A26" }}>
      <nav className="mx-auto flex h-[64px] max-w-[1120px] items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2.5 select-none" aria-label="Moss home">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "#2B2A26" }}
          >
            <span
              className="text-sm font-bold leading-none"
              style={{ color: "#A8CC3C", fontFamily: "Georgia, serif" }}
            >
              Q
            </span>
          </span>
          <span
            className="text-[15px] font-medium"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Moss
          </span>
        </Link>

        <Link
          href="/auth/sign-up"
          className="rounded-lg px-4 py-2 text-[13.5px] font-medium transition-opacity hover:opacity-80"
          style={{ background: "#2B2A26", color: "#F4F1EA" }}
        >
          Get started
        </Link>
      </nav>

      <section className="mx-auto max-w-[1120px] px-6 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
        <div className="max-w-[700px]">
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: "#3B6D11" }}
          >
            Moss examples
          </p>
          <h1
            className="text-4xl leading-tight md:text-6xl"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 400 }}
          >
            See what your digital menu can look like.
          </h1>
          <p
            className="mt-6 max-w-[620px] text-base leading-7 md:text-lg"
            style={{ color: "rgba(43,42,38,0.65)" }}
          >
            Explore a few Moss menu concepts for restaurants and cafés. Each one is designed to feel simple, polished, and effortless to browse on a phone.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {examples.map((example) => (
            <article
              key={example.name}
              className="overflow-hidden rounded-2xl border"
              style={{ background: "#FBFAF6", borderColor: "rgba(43,42,38,0.1)" }}
            >
              <div className="p-5" style={{ background: example.accent }}>
                <div className="flex items-center justify-between text-xs font-medium" style={{ color: "rgba(255,255,255,0.82)" }}>
                  <span>{example.type}</span>
                  <span>QR MENU</span>
                </div>
                <div className="mt-16 rounded-xl p-4" style={{ background: "#FBFAF6", color: "#2B2A26" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(43,42,38,0.45)" }}>
                    {example.name}
                  </p>
                  <p className="mt-2 text-xl" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                    Today&apos;s menu
                  </p>
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-lg font-semibold">{example.name}</h2>
                <p className="mt-2 text-sm leading-6" style={{ color: "rgba(43,42,38,0.62)" }}>
                  {example.description}
                </p>
                <div className="mt-5 space-y-2">
                  {example.dishes.map((dish) => (
                    <div
                      key={dish}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm"
                      style={{ background: "#F4F1EA" }}
                    >
                      <span>{dish}</span>
                      <span style={{ color: "rgba(43,42,38,0.35)" }}>›</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section
          className="mt-16 rounded-2xl px-6 py-12 text-center md:px-12"
          style={{ background: "#E1E8CE" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#3B6D11" }}>
            Ready for yours?
          </p>
          <h2
            className="mx-auto mt-3 max-w-[620px] text-3xl md:text-4xl"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 400 }}
          >
            Turn your restaurant menu into a better mobile experience.
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-sm leading-6" style={{ color: "rgba(43,42,38,0.62)" }}>
            Set up your Moss menu and start sharing it with a QR code.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-7 inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium transition-opacity hover:opacity-85"
            style={{ background: "#3B6D11", color: "#F4F1EA" }}
          >
            Create your Moss menu
          </Link>
        </section>
      </section>
    </main>
  );
}
