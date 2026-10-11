"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "motion/react"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { useAudio } from "@/contexts/audio-context"
import { useSiteConfig } from "@/hooks/use-site-config"
import { siteConfig as defaultSiteConfig } from "@/content/site"
import { layeredSectionTitleSize, sectionType } from "@/lib/section-typography"
import localFont from "next/font/local"
import Image from "next/image"
import React from "react"
import "@/components/loader/loading-screen.css"
import { SkyBackdrop } from "@/components/sky-backdrop"

const theSeasons = localFont({
  src: "../../Font/Fontspring-DEMO-theseasons-reg.otf",
  display: "swap",
  variable: "--font-the-seasons",
})

const aboveTheBeyond = localFont({
  src: "../../Font/above-the-beyond-script.otf",
  display: "swap",
  variable: "--font-above-beyond",
})

const videoFrameStyle = {
  borderColor: "color-mix(in srgb, var(--color-motif-medium) 60%, transparent)",
  background: "#FFFFFF",
  boxShadow:
    "0 0 0 6px rgb(255 255 255 / 55%), 0 18px 40px -18px color-mix(in srgb, var(--color-welcome-navy) 35%, transparent)",
} as const

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span
        className="h-px w-10 sm:w-16"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--color-motif-yellow))",
        }}
      />
      <span className="h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5" style={{ background: "var(--color-motif-accent)" }} aria-hidden />
      <span
        className="h-px w-10 sm:w-16"
        style={{
          background:
            "linear-gradient(to left, transparent, var(--color-motif-yellow))",
        }}
      />
    </div>
  )
}

function CoupleVideoTitle({ title, script }: { title: string; script: string }) {
  return (
    <h2
      className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--title-size": layeredSectionTitleSize.main,
          "--script-size": layeredSectionTitleSize.script,
        } as React.CSSProperties
      }
    >
      <span
        className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em] md:tracking-[0.14em]`}
        style={{
          fontSize: "var(--title-size)",
          color: "var(--color-welcome-navy)",
        }}
      >
        {title}
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} relative z-10 mx-auto mt-1.5 block w-fit max-w-full px-1 leading-[0.88] sm:mt-2 sm:leading-[0.9] md:mt-2.5`}
        style={{
          fontSize: "var(--script-size)",
          color: "var(--color-welcome-heading)",
          textShadow: "0 1px 0 rgb(255 255 255 / 80%)",
        }}
      >
        {script}
      </span>
      <span className="sr-only">{script}</span>
    </h2>
  )
}

