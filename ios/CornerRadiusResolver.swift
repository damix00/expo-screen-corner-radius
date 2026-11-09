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

/// Splits an identifier like `iPhone19,4` into its generation (19) and variant (4).
func parseModelIdentifier(_ model: String) -> (prefix: String, generation: Int, variant: Int)? {
  guard let digits = model.firstIndex(where: \.isNumber) else { return nil }
  let parts = model[digits...].split(separator: ",")
  guard parts.count == 2, let generation = Int(parts[0]), let variant = Int(parts[1]) else {
    return nil
  }
  return (String(model[..<digits]), generation, variant)
}

/// Estimates the radius of a model released after this table was last updated.
///
/// Uses the most common radius of the newest known generation. Returns `nil` for unknown models
/// that are not newer than every known model, since those are more likely to be unusual
/// hardware than a new release.
func estimateRadius(forNewerModel model: String, in table: CornerData) -> Double? {
  guard let target = parseModelIdentifier(model) else { return nil }
  let known = table.keys.compactMap(parseModelIdentifier).filter { $0.prefix == target.prefix }
  guard let newest = known.map(\.generation).max(), target.generation >= newest else {
    return nil
  }
  if target.generation == newest,
    let newestVariant = known.filter({ $0.generation == newest }).map(\.variant).max(),
    target.variant < newestVariant
  {
    return nil
  }

  var counts: [Double: Int] = [:]
  for id in known where id.generation == newest {
    if let radius = table["\(id.prefix)\(id.generation),\(id.variant)"] {
      counts[radius, default: 0] += 1
    }
  }
  // Most common radius; ties go to the larger one so the result doesn't depend on order.
  return counts.max { a, b in a.value == b.value ? a.key < b.key : a.value < b.value }?.key
}

/// Resolves the corners of the screen the app is on.
///
/// - Parameters:
///   - model: The hardware model identifier, such as `iPhone19,4`.
///   - idiom: Whether the device is a phone or a pad.
///   - nativeSize: `UIScreen.nativeBounds.size` of the active screen. Compared by its shorter and
///     longer side, so it doesn't matter whether the system reports it turned.
///   - orientation: The current interface orientation.
/// - Returns: The corners, or `nil` if the model is unknown and not newer than every known
///   model (see ``estimateRadius(forNewerModel:in:)``).
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

  guard let radius = table[model] ?? estimateRadius(forNewerModel: model, in: table) else {
    return nil
  }
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
