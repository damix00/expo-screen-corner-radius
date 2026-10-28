# expo-screen-corner-radius

Get the precise, native corner radius of the device screen on iOS and Android devices with rounded displays.

## Installation

```bash
# Install the library
npm install expo-screen-corner-radius
```

## Usage

```jsx
import { getCornerRadiusSync } from "expo-screen-corner-radius";

export default function App() {
    const radius = getCornerRadiusSync(); // Get corner radius in dp

    return <Text>Device Corner Radius: {radius}</Text>;
}

// or using the async function

import { getCornerRadius } from "expo-screen-corner-radius";

export default function App() {
    const [radius, setRadius] = useState(0);

    useEffect(() => {
        getCornerRadius().then(setRadius);
    }, []);

    return <Text>Device Corner Radius: {radius}</Text>;
}

```

### Per-corner radii

Most screens have four identical corners, but some don't. The outer screen of the foldable iPhone Duo is tighter on the hinge side. `getCornerRadiiSync()` and `getCornerRadii()` return each corner separately:

```jsx
import { getCornerRadiiSync } from "expo-screen-corner-radius";

const corners = getCornerRadiiSync();
// { topLeft: 8, topRight: 59, bottomLeft: 8, bottomRight: 59 }

<View
    style={{
        borderTopLeftRadius: corners?.topLeft ?? 0,
        borderTopRightRadius: corners?.topRight ?? 0,
        borderBottomLeftRadius: corners?.bottomLeft ?? 0,
        borderBottomRightRadius: corners?.bottomRight ?? 0,
    }}
/>
```

Note: **Not available** in Expo Go. Use a custom development client or build a standalone app to test.

## App Store Compliance

This library does not use any private APIs and is compliant with App Store guidelines for both iOS and Android platforms.

## API Reference

### `getCornerRadiusSync(): number | null`

A synchronous function that returns the device's screen corner radius. On devices whose corners differ, such as the [iPhone Duo](#foldable-iphone-iphone-duo), it returns the **largest** corner of the screen the app is on.

| Platform               | Return Value       | Notes                                                                                                                                                                                                                     |
| :--------------------- | :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **iOS** (iPhone, iPad) | **Points (dp/pt)** | The value is determined natively in Swift using the hardware model identifier (`uname()`) and a lookup table. Returns `0` if the device has no rounded corners (e.g., iPhone SE). Returns `null` if the model is unknown. |
| **Android**            | **Points (dp/pt)** | Returns the largest of the four corners reported by `WindowInsets.getRoundedCorner()`, in dp. Only available in Android 12 and later. Returns `null` otherwise.                                                          |
| **Web / Other**        | **`null`**         | Always returns `null`.                                                                                                                                                                                                    |

### `getCornerRadius(): Promise<number | null>`

An asynchronous function that returns a promise resolving to the device's screen corner radius. Same behavior as `getCornerRadiusSync()`.

### `getCornerRadiiSync(): CornerRadii | null`

A synchronous function that returns the radius of each screen corner in dp, or `null` where `getCornerRadiusSync()` would return `null`.

```ts
type CornerRadii = {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
};
```

Corners are named for where they appear in your interface, so `topLeft` is always the top left of what you see, whichever way the device is turned. Every device except the iPhone Duo returns the same value on all four corners on iOS. On Android, the values come straight from the system for each corner.

### `getCornerRadii(): Promise<CornerRadii | null>`

An asynchronous function that returns a promise resolving to the radius of each screen corner. Same behavior as `getCornerRadiiSync()`.

## Foldable iPhone (iPhone Duo)

Apple's foldable iPhone (`iPhone19,4`, listed in Xcode as "iPhone Duo") has two screens with different corners:

| Screen                  | Top left | Top right | Bottom left | Bottom right |
| :---------------------- | -------: | --------: | ----------: | -----------: |
| Outer, portrait         |        8 |        59 |           8 |           59 |
| Outer, landscape (left) |        8 |         8 |          59 |           59 |
| Inner, any orientation  |       55 |        55 |          55 |           55 |

On iOS, the module checks which screen the app is on by its native resolution and turns that screen's corners to match the interface orientation. `getCornerRadiusSync()` returns `59` on the outer screen and `55` on the inner screen.

The values change when the device is folded, unfolded or rotated, so read them again whenever the window changes:

```jsx
import { getCornerRadiiSync } from "expo-screen-corner-radius";
import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

function useCornerRadii() {
    const [corners, setCorners] = useState(getCornerRadiiSync);

    useEffect(() => {
        const subscription = Dimensions.addEventListener("change", () =>
            setCorners(getCornerRadiiSync())
        );
        return () => subscription.remove();
    }, []);

    return corners;
}
```

These are the corners of the display itself. A window that doesn't reach the edge of the screen has rounder corners of its own, which this module doesn't report.

## Contributing

Contributions are welcome! If you find any inaccuracies in the corner radius values, or anything else, please open a pull request.

### Running the tests

```bash
npm test          # TypeScript wrapper (Jest)
swift test        # iOS lookup, screen matching and rotation (macOS, no simulator needed)

# Android helpers (JUnit), via the example app
cd example && npm install && npx expo prebuild --platform android --no-install
cd android && ./gradlew :expo-screen-corner-radius:testDebugUnitTest
```

The iOS lookup logic lives in `ios/CornerRadiusResolver.swift`, and the data lives in `ios/CornerRadiusData.swift`. Neither file depends on UIKit, which is why `swift test` can run them on macOS. To add a device, add its model identifier to `iphoneRadii` or `ipadRadii`. If its screens' corners differ, also add an entry to `multiScreenRadii`.

CI runs all three suites, plus lint and build, on every push and pull request.

### Releasing

Releases are published to npm by GitHub Actions (`.github/workflows/release.yml`), using [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers). The workflow needs no npm token, and each version gets a provenance attestation.

1. Bump the version and update `CHANGELOG.md`: `npm version minor` (or `patch` / `major`).
2. Push the commit and tag: `git push --follow-tags`.
3. Create a GitHub Release from the tag. Publishing the release runs the tests and publishes to npm. The workflow fails if the tag doesn't match the version in `package.json`.

To check a release without publishing, run the **Release** workflow manually from the Actions tab with **dry-run** ticked.

One-time setup: on npmjs.com, open the package's **Settings**, go to **Trusted Publisher**, choose GitHub Actions, and enter repository `damix00/expo-screen-corner-radius` and workflow `release.yml`.

## Data Source

The corner radius values for iOS are sourced from the community-maintained data in the open-source [BezelKit](https://github.com/markbattistella/BezelKit/tree/main) repository. That includes the per-screen corners of the iPhone Duo, and the logic for matching screens and rotating corners is ported from it.
