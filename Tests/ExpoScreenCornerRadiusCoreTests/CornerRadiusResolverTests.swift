import CoreGraphics
import XCTest

@testable import ExpoScreenCornerRadiusCore

final class CornerRadiusResolverTests: XCTestCase {
  private let duo = "iPhone19,4"
  private let duoOuter = CGSize(width: 1398, height: 2034)
  private let duoInner = CGSize(width: 2007, height: 2853)

  private func resolve(
    _ model: String,
    idiom: DeviceIdiom = .phone,
    nativeSize: CGSize? = nil,
    orientation: DisplayOrientation = .portrait
  ) -> CornerRadii? {
    resolveCornerRadii(model: model, idiom: idiom, nativeSize: nativeSize, orientation: orientation)
  }

  // MARK: - iPhone Duo

  func testDuoOuterPortrait() {
    let corners = resolve(duo, nativeSize: duoOuter)
    XCTAssertEqual(corners, CornerRadii(topLeft: 8, topRight: 59, bottomLeft: 8, bottomRight: 59))
    XCTAssertEqual(corners?.largest, 59)
  }

  func testDuoOuterLandscapeLeft() {
    let corners = resolve(duo, nativeSize: duoOuter, orientation: .landscapeLeft)
    XCTAssertEqual(corners, CornerRadii(topLeft: 8, topRight: 8, bottomLeft: 59, bottomRight: 59))
  }

  func testDuoOuterLandscapeRight() {
    let corners = resolve(duo, nativeSize: duoOuter, orientation: .landscapeRight)
    XCTAssertEqual(corners, CornerRadii(topLeft: 59, topRight: 59, bottomLeft: 8, bottomRight: 8))
  }

  func testDuoOuterUpsideDown() {
    let corners = resolve(duo, nativeSize: duoOuter, orientation: .portraitUpsideDown)
    XCTAssertEqual(corners, CornerRadii(topLeft: 59, topRight: 8, bottomLeft: 59, bottomRight: 8))
  }

  func testDuoOuterMatchesWhenSizeIsReportedTurned() {
    let turned = CGSize(width: duoOuter.height, height: duoOuter.width)
    XCTAssertEqual(resolve(duo, nativeSize: turned), resolve(duo, nativeSize: duoOuter))
  }

  func testDuoInnerIsUniformInEveryOrientation() {
    let orientations: [DisplayOrientation] = [
      .portrait, .portraitUpsideDown, .landscapeLeft, .landscapeRight,
    ]
    for orientation in orientations {
      XCTAssertEqual(
        resolve(duo, nativeSize: duoInner, orientation: orientation), CornerRadii(uniform: 55))
    }
    let turned = CGSize(width: duoInner.height, height: duoInner.width)
    XCTAssertEqual(resolve(duo, nativeSize: turned), CornerRadii(uniform: 55))
  }

  func testDuoFallsBackToUniformForUnknownScreen() {
    XCTAssertEqual(
      resolve(duo, nativeSize: CGSize(width: 100, height: 200)), CornerRadii(uniform: 59))
  }

  func testDuoFallsBackToUniformWithoutScreenSize() {
    XCTAssertEqual(resolve(duo), CornerRadii(uniform: 59))
  }

  // MARK: - Single-screen devices

  func testSingleScreenDeviceIsUniform() {
    XCTAssertEqual(resolve("iPhone18,1"), CornerRadii(uniform: 62))
  }

  func testSingleScreenDeviceIgnoresOrientation() {
    XCTAssertEqual(
      resolve("iPhone18,1", nativeSize: CGSize(width: 1206, height: 2622), orientation: .landscapeLeft),
      CornerRadii(uniform: 62))
  }

  func testIPhone18GenerationIsKnown() {
    for model in ["iPhone19,2", "iPhone19,3", "iPhone19,7"] {
      XCTAssertEqual(resolve(model)?.largest, 62, model)
    }
  }

  func testSquareCorneredDeviceReturnsZero() {
    XCTAssertEqual(resolve("iPhone14,6"), CornerRadii(uniform: 0))
  }

  func testIPadLookup() {
    XCTAssertEqual(resolve("iPad17,1", idiom: .pad), CornerRadii(uniform: 30))
  }

  func testLookupUsesTheTableForTheIdiom() {
    XCTAssertNil(resolve("iPad17,1", idiom: .phone))
    XCTAssertNil(resolve("iPhone18,1", idiom: .pad))
  }

  func testUnknownModelReturnsNil() {
    XCTAssertNil(resolve("iPhone99,1"))
  }

  func testOtherIdiomReturnsZero() {
    XCTAssertEqual(resolve("AppleTV14,1", idiom: .other), CornerRadii(uniform: 0))
  }

  // MARK: - Rotation

  func testRotationsCompose() {
    let corners = CornerRadii(topLeft: 1, topRight: 2, bottomLeft: 3, bottomRight: 4)
    XCTAssertEqual(
      corners.rotated(for: .portraitUpsideDown).rotated(for: .portraitUpsideDown), corners)
    XCTAssertEqual(
      corners.rotated(for: .landscapeLeft).rotated(for: .landscapeRight), corners)
    XCTAssertEqual(
      corners.rotated(for: .landscapeLeft).rotated(for: .landscapeLeft),
      corners.rotated(for: .portraitUpsideDown))
  }

  func testDictionaryKeys() {
    let corners = CornerRadii(topLeft: 1, topRight: 2, bottomLeft: 3, bottomRight: 4)
    XCTAssertEqual(
      corners.dictionary, ["topLeft": 1, "topRight": 2, "bottomLeft": 3, "bottomRight": 4])
  }
}
