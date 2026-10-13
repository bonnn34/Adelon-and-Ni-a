import { Fragment } from "react"

/**
 * Special characters that switch to the glyph font: anything that isn't a
 * letter, number or space — e.g. & _ ! ? , . ' " – — ♡ (runs stay together).
 */
const STORY_GLYPHS = /([^\p{L}\p{N}\s]+)/gu

/**
 * Renders text with special characters (e.g. "&" in "Him & Her", "!", "—") set in
 * Playfair Display italic via the `.story-glyph` class, so they don't render in
 * the surrounding display or body font.
 */
export function StoryGlyphText({ text }: { text: string }) {
  const parts = text.split(STORY_GLYPHS)
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="story-glyph">
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  )
}
