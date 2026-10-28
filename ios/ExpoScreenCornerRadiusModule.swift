import ExpoModulesCore
import UIKit

public class ExpoScreenCornerRadiusModule: Module {
  // iOS: Use UIDevice + utsname
  private func deviceModelIdentifier() -> String {
    if let simModel = ProcessInfo.processInfo.environment["SIMULATOR_MODEL_IDENTIFIER"] {
      return simModel
    }

    var systemInfo = utsname()
    uname(&systemInfo)
    let mirror = Mirror(reflecting: systemInfo.machine)
    return mirror.children.reduce("") { acc, element in
      guard let value = element.value as? Int8, value != 0 else { return acc }
      return acc + String(UnicodeScalar(UInt8(value)))
    }
  }

  /// The screen the app is on and how its interface is turned. Read from the window scene
  /// rather than `UIScreen.main`, since a device like iPhone Duo has more than one screen.
  private func activeDisplay() -> (nativeSize: CGSize, orientation: DisplayOrientation)? {
    let scenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
    guard
      let scene = scenes.first(where: { $0.activationState == .foregroundActive })
        ?? scenes.first(where: { $0.activationState == .foregroundInactive })
        ?? scenes.first
    else { return nil }

    var orientation = DisplayOrientation.portrait
    #if os(iOS)
    switch scene.effectiveGeometry.interfaceOrientation {
    case .portraitUpsideDown: orientation = .portraitUpsideDown
    case .landscapeLeft: orientation = .landscapeLeft
    case .landscapeRight: orientation = .landscapeRight
    default: orientation = .portrait
    }
    #endif

    return (scene.screen.nativeBounds.size, orientation)
  }

  private func getCornerRadiiOnMain() -> CornerRadii? {
    let idiom: DeviceIdiom
    switch UIDevice.current.userInterfaceIdiom {
    case .phone: idiom = .phone
    case .pad: idiom = .pad
    default: idiom = .other
    }

    let display = activeDisplay()
    return resolveCornerRadii(
      model: deviceModelIdentifier(),
      idiom: idiom,
      nativeSize: display?.nativeSize,
      orientation: display?.orientation ?? .portrait
    )
  }

  private func getCornerRadii() -> CornerRadii? {
    if Thread.isMainThread {
      return getCornerRadiiOnMain()
    }
    return DispatchQueue.main.sync { getCornerRadiiOnMain() }
  }

  public func definition() -> ModuleDefinition {
    Name("ExpoScreenCornerRadius")

    Function("getCornerRadiusSync") { () -> Double? in
      return self.getCornerRadii()?.largest
    }

    AsyncFunction("getCornerRadius") { () -> Double? in
      return self.getCornerRadiiOnMain()?.largest
    }.runOnQueue(.main)

    Function("getCornerRadiiSync") { () -> [String: Double]? in
      return self.getCornerRadii()?.dictionary
    }

    AsyncFunction("getCornerRadii") { () -> [String: Double]? in
      return self.getCornerRadiiOnMain()?.dictionary
    }.runOnQueue(.main)
  }
}
