import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

import type { CornerRadii } from "./ExpoScreenCornerRadius.types";
import ExpoScreenCornerRadiusModule from "./ExpoScreenCornerRadiusModule";

function sameRadii(a: CornerRadii | null, b: CornerRadii | null): boolean {
    if (a === b) return true;
    if (!a || !b) return false;
    return (
        a.topLeft === b.topLeft &&
        a.topRight === b.topRight &&
        a.bottomLeft === b.bottomLeft &&
        a.bottomRight === b.bottomRight
    );
}

/**
 * Returns the radius of each screen corner in dp, and updates when the device is folded,
 * unfolded or rotated.
 * @returns The corner radii in dp, or null if unknown
 */
export function useCornerRadii(): CornerRadii | null {
    const [radii, setRadii] = useState<CornerRadii | null>(() =>
        ExpoScreenCornerRadiusModule.getCornerRadiiSync()
    );

    useEffect(() => {
        const refresh = () => {
            const next = ExpoScreenCornerRadiusModule.getCornerRadiiSync();
            setRadii((previous) => (sameRadii(previous, next) ? previous : next));
        };
        // Catch a change between the first render and subscribing.
        refresh();
        const subscription = Dimensions.addEventListener("change", refresh);
        return () => subscription.remove();
    }, []);

    return radii;
}

/**
 * Returns the screen corner radius in dp (the largest corner on devices whose corners differ),
 * and updates when the device is folded, unfolded or rotated.
 * @returns The screen corner radius in dp, or null if unknown
 */
export function useCornerRadius(): number | null {
    const radii = useCornerRadii();
    if (!radii) return null;
    return Math.max(radii.topLeft, radii.topRight, radii.bottomLeft, radii.bottomRight);
}
