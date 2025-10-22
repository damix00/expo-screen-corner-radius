import ExpoModulesCore
import UIKit

public class ExpoScreenCornerRadiusModule: Module {
  private func getCornerRadiusSync() -> Double {
    // iOS: Use UIDevice + utsname
    func deviceModelIdentifier() -> String {
      var systemInfo = utsname()
      uname(&systemInfo)
      let mirror = Mirror(reflecting: systemInfo.machine)
      let identifier = mirror.children.reduce("") { acc, element in
        guard let value = element.value as? Int8, value != 0 else { return acc }
        return acc + String(UnicodeScalar(UInt8(value)))
      }
        
        if let simModel = ProcessInfo.processInfo.environment["SIMULATOR_MODEL_IDENTIFIER"] {
            return simModel
          }
        
      return identifier
    }

    let model = deviceModelIdentifier()
    let idiom = UIDevice.current.userInterfaceIdiom

    if idiom == .phone {
      return iphoneRadii[model] ?? 0
    } else if idiom == .pad {
      return ipadRadii[model] ?? 0
    }
    return 0
  }

  public func definition() -> ModuleDefinition {
    Name("ExpoScreenCornerRadius")

    Function("getCornerRadiusSync") { () -> Double in
      return getCornerRadiusSync()
    }

    AsyncFunction("getCornerRadius") { () -> Double in
      return getCornerRadiusSync()
    }
  }
}

typealias CornerData = [String: Double]

let iphoneRadii: CornerData = [
    "iPhone1,1": 0,
    "iPhone1,2": 0,
    "iPhone2,1": 0,
    "iPhone3,1": 0,
    "iPhone3,2": 0,
    "iPhone3,3": 0,
    "iPhone4,1": 0,
    "iPhone5,1": 0,
    "iPhone5,2": 0,
    "iPhone5,3": 0,
    "iPhone5,4": 0,
    "iPhone6,1": 0,
    "iPhone6,2": 0,
    "iPhone7,1": 0,
    "iPhone7,2": 0,
    "iPhone8,1": 0,
    "iPhone8,2": 0,
    "iPhone8,4": 0,
    "iPhone9,1": 0,
    "iPhone9,2": 0,
    "iPhone9,3": 0,
    "iPhone9,4": 0,
    "iPhone10,1": 0,
    "iPhone10,2": 0,
    "iPhone10,3": 39,
    "iPhone10,4": 0,
    "iPhone10,5": 0,
    "iPhone10,6": 39,
    "iPhone11,2": 39,
    "iPhone11,4": 39,
    "iPhone11,6": 39,
    "iPhone11,8": 41.5,
    "iPhone12,1": 41.5,
    "iPhone12,3": 39,
    "iPhone12,5": 39,
    "iPhone12,8": 0,
    "iPhone13,1": 44,
    "iPhone13,2": 47.33,
    "iPhone13,3": 47.33,
    "iPhone13,4": 53.33,
    "iPhone14,2": 47.33,
    "iPhone14,3": 53.33,
    "iPhone14,4": 44,
    "iPhone14,5": 47.33,
    "iPhone14,6": 0,
    "iPhone14,7": 47.33,
    "iPhone14,8": 53.33,
    "iPhone15,2": 55,
    "iPhone15,3": 55,
    "iPhone15,4": 55,
    "iPhone15,5": 55,
    "iPhone16,1": 55,
    "iPhone16,2": 55,
    "iPhone17,1": 62,
    "iPhone17,2": 62,
    "iPhone17,3": 55,
    "iPhone17,4": 55,
    "iPhone17,5": 47.33,
    "iPhone18,1": 62,
    "iPhone18,2": 62,
    "iPhone18,3": 62,
    "iPhone18,4": 62,
]

let ipadRadii: CornerData = [
    "iPad1,1": 0,
    "iPad2,1": 0,
    "iPad2,2": 0,
    "iPad2,3": 0,
    "iPad2,4": 0,
    "iPad2,5": 0,
    "iPad2,6": 0,
    "iPad2,7": 0,
    "iPad3,1": 0,
    "iPad3,2": 0,
    "iPad3,3": 0,
    "iPad3,4": 0,
    "iPad3,5": 0,
    "iPad3,6": 0,
    "iPad4,1": 0,
    "iPad4,2": 0,
    "iPad4,3": 0,
    "iPad4,4": 0,
    "iPad4,5": 0,
    "iPad4,6": 0,
    "iPad4,7": 0,
    "iPad4,8": 0,
    "iPad4,9": 0,
    "iPad5,1": 0,
    "iPad5,2": 0,
    "iPad5,3": 0,
    "iPad5,4": 0,
    "iPad6,11": 0,
    "iPad6,12": 0,
    "iPad6,3": 0,
    "iPad6,4": 0,
    "iPad7,1": 0,
    "iPad7,11": 0,
    "iPad7,12": 0,
    "iPad7,2": 0,
    "iPad7,3": 0,
    "iPad7,4": 0,
    "iPad7,5": 0,
    "iPad7,6": 0,
    "iPad8,1": 18,
    "iPad8,10": 18,
    "iPad8,11": 18,
    "iPad8,12": 18,
    "iPad8,2": 18,
    "iPad8,3": 18,
    "iPad8,4": 18,
    "iPad8,5": 18,
    "iPad8,6": 18,
    "iPad8,7": 18,
    "iPad8,8": 18,
    "iPad8,9": 18,
    "iPad11,1": 0,
    "iPad11,2": 0,
    "iPad11,3": 0,
    "iPad11,4": 0,
    "iPad11,6": 0,
    "iPad11,7": 0,
    "iPad12,1": 0,
    "iPad12,2": 0,
    "iPad13,1": 18,
    "iPad13,10": 18,
    "iPad13,11": 18,
    "iPad13,12": 18,
    "iPad13,16": 18,
    "iPad13,17": 18,
    "iPad13,18": 25,
    "iPad13,19": 25,
    "iPad13,2": 18,
    "iPad13,4": 18,
    "iPad13,5": 18,
    "iPad13,6": 18,
    "iPad13,7": 18,
    "iPad13,8": 18,
    "iPad13,9": 18,
    "iPad14,1": 21.5,
    "iPad14,10": 18,
    "iPad14,11": 18,
    "iPad14,2": 21.5,
    "iPad14,3": 18,
    "iPad14,4": 18,
    "iPad14,5": 18,
    "iPad14,6": 18,
    "iPad14,8": 18,
    "iPad14,9": 18,
    "iPad15,3": 18,
    "iPad15,5": 18,
    "iPad15,7": 25,
    "iPad16,1": 21.5,
    "iPad16,2": 21.5,
    "iPad16,3": 30,
    "iPad16,4": 30,
    "iPad16,5": 30,
    "iPad16,6": 30,
    "iPad16,7": 0,
    "iPad16,8": 0,
]
