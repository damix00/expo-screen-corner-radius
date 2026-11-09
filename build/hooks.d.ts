import type { CornerRadii } from "./ExpoScreenCornerRadius.types";
/**
 * Returns the radius of each screen corner in dp, and updates when the device is folded,
 * unfolded or rotated.
 * @returns The corner radii in dp, or null if unknown
 */
export declare function useCornerRadii(): CornerRadii | null;
/**
 * Returns the screen corner radius in dp (the largest corner on devices whose corners differ),
 * and updates when the device is folded, unfolded or rotated.
 * @returns The screen corner radius in dp, or null if unknown
 */
export declare function useCornerRadius(): number | null;
//# sourceMappingURL=hooks.d.ts.map