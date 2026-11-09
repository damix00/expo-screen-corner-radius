import type { CornerRadii } from "./ExpoScreenCornerRadius.types";
import { useCornerRadii, useCornerRadius } from "./hooks";
export type { CornerRadii };
export { useCornerRadii, useCornerRadius };
export { ScreenCornerView, getConcentricRadii, type ScreenCornerViewProps, } from "./ScreenCornerView";
/**
 * Synchronously gets the device's screen corner radius in dp.
 *
 * On devices whose corners differ, such as the foldable iPhone Duo, this is the largest corner
 * of the screen the app is on, so it can change when the device is folded. In a component, use
 * {@link useCornerRadius}, which updates automatically.
 * @returns The screen corner radius in dp, or null if unknown
 */
export declare function getCornerRadiusSync(): number | null;
/**
 * Asynchronously gets the device's screen corner radius in dp.
 *
 * Same behavior as {@link getCornerRadiusSync}.
 * @returns A promise resolving to the screen corner radius in dp, or null if unknown
 */
export declare function getCornerRadius(): Promise<number | null>;
/**
 * Synchronously gets the radius of each screen corner in dp.
 *
 * Most devices return the same value for all four corners. On the foldable iPhone Duo the outer
 * screen is tighter on the hinge side, and the corners are turned to match the interface
 * orientation. The values change when the device is folded or rotated. In a component, use
 * {@link useCornerRadii}, which updates automatically.
 * @returns The corner radii in dp, or null if unknown
 */
export declare function getCornerRadiiSync(): CornerRadii | null;
/**
 * Asynchronously gets the radius of each screen corner in dp.
 *
 * Same behavior as {@link getCornerRadiiSync}.
 * @returns A promise resolving to the corner radii in dp, or null if unknown
 */
export declare function getCornerRadii(): Promise<CornerRadii | null>;
//# sourceMappingURL=index.d.ts.map