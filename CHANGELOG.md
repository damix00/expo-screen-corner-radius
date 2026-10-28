# Changelog

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
