"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
import { ChevronLeft } from "lucide-react"
import { useSiteConfig } from "@/hooks/use-site-config"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const aboveTheBeyond = localFont({
  src: "../../Font/above-the-beyond-script.otf",
  display: "swap",
})

// Top bar matches the main navbar: dusty blue → deep blue, white lettering, sage hairline
const BAR_BG =
  "linear-gradient(180deg, color-mix(in srgb, var(--color-welcome-heading) 88%, white) 0%, var(--color-welcome-heading) 45%, var(--color-motif-deep) 100%)"

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  const { couple } = useSiteConfig()

  useEffect(() => {
    const navbar = document.querySelector("nav") as HTMLElement | null
    if (navbar) navbar.style.display = "none"
    return () => {
      if (navbar) navbar.style.display = ""
    }
  }, [])

  return (
    <div style={{ background: "var(--color-bg-pattern-base)" }}>
      <div
        className="sticky top-0 z-50"
        style={{
          background: BAR_BG,
          boxShadow: "0 8px 22px color-mix(in srgb, var(--color-welcome-navy) 22%, transparent)",
        }}
      >
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-3 px-3 sm:h-14 sm:px-6 lg:px-8">
          <Link
            href="/#gallery"
            onClick={() => sessionStorage.setItem("returnFromGallery", "true")}
            className={`${cinzel.className} inline-flex items-center gap-1 rounded-full py-1.5 pl-2 pr-3.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-motif-accent)] sm:py-2 sm:pr-4 sm:text-[0.6875rem] sm:tracking-[0.2em]`}
            style={{
              background: "#FFFFFF",
              color: "var(--color-welcome-navy)",
              boxShadow: "0 6px 14px -8px color-mix(in srgb, var(--color-welcome-navy) 60%, transparent)",
            }}
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden min-[400px]:inline">Back to invitation</span>
            <span className="min-[400px]:hidden">Back</span>
          </Link>

          <div className="flex min-w-0 items-baseline gap-2 text-white">
            <span
              className={`${aboveTheBeyond.className} hidden truncate text-lg leading-none sm:inline sm:text-xl`}
              style={{ color: "var(--color-motif-silver)", textShadow: "0 1px 6px color-mix(in srgb, var(--color-welcome-navy) 45%, transparent)" }}
            >
              {couple.groomNickname} &amp; {couple.brideNickname}
            </span>
            <span className="hidden h-3 w-px bg-white/50 sm:inline-block" aria-hidden />
            <span
              className={`${cinzel.className} text-[0.625rem] font-semibold uppercase tracking-[0.24em] sm:text-[0.6875rem] sm:tracking-[0.28em]`}
            >
              Gallery
            </span>
          </div>
        </div>
        {/* Sage hairline along the bottom edge: sky → sage → sky */}
        <div
          className="h-[2px] w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-motif-medium) 20%, var(--color-motif-yellow) 50%, var(--color-motif-medium) 80%, transparent)",
          }}
          aria-hidden
        />
      </div>
      {children}
    </div>
  )
}
