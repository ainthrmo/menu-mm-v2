'use client'
import { ArrowRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Solution', href: '#solution' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
]

export function HeroSection({
    title = "Still reprinting your menu every time the price changes?",
    highlight = "Moss.",
    description = "MOSSQR gives your restaurant a digital menu you can update from your phone. Change prices, dishes, photos, or availability without printing a new menu every time.",
    bannerBadge = "New",
    bannerText = "Real-time digital menu for restaurants",
    bannerHref = "#solution",
    ctaText = "Get Started",
    ctaHref = "/auth/sign-up",
    loginHref = "/auth/login",
    bullets = ["Instant price updates", "Bilingual EN / မြန်မာ", "No customer app needed"],
    imageDark = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80",
    imageLight = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80",
    withNav = false,
    language = "en",
}: {
    title?: string
    highlight?: string
    description?: string
    bannerBadge?: string
    bannerText?: string
    bannerHref?: string
    ctaText?: string
    ctaHref?: string
    loginHref?: string
    bullets?: string[]
    imageDark?: string
    imageLight?: string
    withNav?: boolean
    language?: "en" | "my"
}) {
    const [menuState, setMenuState] = useState(false)
    return (
        <>
            {withNav && (
                <header>
                    <nav
                        data-state={menuState && 'active'}
                        className="group fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
                        <div className="m-auto max-w-5xl px-6">
                            <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                                <div className="flex w-full justify-between lg:w-auto">
                                    <Link
                                        href="/"
                                        aria-label="home"
                                        className="flex items-center space-x-2">
                                        <Logo />
                                    </Link>

                                    <button
                                        onClick={() => setMenuState(!menuState)}
                                        aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                        className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                        <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                        <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                                    </button>
                                </div>

                                <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                                    <div className="lg:pr-4">
                                        <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                                            {menuItems.map((item, index) => (
                                                <li key={index}>
                                                    <Link
                                                        href={item.href}
                                                        className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                        <span>{item.name}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                                        <Link
                                            href={loginHref}
                                            className="inline-flex items-center justify-center h-9 px-3 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                                            Login
                                        </Link>

                                        <Link
                                            href={ctaHref}
                                            className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-[#c8f04a] text-[#141A12] text-sm font-semibold hover:bg-[#bde63d] transition-colors">
                                            Get Started
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
            )}

            <main>
                <section className="overflow-hidden">
                    <div className="relative mx-auto max-w-5xl px-6 py-20 lg:py-24">
                        <div className="lg:flex lg:items-center lg:gap-12">
                            <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
                                <Link
                                    href={bannerHref}
                                    className="rounded-lg mx-auto flex w-fit items-center gap-2 border border-border/80 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm p-1 pr-3 lg:ml-0 shadow-xs">
                                    <span className="bg-[#c8f04a] text-[#141A12] rounded-[calc(var(--radius)-0.25rem)] px-2 py-0.5 text-xs font-semibold">{bannerBadge}</span>
                                    <span className="text-sm font-medium text-foreground">{bannerText}</span>
                                    <span className="bg-border block h-4 w-px"></span>

                                    <ArrowRight className="size-4 text-muted-foreground" />
                                </Link>

                                <h1 className="mt-8 text-balance text-4xl font-bold font-fraunces md:text-5xl xl:text-5xl text-foreground leading-[1.15]">
                                    {title} {highlight && <span className="text-[#3b6d11] dark:text-[#c8f04a]">{highlight}</span>}
                                </h1>
                                <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">{description}</p>

                                <div>
                                    <div className="mx-auto my-8 max-w-sm lg:my-10 lg:ml-0 lg:mr-auto flex flex-col sm:flex-row gap-3">
                                        <Link
                                            href={ctaHref}
                                            className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[0.85rem] bg-[#c8f04a] text-[#141A12] text-sm font-semibold hover:bg-[#bde63d] transition-colors shadow-sm"
                                        >
                                            {ctaText}
                                            <ArrowRight className="size-4" />
                                        </Link>
                                        <Link
                                            href="/examples"
                                            className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-[0.85rem] border border-border bg-background/60 text-foreground text-sm font-medium hover:bg-muted/60 transition-colors backdrop-blur-sm"
                                        >
                                            {language === "my" ? "နမူနာကြည့်ရန်" : "View demo"}
                                        </Link>
                                    </div>

                                    <ul className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-xs sm:text-sm font-medium text-muted-foreground">
                                        {bullets.map((b, idx) => (
                                            <li key={idx} className="flex items-center gap-1.5">
                                                <span className="size-1.5 rounded-full bg-[#3b6d11] dark:bg-[#c8f04a]" />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 -mx-4 rounded-3xl p-3 lg:col-span-3 pointer-events-none">
                            <div aria-hidden className="absolute z-[1] inset-0 bg-gradient-to-r from-background from-45% via-background/80 to-transparent" />
                            <div className="relative h-full overflow-hidden rounded-2xl">
                                <img
                                    className="hidden dark:block object-cover w-full h-full opacity-60"
                                    src={imageDark}
                                    alt="restaurant digital menu preview"
                                    width={2796}
                                    height={2008}
                                />
                                <img
                                    className="dark:hidden object-cover w-full h-full opacity-35"
                                    src={imageLight}
                                    alt="restaurant digital menu preview"
                                    width={2796}
                                    height={2008}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <span className={cn("flex items-center gap-2", className)}>
            <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-md"
                style={{ background: "#2B2A26" }}
            >
                <span
                    className="text-xs font-bold leading-none"
                    style={{ color: "#c8f04a", fontFamily: "Georgia, serif" }}
                >
                    Q
                </span>
            </span>
            <span className="font-fraunces font-semibold text-base text-foreground tracking-tight">Moss</span>
        </span>
    )
}

export default HeroSection;