// YouTube player states (IFrame API)
const YT_PLAYING = 1
const YT_PAUSED = 2
const YT_ENDED = 0
// YouTube flashes the video title for a few seconds when playback starts;
// the cover stays up until it has gone.
const TITLE_HIDE_MS = 3000

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00"
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, "0")}`
}

function loadYouTubeApi(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve()
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      document.head.appendChild(tag)
    }
  })
}

/**
 * One player surface for both sources. A self-hosted file uses a plain <video>;
 * a YouTube ID uses the IFrame API with its UI switched off, a click shield over
 * the frame and our own controls, so no YouTube branding is shown.
 */
function useVideoPlayer(videoSrc: string, youtubeId: string, started: boolean) {
  const { pauseMusic, resumeMusic } = useAudio()
  const nativeRef = useRef<HTMLVideoElement>(null)
  const ytHostRef = useRef<HTMLDivElement>(null)
  const ytRef = useRef<any>(null)
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)
  const [revealed, setRevealed] = useState(false) // frame visible (title flash has passed)
  const [muted, setMuted] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const useNative = Boolean(videoSrc)

  const onPlay = useCallback(() => {
    setPlaying(true)
    setEnded(false)
    pauseMusic()
  }, [pauseMusic])
  const onPause = useCallback(() => {
    setPlaying(false)
    resumeMusic()
  }, [resumeMusic])
  const onEnd = useCallback(() => {
    setPlaying(false)
    setEnded(true)
    setRevealed(false)
    resumeMusic()
  }, [resumeMusic])

  // YouTube: build the player once the visitor presses play
  useEffect(() => {
    if (useNative || !started || !ytHostRef.current) return
    let cancelled = false
    let revealTimer: ReturnType<typeof setTimeout> | undefined
    const host = ytHostRef.current
    loadYouTubeApi().then(() => {
      if (cancelled) return
      // YouTube replaces the element it is given, so hand it a child React doesn't manage
      const mount = document.createElement("div")
      host.appendChild(mount)
      ytRef.current = new window.YT.Player(mount, {
        videoId: youtubeId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: any) => {
            setDuration(e.target.getDuration() || 0)
            e.target.playVideo()
          },
          onStateChange: (e: any) => {
            if (e.data === YT_PLAYING) {
              onPlay()
              setDuration(e.target.getDuration() || 0)
              clearTimeout(revealTimer)
              revealTimer = setTimeout(() => setRevealed(true), TITLE_HIDE_MS)
            } else if (e.data === YT_PAUSED) {
              clearTimeout(revealTimer)
              onPause()
            } else if (e.data === YT_ENDED) {
              clearTimeout(revealTimer)
              onEnd()
            }
          },
        },
      })
    })
    return () => {
      cancelled = true
      clearTimeout(revealTimer)
      try {
        ytRef.current?.destroy?.()
      } catch {
        // ignore
      }
      ytRef.current = null
      host.replaceChildren()
    }
  }, [useNative, started, youtubeId, onPlay, onPause, onEnd])

  // Native: start as soon as the visitor presses play
  useEffect(() => {
    if (!useNative || !started) return
    const v = nativeRef.current
    if (!v) return
    v.play().catch(() => setPlaying(false))
  }, [useNative, started])

  // Progress
  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      if (useNative) {
        const v = nativeRef.current
        if (v) setTime(v.currentTime)
      } else if (ytRef.current?.getCurrentTime) {
        setTime(ytRef.current.getCurrentTime())
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [playing, useNative])

  const play = () => {
    if (useNative) nativeRef.current?.play().catch(() => {})
    else ytRef.current?.playVideo?.()
  }
  const pause = () => {
    if (useNative) nativeRef.current?.pause()
    else ytRef.current?.pauseVideo?.()
  }
  const toggle = () => (playing ? pause() : play())
  const seek = (fraction: number) => {
    const t = Math.max(0, Math.min(1, fraction)) * duration
    if (useNative) {
      if (nativeRef.current) nativeRef.current.currentTime = t
    } else ytRef.current?.seekTo?.(t, true)
    setTime(t)
  }
  const toggleMute = () => {
    const next = !muted
    if (useNative) {
      if (nativeRef.current) nativeRef.current.muted = next
    } else if (next) ytRef.current?.mute?.()
    else ytRef.current?.unMute?.()
    setMuted(next)
  }

  return {
    useNative, nativeRef, ytHostRef, playing, ended, revealed: useNative ? playing || time > 0 : revealed,
    muted, time, duration, setDuration, setTime, onPlay, onPause, onEnd,
    toggle, play, seek, toggleMute,
  }
}

// skyBackdrop: false when a parent already paints one sky behind this and the next section
export function CoupleVideo({ skyBackdrop = true }: { skyBackdrop?: boolean } = {}) {
  const siteConfig = useSiteConfig()
  // Fall back to the bundled config if a remote override is missing this block.
  const content = siteConfig.coupleVideo ?? defaultSiteConfig.coupleVideo
  const videoSrc = content.videoSrc ?? ""

  const [started, setStarted] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const player = useVideoPlayer(videoSrc, content.youtubeId, started)

  // The cover hides YouTube's own start / pause / end screens
  const showCover = !started || !player.revealed || !player.playing
  const progress = player.duration ? player.time / player.duration : 0

  const handleStart = () => {
    if (!started) setStarted(true)
    else if (player.ended) {
      player.seek(0)
      player.play()
    } else player.toggle()
  }

  const goFullscreen = () => {
    const el = frameRef.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen?.()
    else el.requestFullscreen?.()
  }

  return (
    <section
      id="couple-video"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative w-full overflow-hidden px-4 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10 md:pb-16 md:pt-12`}
    >
      {skyBackdrop && <SkyBackdrop sun />}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.65, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative z-20 mx-auto w-full max-w-5xl @container/couple-video"
      >
        <header className="text-center">
          <OrnamentalDivider />
          <div className="mx-auto mt-4 sm:mt-5 md:mt-6">
            <CoupleVideoTitle title={content.title} script={content.script} />
          </div>
          <p
            className={`font-goudy-italic mx-auto mt-4 max-w-xl sm:mt-5 md:mt-6 ${sectionType.textSnug}`}
            style={{ color: "var(--color-welcome-text)" }}
          >
            {content.subtitle}
          </p>
        </header>

        <div className="mt-6 sm:mt-8 md:mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative group"
          >
            <div
              ref={frameRef}
              className="relative overflow-hidden rounded-lg border bg-black sm:rounded-xl md:rounded-2xl"
              style={videoFrameStyle}
            >
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                {/* Video layer */}
                {started && (
                  <div className="absolute inset-0 overflow-hidden bg-black">
                    {player.useNative ? (
                      <video
                        ref={player.nativeRef}
                        src={encodeURI(videoSrc)}
                        className="absolute inset-0 h-full w-full object-cover"
                        playsInline
                        preload="auto"
                        onPlay={player.onPlay}
                        onPause={player.onPause}
                        onEnded={player.onEnd}
                        onLoadedMetadata={(e) => player.setDuration(e.currentTarget.duration)}
                        onTimeUpdate={(e) => player.setTime(e.currentTarget.currentTime)}
                      />
                    ) : (
                      // Slightly enlarged so the edges (where YouTube puts its logo) fall outside the frame
                      <div className="absolute left-1/2 top-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2">
                        <div ref={player.ytHostRef} className="h-full w-full [&_iframe]:h-full [&_iframe]:w-full" />
                      </div>
                    )}
                  </div>
                )}

                {/* Click shield: taps toggle play/pause and never reach YouTube's UI */}
                {started && (
                  <button
                    type="button"
                    className="absolute inset-0 z-10 cursor-pointer"
                    aria-label={player.playing ? "Pause video" : "Play video"}
                    onClick={handleStart}
                  />
                )}

                {/* Cover: before playing, while paused or finished, and during YouTube's title flash */}
                <div
                  className={`absolute inset-0 z-20 overflow-hidden transition-opacity duration-700 ${
                    showCover ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  <button
                    type="button"
                    className="absolute inset-0 h-full w-full cursor-pointer"
                    onClick={handleStart}
                    aria-label={content.playLabel}
                  >
                    <Image
                      src={encodeURI(content.thumbnail)}
                      alt={content.thumbnailAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      priority
                    />
                    <span
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, color-mix(in srgb, var(--color-welcome-navy) 45%, transparent), transparent 60%)",
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="relative flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20 md:h-24 md:w-24"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--color-welcome-heading) 92%, transparent)",
                          border: "2px solid rgb(255 255 255 / 85%)",
                          boxShadow:
                            "0 0 0 6px rgb(255 255 255 / 25%), 0 10px 26px color-mix(in srgb, var(--color-welcome-navy) 35%, transparent)",
                        }}
                      >
                        {started && player.playing ? (
                          // Playing but YouTube's title is still on screen: gentle loading pulse
                          <span className="h-3 w-3 animate-ping rounded-full bg-white" aria-hidden />
                        ) : (
                          <Play className="ml-1 h-8 w-8 fill-current text-white sm:h-10 sm:w-10 md:h-12 md:w-12" />
                        )}
                      </span>
                    </span>
                  </button>
                </div>

                {/* Our own controls */}
                {started && (
                  <div
                    className={`absolute inset-x-0 bottom-0 z-30 flex items-center gap-3 px-3 pb-2.5 pt-8 transition-opacity duration-300 sm:px-4 sm:pb-3 ${
                      player.playing && player.revealed ? "opacity-0 group-hover:opacity-100 focus-within:opacity-100" : "opacity-100"
                    }`}
                    style={{
                      background:
                        "linear-gradient(to top, color-mix(in srgb, var(--color-welcome-navy) 70%, transparent), transparent)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleStart}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/15"
                      aria-label={player.playing ? "Pause" : "Play"}
                    >
                      {player.playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
                    </button>
                    <div
                      className="relative h-1 flex-1 cursor-pointer rounded-full bg-white/30"
                      role="slider"
                      aria-label="Seek"
                      aria-valuemin={0}
                      aria-valuemax={Math.round(player.duration)}
                      aria-valuenow={Math.round(player.time)}
                      tabIndex={0}
                      onClick={(e) => {
                        const r = e.currentTarget.getBoundingClientRect()
                        player.seek((e.clientX - r.left) / r.width)
                      }}
                      onKeyDown={(e) => {
                        if (!player.duration) return
                        if (e.key === "ArrowRight") player.seek((player.time + 5) / player.duration)
                        if (e.key === "ArrowLeft") player.seek((player.time - 5) / player.duration)
                      }}
                    >
                      <span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ width: `${progress * 100}%`, background: "var(--color-motif-medium)" }}
                      />
                      <span
                        className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{ left: `${progress * 100}%`, background: "var(--color-motif-accent)" }}
                      />
                    </div>
                    <span
                      className="shrink-0 text-[0.62rem] tracking-[0.12em] text-white/90 tabular-nums"
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                      {formatTime(player.time)} / {formatTime(player.duration)}
                    </span>
                    <button
                      type="button"
                      onClick={player.toggleMute}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/15"
                      aria-label={player.muted ? "Unmute" : "Mute"}
                    >
                      {player.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={goFullscreen}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/15"
                      aria-label="Full screen"
                    >
                      <Maximize className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <footer
          className="mt-8 space-y-4 border-t pt-6 text-center sm:mt-10 sm:space-y-5 sm:pt-8 md:mt-12"
          style={{
            borderColor: "color-mix(in srgb, var(--color-motif-medium) 45%, transparent)",
          }}
        >
          <OrnamentalDivider />
          <p
            className={`font-goudy-italic mx-auto max-w-lg ${sectionType.textSnug}`}
            style={{ color: "var(--color-welcome-navy)" }}
          >
            {content.closingNote}
          </p>
        </footer>
      </motion.div>
    </section>
  )
}
