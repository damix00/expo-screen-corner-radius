import { type ViewProps } from "react-native";
import type { CornerRadii } from "./ExpoScreenCornerRadius.types";
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
export declare function getConcentricRadii(radii: CornerRadii | null, inset?: number, fallbackRadius?: number): CornerRadii;
/**
 * A `View` whose corners follow the screen's corners. Pass `inset` when the view doesn't touch
 * the screen edge so its corners stay concentric with the screen.
 */
export declare function ScreenCornerView({ inset, fallbackRadius, style, ...props }: ScreenCornerViewProps): import("react").JSX.Element;
//# sourceMappingURL=ScreenCornerView.d.ts.map