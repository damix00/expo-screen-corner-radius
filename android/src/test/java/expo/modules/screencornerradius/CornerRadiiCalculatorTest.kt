package expo.modules.screencornerradius

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class CornerRadiiCalculatorTest {
  @Test
  fun pxToDpKeepsTwoDecimals() {
    assertEquals(39.33, CornerRadiiCalculator.pxToDp(118, 3f), 0.0)
    assertEquals(40.0, CornerRadiiCalculator.pxToDp(105, 2.625f), 0.0)
    assertEquals(47.62, CornerRadiiCalculator.pxToDp(125, 2.625f), 0.0)
  }

  @Test
  fun pxToDpHandlesZeroDensity() {
    assertEquals(0.0, CornerRadiiCalculator.pxToDp(100, 0f), 0.0)
  }

  @Test
  fun mapsAllFourCorners() {
    val radii = CornerRadiiCalculator.toRadiiMap(30, 60, 90, 120, density = 3f)
    assertEquals(
      mapOf("topLeft" to 10.0, "topRight" to 20.0, "bottomLeft" to 30.0, "bottomRight" to 40.0),
      radii
    )
  }

  @Test
  fun missingCornersCountAsZero() {
    val radii = CornerRadiiCalculator.toRadiiMap(90, null, null, 90, density = 3f)
    assertEquals(
      mapOf("topLeft" to 30.0, "topRight" to 0.0, "bottomLeft" to 0.0, "bottomRight" to 30.0),
      radii
    )
  }

  @Test
  fun noCornersReturnsNull() {
    assertNull(CornerRadiiCalculator.toRadiiMap(null, null, null, null, density = 3f))
  }

  @Test
  fun largestPicksTheMaximum() {
    val radii = CornerRadiiCalculator.toRadiiMap(30, 60, 90, 120, density = 3f)
    assertEquals(40.0, CornerRadiiCalculator.largest(radii)!!, 0.0)
    assertNull(CornerRadiiCalculator.largest(null))
  }
}
