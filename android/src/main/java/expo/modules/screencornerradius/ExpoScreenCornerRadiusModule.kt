package expo.modules.screencornerradius

import android.os.Build
import android.app.Activity
import android.view.RoundedCorner
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoScreenCornerRadiusModule : Module() {
  // Helper to safely retrieve the current Activity, which is needed to access window properties.
  private val currentActivity: Activity?
    get() = appContext.currentActivity

  // Reads each corner of the display the activity is on, in dp. Returns null below Android 12
  // or when the system doesn't report rounded corners.
  private fun getCornerRadii(): Map<String, Int>? {
    val activity = currentActivity ?: return null

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      val insets = activity.window?.decorView?.rootWindowInsets ?: return null

      return CornerRadiiCalculator.toRadiiMap(
        topLeftPx = insets.getRoundedCorner(RoundedCorner.POSITION_TOP_LEFT)?.radius,
        topRightPx = insets.getRoundedCorner(RoundedCorner.POSITION_TOP_RIGHT)?.radius,
        bottomLeftPx = insets.getRoundedCorner(RoundedCorner.POSITION_BOTTOM_LEFT)?.radius,
        bottomRightPx = insets.getRoundedCorner(RoundedCorner.POSITION_BOTTOM_RIGHT)?.radius,
        density = activity.resources.displayMetrics.density
      )
    }

    return null
  }

  // Each module class must implement the definition function.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module.
    Name("ExpoScreenCornerRadius")

    // Returns the largest screen corner radius in dp.
    Function("getCornerRadiusSync") {
      return@Function CornerRadiiCalculator.largest(getCornerRadii())
    }

    AsyncFunction("getCornerRadius") {
      return@AsyncFunction CornerRadiiCalculator.largest(getCornerRadii())
    }

    // Returns each screen corner radius in dp.
    Function("getCornerRadiiSync") {
      return@Function getCornerRadii()
    }

    AsyncFunction("getCornerRadii") {
      return@AsyncFunction getCornerRadii()
    }
  }
}
