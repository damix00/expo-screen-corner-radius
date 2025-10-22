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

Note: **Not available** in Expo Go. Use a custom development client or build a standalone app to test.

## App Store Compliance

This library does not use any private APIs and is compliant with App Store guidelines for both iOS and Android platforms.

## API Reference

### `getCornerRadiusSync(): number`

A synchronous function that returns the device's screen corner radius.

| Platform               | Return Value       | Notes                                                                                                                                                                                                     |
| :--------------------- | :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **iOS** (iPhone, iPad) | **Points (dp/pt)** | The value is determined natively in Swift using the hardware model identifier (`uname()`) and a lookup table. Returns `0` if the device has no rounded corners (e.g., iPhone SE) or the model is unknown. |
| **Android**            | **Points (dp/pt)** | Returns the device's corner radius in dp/pt, if available. Only available in Android 12 and later. Returns 0 otherwise.                                                                                   |
| **Web / Other**        | **0**              | Always returns `0`.                                                                                                                                                                                       |

### `getCornerRadius(): Promise<number>`

An asynchronous function that returns a promise resolving to the device's screen corner radius. Same behavior as `getCornerRadiusSync()`

## Contributing

Contributions are welcome! If you find any inaccuracies in the corner radius values, or anything else, please open a pull request.

## Data Source

The corner radius values for iOS are sourced from the community-maintained data in the open-source [BezelKit](https://github.com/markbattistella/BezelKit/tree/main) repository.
