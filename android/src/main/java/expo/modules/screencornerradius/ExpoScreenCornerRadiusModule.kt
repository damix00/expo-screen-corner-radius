package expo.modules.screencornerradius

import android.os.Build
import android.app.Activity
import android.view.Window
import android.view.RoundedCorner // <-- ADDED: Explicitly import the RoundedCorner class
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoScreenCornerRadiusModule : Module() {
  // Helper to safely retrieve the current Activity, which is needed to access window properties.
  private val currentActivity: Activity?
    get() = appContext.currentActivity


  private fun getCornerRadiusSync(): Int? {
    val activity = currentActivity ?: return null

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      val window: Window? = activity.window
      val insets = window?.decorView?.rootWindowInsets

      val pxRadius = insets
        ?.getRoundedCorner(RoundedCorner.POSITION_TOP_LEFT)
        ?.radius
        ?: return null

      val density = activity.resources.displayMetrics.density
      val dpRadius = (pxRadius / density).toInt()

      return dpRadius
    }

    return null
  }

  // Each module class must implement the definition function.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module.
    Name("ExpoScreenCornerRadius")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    // This function attempts to return the radius of the top-left screen corner in pixels.
    Function("getCornerRadiusSync") {
      return@Function getCornerRadiusSync()
    }

    AsyncFunction("getCornerRadius") {
      return@AsyncFunction getCornerRadiusSync()
    }
  }
}
