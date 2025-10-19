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

  // Each module class must implement the definition function.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module.
    Name("ExpoScreenCornerRadius")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    // This function attempts to return the radius of the top-left screen corner in pixels.
    Function("getCornerRadius") {
      // Attempt to get the current activity. If null (e.g., app is backgrounded or detached), return 0.
      val activity = currentActivity ?: return@Function 0

      // Check Android version: RoundedCorner API is available from Android 12 (API level S).
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        
        // Get the window from the activity.
        val window: Window? = activity.window
        
        // Access the root window insets, handling potential nulls (safety checks).
        val insets = window?.decorView?.rootWindowInsets
        
        // NOTE: We call getRoundedCorner() directly on the 'insets' (WindowInsets) object, 
        // as the method is an instance method of WindowInsets, not List<RoundedCorner>.

        // Return the radius of the top-left corner, or 0 if the API or value is unavailable.
        // We use 'return@Function' to explicitly return from the outer lambda block defined by Function().
        val pxRadius = insets
          ?.getRoundedCorner(RoundedCorner.POSITION_TOP_LEFT)
          ?.radius
          ?: 0

        // Convert px → dp
        val density = activity.resources.displayMetrics.density
        val dpRadius = (pxRadius / density).toInt()

        return@Function dpRadius
      }
      
      // Return 0 for older Android versions where the API does not exist.
      return@Function 0
    }
  }
}
