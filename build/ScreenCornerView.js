import { jsx as _jsx } from "react/jsx-runtime";
import { View } from "react-native";
import { useCornerRadii } from "./hooks";
/**
 * Turns the screen's corner radii into the four border radius styles, shrunk by `inset` so a
 * view inset from the edge stays concentric with the screen.
 */
export function getConcentricRadii(radii, inset = 0, fallbackRadius = 0) {
    const shrink = (radius) => Math.max(0, radius - inset);
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
export function ScreenCornerView({ inset = 0, fallbackRadius = 0, style, ...props }) {
    const corners = getConcentricRadii(useCornerRadii(), inset, fallbackRadius);
    return (_jsx(View, { ...props, style: [
            {
                borderTopLeftRadius: corners.topLeft,
                borderTopRightRadius: corners.topRight,
                borderBottomLeftRadius: corners.bottomLeft,
                borderBottomRightRadius: corners.bottomRight,
                borderCurve: "continuous",
            },
            style,
        ] }));
}
//# sourceMappingURL=ScreenCornerView.js.map