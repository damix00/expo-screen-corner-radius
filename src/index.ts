// Reexport the native module. On web, it will be resolved to ExpoScreenCornerRadiusModule.web.ts
// and on native platforms to ExpoScreenCornerRadiusModule.ts

import ExpoScreenCornerRadiusModule from "./ExpoScreenCornerRadiusModule";

/**
 * Synchronously gets the device's screen corner radius in dp
 * @returns The screen corner radius in dp
 */
export function getCornerRadiusSync(): number | null {
    return ExpoScreenCornerRadiusModule.getCornerRadiusSync();
}

/**
 * Asynchronously gets the device's screen corner radius in dp
 * @returns A promise resolving to the screen corner radius in dp
 */
export async function getCornerRadius(): Promise<number | null> {
    return ExpoScreenCornerRadiusModule.getCornerRadius();
}
