package expo.modules.screencornerradius

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class CornerRadiiCalculatorTest {
  @Test
  fun pxToDpRoundsDown() {
    assertEquals(39, CornerRadiiCalculator.pxToDp(118, 3f))
    assertEquals(40, CornerRadiiCalculator.pxToDp(105, 2.625f))
  }

  @Test
  fun mapsAllFourCorners() {
    val radii = CornerRadiiCalculator.toRadiiMap(30, 60, 90, 120, density = 3f)
    assertEquals(
      mapOf("topLeft" to 10, "topRight" to 20, "bottomLeft" to 30, "bottomRight" to 40),
      radii
    )
  }

  @Test
  fun missingCornersCountAsZero() {
    val radii = CornerRadiiCalculator.toRadiiMap(90, null, null, 90, density = 3f)
    assertEquals(
      mapOf("topLeft" to 30, "topRight" to 0, "bottomLeft" to 0, "bottomRight" to 30),
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
    assertEquals(40, CornerRadiiCalculator.largest(radii))
    assertNull(CornerRadiiCalculator.largest(null))
  }
}
