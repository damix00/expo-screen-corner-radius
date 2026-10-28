import CoreGraphics

// Pure lookup logic, kept free of UIKit and ExpoModulesCore so it can be unit tested with
// `swift test` (see Package.swift at the repository root).

/// The radius of each display corner in points, named for where it appears in the interface.
struct CornerRadii: Equatable {
  var topLeft: Double
  var topRight: Double
  var bottomLeft: Double
  var bottomRight: Double

  init(topLeft: Double, topRight: Double, bottomLeft: Double, bottomRight: Double) {
    self.topLeft = topLeft
    self.topRight = topRight
    self.bottomLeft = bottomLeft
    self.bottomRight = bottomRight
  }

  init(uniform radius: Double) {
    self.init(topLeft: radius, topRight: radius, bottomLeft: radius, bottomRight: radius)
  }

  var largest: Double {
    max(topLeft, topRight, bottomLeft, bottomRight)
  }

  var dictionary: [String: Double] {
    [
      "topLeft": topLeft,
      "topRight": topRight,
      "bottomLeft": bottomLeft,
      "bottomRight": bottomRight
    ]
  }
}

/// How the interface is turned relative to the hardware, mirroring `UIInterfaceOrientation`.
enum DisplayOrientation {
  case portrait
  case portraitUpsideDown
  case landscapeLeft
  case landscapeRight
}

enum DeviceIdiom {
  case phone
  case pad
  case other
}

/// The corners of one screen of a multi-screen device, measured with the device held upright.
struct ScreenCorners {
  let nativeSize: CGSize
  let corners: CornerRadii
}

extension CornerRadii {
  /// Moves corners stored with the device upright to where they appear in the interface.
  ///
  /// The radii belong to the glass, so turning the interface moves them rather than changing
  /// them. `landscapeLeft` is the upright device turned a quarter clockwise and `landscapeRight`
  /// a quarter anticlockwise, matching `UIInterfaceOrientation`. Ported from BezelKit.
  func rotated(for orientation: DisplayOrientation) -> CornerRadii {
    switch orientation {
    case .portrait:
      return self
    case .portraitUpsideDown:
      return CornerRadii(
        topLeft: bottomRight, topRight: bottomLeft, bottomLeft: topRight, bottomRight: topLeft)
    case .landscapeLeft:
      return CornerRadii(
        topLeft: bottomLeft, topRight: topLeft, bottomLeft: bottomRight, bottomRight: topRight)
    case .landscapeRight:
      return CornerRadii(
        topLeft: topRight, topRight: bottomRight, bottomLeft: topLeft, bottomRight: bottomLeft)
    }
  }
}

/// Resolves the corners of the screen the app is on.
///
/// - Parameters:
///   - model: The hardware model identifier, such as `iPhone19,4`.
///   - idiom: Whether the device is a phone or a pad.
///   - nativeSize: `UIScreen.nativeBounds.size` of the active screen. Compared by its shorter and
///     longer side, so it doesn't matter whether the system reports it turned.
///   - orientation: The current interface orientation.
/// - Returns: The corners, or `nil` if the model is unknown.
func resolveCornerRadii(
  model: String,
  idiom: DeviceIdiom,
  nativeSize: CGSize?,
  orientation: DisplayOrientation
) -> CornerRadii? {
  let table: CornerData
  switch idiom {
  case .phone: table = iphoneRadii
  case .pad: table = ipadRadii
  case .other: return CornerRadii(uniform: 0)
  }

  guard let radius = table[model] else { return nil }
  let uniform = CornerRadii(uniform: radius)

  guard let screens = multiScreenRadii[model], let nativeSize else { return uniform }

  let target = (min(nativeSize.width, nativeSize.height), max(nativeSize.width, nativeSize.height))
  let match = screens.first { screen in
    let size = screen.nativeSize
    let short = min(size.width, size.height)
    let long = max(size.width, size.height)
    return abs(short - target.0) < 1 && abs(long - target.1) < 1
  }

  guard let match else { return uniform }
  return match.corners.rotated(for: orientation)
}
