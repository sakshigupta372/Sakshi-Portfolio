// Settings for the pull-able portrait in the hero.

/**
 * Where the photo sits in the square the renderer works in (units of that
 * square). The head rises above the disc; the shoulders are cut by it.
 */
export const PHOTO = { x: -0.235, y: -0.073, h: 1.12 }

/**
 * One photo is enough to pull, wobble and flush. To make the expression change
 * too, add pictures here with exactly the same size, framing and transparent
 * background as the base photo. Missing ones fall back to the base photo (a
 * missing grab face borrows g_grimace). Names the code looks for:
 *   grabbing   g_grimace, g_ouch (hair, ears), g_squish (cheeks)
 *   tapping    x_shock
 *   letting go x_tongue, x_laugh, x_skeptic, x_whistle, x_smug, x_cross, x_dizzy
 *   idle       l_left, l_right (eyes follow the cursor), x_cross (nose hover)
 */
export const FACES = {
  base: '/profile-cutout-clean.webp',
}

/** Faces dealt at random when a stretch is let go. */
export const releaseFaces = ['x_tongue', 'x_laugh', 'x_skeptic', 'x_whistle', 'x_smug', 'x_cross']

/**
 * Landmarks in square UV (0–1, v from the top), measured on the base photo as
 * placed by PHOTO. Re-measure them if the photo or its placement changes.
 */
export const rig = {
  disc: { x: 0.5, y: 0.58, r: 0.41 },
  nose: { x: 0.51, y: 0.455, r: 0.035 },
  cheeks: [
    { x: 0.41, y: 0.45 },
    { x: 0.6, y: 0.455 },
  ],
  face: { x: 0.507, y: 0.41, rx: 0.155, ry: 0.215 },
  hairLine: 0.2,
  /** |u − 0.5| beyond which a grab above the jaw is the ears / side hair. */
  sides: 0.16,
  cheekBand: [0.4, 0.56],
  jaw: 0.58,
}
