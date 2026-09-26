import * as React from "react"
import Link from "next/link"
import { Button, type ButtonProps } from "@/components/ui/button"

export interface CtaProps {
  ctaEnabled?: boolean
  text: string
  link?: string
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  icon?: React.ReactNode
  target?: string
  rel?: string
  className?: string
}


export function Cta({ cta }: { cta: CtaProps }) {
  if (!cta.ctaEnabled) return null

  const content = (
    <>
      {cta.text}
      {cta.icon && <span className="ml-1.5">{cta.icon}</span>}
    </>
  )

  if (cta.link) {
    const isInternal = cta.link.startsWith("/") || cta.link.startsWith("#")
    if (isInternal) {
      return (
        <Button asChild variant={cta.variant ?? "default"} size={cta.size ?? "default"} className={cta.className}>
          <Link href={cta.link}>{content}</Link>
        </Button>
      )
    }
    return (
      <Button asChild variant={cta.variant ?? "default"} size={cta.size ?? "default"} className={cta.className}>
        <a href={cta.link} target={cta.target} rel={cta.rel ?? "noreferrer"}>
          {content}
        </a>
      </Button>
    )
  }

  return (
    <Button variant={cta.variant ?? "default"} size={cta.size ?? "default"} className={cta.className}>
      {content}
    </Button>
  )
}

