// Four corner florals at a section's corners, sized per corner like the loader
// (styles: app/globals.css → .deco-corner--*). Original artwork colors, no tint.
// Pass "" for a corner to hide it. Place inside a `relative` container.

type CornerDecos = {
  topLeft?: string
  topRight?: string
  bottomLeft?: string
  bottomRight?: string
}

export function DecoCorners({ decos }: { decos: CornerDecos }) {
  const corners = [
    { src: decos.topLeft, pos: "tl" },
    { src: decos.topRight, pos: "tr" },
    { src: decos.bottomLeft, pos: "bl" },
    { src: decos.bottomRight, pos: "br" },
  ] as const

  return (
    <>
      {corners
        .filter(({ src }) => src)
        .map(({ src, pos }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={pos} src={src} alt="" aria-hidden="true" className={`deco-corner deco-corner--${pos}`} />
        ))}
    </>
  )
}
