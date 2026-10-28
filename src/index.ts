// Reexport the native module. On web, it will be resolved to ExpoScreenCornerRadiusModule.web.ts
// and on native platforms to ExpoScreenCornerRadiusModule.ts

import type { CornerRadii } from "./ExpoScreenCornerRadius.types";
import ExpoScreenCornerRadiusModule from "./ExpoScreenCornerRadiusModule";

export type { CornerRadii };

/**
 * Synchronously gets the device's screen corner radius in dp.
 *
 * On devices whose corners differ, such as the foldable iPhone Duo, this is the largest corner
 * of the screen the app is on, so it can change when the device is folded. Read it again when
 * `Dimensions` emits a `change` event.
 * @returns The screen corner radius in dp, or null if unknown
 */
export function getCornerRadiusSync(): number | null {
    return ExpoScreenCornerRadiusModule.getCornerRadiusSync();
}

/**
 * Asynchronously gets the device's screen corner radius in dp.
 *
 * Same behavior as {@link getCornerRadiusSync}.
 * @returns A promise resolving to the screen corner radius in dp, or null if unknown
 */
export async function getCornerRadius(): Promise<number | null> {
    return ExpoScreenCornerRadiusModule.getCornerRadius();
}

/**
 * Synchronously gets the radius of each screen corner in dp.
 *
 * Most devices return the same value for all four corners. On the foldable iPhone Duo the outer
 * screen is tighter on the hinge side, and the corners are turned to match the interface
 * orientation. The values change when the device is folded or rotated, so read them again when
 * `Dimensions` emits a `change` event.
 * @returns The corner radii in dp, or null if unknown
 */
export function getCornerRadiiSync(): CornerRadii | null {
    return ExpoScreenCornerRadiusModule.getCornerRadiiSync();
}

/**
 * Asynchronously gets the radius of each screen corner in dp.
 *
 * Same behavior as {@link getCornerRadiiSync}.
 * @returns A promise resolving to the corner radii in dp, or null if unknown
 */
export async function getCornerRadii(): Promise<CornerRadii | null> {
    return ExpoScreenCornerRadiusModule.getCornerRadii();
}
