"use client"

import React, { useMemo } from "react"
import localFont from "next/font/local"
import { motion, useReducedMotion } from "motion/react"
import { StorySection } from "@/components/StorySection"
import { layeredSectionTitleSize, sectionType } from "@/lib/section-typography"
import { useSiteConfig } from "@/hooks/use-site-config"
import { siteConfig as defaultSiteConfig } from "@/content/site"
import { SkyBackdrop } from "@/components/sky-backdrop"
import "@/components/loader/loading-screen.css"
import { TintedDeco } from "@/components/tinted-deco"
import { StoryGlyphText } from "@/lib/story-glyph-text"

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

const revealEase = [0.22, 1, 0.36, 1] as const

// Floral corners framing the section (shown in their original artwork colors)
const LOVE_STORY_CORNERS = [
  { src: "/deco/topleftcorner.png", className: "left-0 top-0" },
  { src: "/deco/toprightcorner.png", className: "right-0 top-0" },
  { src: "/deco/bottomleftcorner.png", className: "left-0 bottom-0" },
  { src: "/deco/bottomrightcorner.png", className: "right-0 bottom-0" },
] as const

// Soft white edge so text stays crisp over the sky backdrop
const onBgGlow = "0 1px 0 rgb(255 255 255 / 85%), 0 0 12px rgb(255 255 255 / 70%)"

function formatStoryParagraph(
  paragraph: string,
  groom: string,
  bride: string,
): string {
  return paragraph
    .replace(/\{groom\}/g, groom)
    .replace(/\{bride\}/g, bride)
}

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span
        className="h-px w-10 sm:w-16"
        style={{ background: "linear-gradient(to right, transparent, var(--color-motif-yellow))" }}
      />
      <span className="h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5" style={{ background: "var(--color-motif-accent)" }} aria-hidden />
      <span
        className="h-px w-10 sm:w-16"
        style={{ background: "linear-gradient(to left, transparent, var(--color-motif-yellow))" }}
      />
    </div>
  )
}

function LoveStoryTitle({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <h1
      className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--title-size": layeredSectionTitleSize.main,
          "--script-size": layeredSectionTitleSize.script,
        } as React.CSSProperties
      }
    >
      <span
        className={`${theSeasons.className} block pb-1 uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em] md:tracking-[0.14em]`}
        style={{
          fontSize: "var(--title-size)",
          color: "var(--color-welcome-navy)",
          textShadow: onBgGlow,
        }}
      >
        <StoryGlyphText text={title} />
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto mt-2 block w-fit max-w-full px-1 leading-[0.88] sm:mt-2.5 sm:leading-[0.9] md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: "var(--color-welcome-heading)",
          textShadow: onBgGlow,
        }}
      >
        <StoryGlyphText text={subtitle} />
      </span>
      <span className="sr-only">{subtitle}</span>
    </h1>
  )
}

function chapterTextFromParagraphs(
  paragraphs: readonly string[],
  groom: string,
  bride: string,
) {
  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={
            paragraphs.length > 1 && index < paragraphs.length - 1 ? "mb-4" : undefined
          }
        >
          <StoryGlyphText text={formatStoryParagraph(paragraph, groom, bride)} />
        </p>
      ))}
    </>
  )
}

// skyBackdrop: false when a parent already paints one sky behind this and the previous section
export function LoveStory({ skyBackdrop = true }: { skyBackdrop?: boolean } = {}) {
  const siteConfig = useSiteConfig()
  const loading = siteConfig.loadingScreen ?? defaultSiteConfig.loadingScreen
  const loveStory = siteConfig.loveStory ?? defaultSiteConfig.loveStory
  const isPlain = loading.display === "plain"
  const reduceMotion = useReducedMotion()

  const groom =
    siteConfig.couple.groomNickname || siteConfig.couple.groom
  const bride =
    siteConfig.couple.brideNickname || siteConfig.couple.bride

  const chapters = useMemo(
    () => loveStory.chapters ?? defaultSiteConfig.loveStory.chapters,
    [loveStory.chapters],
  )
  const eucalyptusDecos =
    loveStory.eucalyptusDecos ?? defaultSiteConfig.loveStory.eucalyptusDecos

  return (
    <div
      id="love-story"
      className={`love-story-root ${theSeasons.variable} ${aboveTheBeyond.variable} relative min-h-screen w-full overflow-x-hidden`}
    >
      {skyBackdrop && <SkyBackdrop haze />}

      {LOVE_STORY_CORNERS.map(({ src, className }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute z-[1] h-auto w-[clamp(120px,34vw,300px)] select-none ${className}`}
        />
      ))}

      <header
        className="relative z-20 px-4 pb-2 pt-16 text-center sm:px-6 sm:pt-20 md:px-8 md:pt-24"
      >
        <motion.div
          className="relative mx-auto max-w-5xl @container/love-story"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.75, ease: revealEase }}
        >
          <LoveStoryTitle title={loveStory.title} subtitle={loveStory.subtitle} />
        </motion.div>
      </header>

      {chapters.map((chapter, index) => (
        <StorySection
          key={`${chapter.image}-${index}`}
          title={chapter.title}
          theme={chapter.theme}
          layout={chapter.layout}
          imageSrc={chapter.image}
          imageAlt={formatStoryParagraph(chapter.imageAlt ?? "", groom, bride)}
          date={chapter.date}
          text={chapterTextFromParagraphs(chapter.paragraphs, groom, bride)}
          plain={isPlain}
          chapterIndex={index}
          isFirst={index === 0}
          isLast={index === chapters.length - 1}
          eucalyptusDecos={isPlain ? eucalyptusDecos : undefined}
          chapterLabelText={loveStory.chapterLabel}
        />
      ))}

      <footer
        className="relative z-20 px-4 pb-16 pt-8 text-center sm:px-6 sm:pb-20 sm:pt-10 md:pb-24 md:px-8 md:pt-12"
      >
        <motion.div
          className="relative mx-auto max-w-xl px-2"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.75, delay: 0.08, ease: revealEase }}
        >
          <OrnamentalDivider />
          <blockquote className="mt-5 sm:mt-6">
            <p
              className={`font-goudy-italic ${sectionType.textRelaxed} italic leading-relaxed`}
              style={{ color: "var(--color-welcome-navy)", textShadow: onBgGlow }}
            >
              &ldquo;<StoryGlyphText text={loveStory.closingQuote} />&rdquo;
            </p>
            <footer
              className={`font-goudy-italic mt-2 sm:mt-3 ${sectionType.label} not-italic tracking-wide`}
              style={{ color: "var(--color-welcome-heading)", textShadow: onBgGlow }}
            >
              <StoryGlyphText text={loveStory.closingCitation} />
            </footer>
          </blockquote>
          {isPlain && eucalyptusDecos.sectionBottom ? (
            <TintedDeco src={eucalyptusDecos.sectionBottom} className="love-story-footer-euc mx-auto mt-8 sm:mt-10" />
          ) : null}
        </motion.div>
      </footer>
    </div>
  )
}
