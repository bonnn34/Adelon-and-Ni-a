"use client"

import { RisingHearts } from "@/components/rising-hearts"
import "@/components/loader/loading-screen.css"

type SectionBackdropProps = {
  /** Pink paper wash over what's behind. Off on the loader / envelope screens,
   *  whose photo background already has its own blush veil. */
  wash?: boolean
  /** Full-screen overlays (loader, envelope): one screen-high layer pinned to the
   *  viewport instead of bands that scroll with a tall section. */
  overlay?: boolean
}

/**
 * Shared section background, laid over the circle pattern (PlainBubbles):
 * the love story's soft pink paper wash + grain (loading-screen.css → .love-story-bg)
 * and small pink hearts rising from top to bottom (rising-hearts.tsx).
 * Replaces the old `.section-wash` overlay. Put it right after <PlainBubbles />.
 */
export function SectionBackdrop({ wash = true, overlay = false }: SectionBackdropProps) {
  return (
    <div
      className={`pointer-events-none inset-0 overflow-hidden ${overlay ? "fixed z-[1]" : "absolute z-[2]"}`}
      aria-hidden="true"
    >
      <div className="love-story-bg" style={wash ? undefined : { background: "none" }}>
        <span className="love-story-bg__grain" />
      </div>
      <RisingHearts dense fill={!overlay} />
    </div>
  )
}
