package expo.modules.screencornerradius

import kotlin.math.roundToLong

// Pure helpers, kept free of Android framework types so they can be unit tested on the JVM.
object CornerRadiiCalculator {
  /**
   * Converts a radius in physical pixels to dp, rounded to two decimal places so values match
   * the precision iOS reports (for example 39.33).
   */
  fun pxToDp(px: Int, density: Float): Double {
    if (density <= 0f) return 0.0
    return (px / density.toDouble() * 100).roundToLong() / 100.0
  }

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
  ): Map<String, Double>? {
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
  fun largest(radii: Map<String, Double>?): Double? = radii?.values?.maxOrNull()
}
