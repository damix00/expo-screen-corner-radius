import { View, type ViewProps } from "react-native";

import type { CornerRadii } from "./ExpoScreenCornerRadius.types";
import { useCornerRadii } from "./hooks";

export type ScreenCornerViewProps = ViewProps & {
    /**
     * Distance in dp between this view and the screen edge. Each corner shrinks by this amount,
     * so a view inset from the edge stays concentric with the screen's corners.
     * @default 0
     */
    inset?: number;
    /**
     * Radius in dp to use when the screen's corners are unknown, such as on web or older
     * Android versions.
     * @default 0
     */
    fallbackRadius?: number;
};

/**
 * Turns the screen's corner radii into the four border radius styles, shrunk by `inset` so a
 * view inset from the edge stays concentric with the screen.
 */
export function getConcentricRadii(
    radii: CornerRadii | null,
    inset = 0,
    fallbackRadius = 0
): CornerRadii {
    const shrink = (radius: number) => Math.max(0, radius - inset);
    if (!radii) {
        return {
            topLeft: shrink(fallbackRadius),
            topRight: shrink(fallbackRadius),
            bottomLeft: shrink(fallbackRadius),
            bottomRight: shrink(fallbackRadius),
        };
    }
    return {
        topLeft: shrink(radii.topLeft),
        topRight: shrink(radii.topRight),
        bottomLeft: shrink(radii.bottomLeft),
        bottomRight: shrink(radii.bottomRight),
    };
}

/**
 * A `View` whose corners follow the screen's corners. Pass `inset` when the view doesn't touch
 * the screen edge so its corners stay concentric with the screen.
 */
export function ScreenCornerView({
    inset = 0,
    fallbackRadius = 0,
    style,
    ...props
}: ScreenCornerViewProps) {
    const corners = getConcentricRadii(useCornerRadii(), inset, fallbackRadius);

    return (
        <View
            {...props}
            style={[
                {
                    borderTopLeftRadius: corners.topLeft,
                    borderTopRightRadius: corners.topRight,
                    borderBottomLeftRadius: corners.bottomLeft,
                    borderBottomRightRadius: corners.bottomRight,
                    borderCurve: "continuous",
                },
                style,
            ]}
        />
    );
}
