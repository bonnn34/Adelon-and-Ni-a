/**
 * Shared "sky garden" backdrop for invitation sections (styles: app/globals.css → .sky-backdrop).
 * Sky gradient with soft drifting clouds. Top and bottom edges use the same pale
 * sky so stacked sections read as one continuous sky.
 *   sun  → warm glow in the top-right corner (use on the first section of a run)
 *   haze → faint sage haze along the bottom (use on the last section of a run)
 * Place inside a `relative` section.
 */
export function SkyBackdrop({ sun = false, haze = false }: { sun?: boolean; haze?: boolean }) {
  return (
    <div className="sky-backdrop" aria-hidden="true">
      <span className="sky-backdrop__clouds" />
      {sun && <span className="sky-backdrop__sun" />}
      {haze && <span className="sky-backdrop__haze" />}
    </div>
  )
}
