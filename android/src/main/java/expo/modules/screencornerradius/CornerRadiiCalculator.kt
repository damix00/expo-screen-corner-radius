package expo.modules.screencornerradius

// Pure helpers, kept free of Android framework types so they can be unit tested on the JVM.
object CornerRadiiCalculator {
  /** Converts a radius in physical pixels to dp, rounding down to match earlier releases. */
  fun pxToDp(px: Int, density: Float): Int = (px / density).toInt()

  /**
   * Builds the per-corner map returned to JavaScript. Corners the system doesn't report count
   * as 0. Returns null when no corner is reported at all.
   */
  fun toRadiiMap(
    topLeftPx: Int?,
    topRightPx: Int?,
    bottomLeftPx: Int?,
    bottomRightPx: Int?,
    density: Float
  ): Map<String, Int>? {
    if (topLeftPx == null && topRightPx == null && bottomLeftPx == null && bottomRightPx == null) {
      return null
    }
    return mapOf(
      "topLeft" to pxToDp(topLeftPx ?: 0, density),
      "topRight" to pxToDp(topRightPx ?: 0, density),
      "bottomLeft" to pxToDp(bottomLeftPx ?: 0, density),
      "bottomRight" to pxToDp(bottomRightPx ?: 0, density)
    )
  }

  /** The largest corner, which is what `getCornerRadius` returns. */
  fun largest(radii: Map<String, Int>?): Int? = radii?.values?.maxOrNull()
}
