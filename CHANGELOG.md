# Changelog

## 1.3.0

### Added

- `useCornerRadii()` and `useCornerRadius()` hooks, which update when the device is folded, unfolded or rotated.
- `<ScreenCornerView>`, a `View` whose corners follow the screen's. Its `inset` prop keeps an inset view concentric with the screen, and `fallbackRadius` covers devices that don't report a radius. `getConcentricRadii()` does the same calculation for your own styles.
- On iOS, models released after this version (a newer generation than any known model) get an estimate from the newest known generation instead of `null`.
- Data for the cellular iPad Air (M3), iPad (A16) and iPad Air 13-inch (M4) (`iPad15,4`, `iPad15,6`, `iPad15,8`, `iPad16,10`, `iPad16,11`), the first iPad Pro 12.9-inch (`iPad6,7`, `iPad6,8`) and iPod touch.
- `npm run sync-data`, which regenerates `ios/CornerRadiusData.swift` from BezelKit, and a weekly check that it's up to date.

### Changed

- On Android, radii are no longer truncated to whole dp. They're rounded to two decimal places, matching iOS (for example `39.33` instead of `39`).
- `expo` peer dependency is now `>=56.0.0`.

### Fixed

- The iPad Air 11-inch (M4) (`iPad16,8`) returned `0` instead of `18`.

### Removed

- The unused template `ExpoScreenCornerRadiusView`, which compiled a `WKWebView` into every app.

## 1.2.0

### Added

- Support for the iPhone 18 Pro and iPhone 18 Pro Max (`iPhone19,2`, `iPhone19,3`, `iPhone19,7`).
- Support for the foldable iPhone Duo (`iPhone19,4`). The module picks the screen the app is on (outer or inner) and turns its corners to match the interface orientation.
- `getCornerRadiiSync()` and `getCornerRadii()`, which return each corner separately as `{ topLeft, topRight, bottomLeft, bottomRight }`, along with the `CornerRadii` type.
- Unit tests for the iOS lookup (Swift), the Android helpers (JUnit) and the TypeScript wrapper (Jest).
- CI for every push and pull request, and npm publishing through Trusted Publishing when a GitHub Release is published.

### Changed

- On devices whose corners differ, `getCornerRadius()` and `getCornerRadiusSync()` now return the largest corner. On Android, these functions used to return only the top-left corner.
- On iOS, these functions now read the screen of the active window scene instead of assuming a single screen.
