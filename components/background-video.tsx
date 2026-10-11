"use client"

import { useEffect, useRef } from "react"

export const BACKGROUND_VIDEO_SRC = "/video/background-loop.mp4"

// Playback position shared between mounts, so the video carries on from the
// loading screen into the home hero instead of restarting.
let lastTime = 0

interface BackgroundVideoProps {
  src?: string
  /** Strength of the white wash over the video (0–1). Higher = more washed out. */
  veil?: number
  className?: string
}

/**
 * Looping, muted video that fills its positioned parent, with a soft white
 * wash on top. Never takes clicks; for visitors who prefer reduced motion it
 * stays paused on its first frame.
 */
export function BackgroundVideo({ src = BACKGROUND_VIDEO_SRC, veil = 0.55, className = "" }: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const resume = () => {
      if (lastTime > 0 && lastTime < video.duration) video.currentTime = lastTime
      if (!reduce) video.play().catch(() => {})
    }
    if (video.readyState >= 1) resume()
    else video.addEventListener("loadedmetadata", resume, { once: true })
    const save = () => { lastTime = video.currentTime }
    video.addEventListener("timeupdate", save)
    return () => {
      save()
      video.removeEventListener("loadedmetadata", resume)
      video.removeEventListener("timeupdate", save)
    }
  }, [src])

  return (
    <div className={`background-video ${className}`} aria-hidden="true">
      <video
        ref={ref}
        className="background-video__media"
        src={src}
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        tabIndex={-1}
      />
      <div className="background-video__veil" style={{ opacity: veil }} />
    </div>
  )
}
