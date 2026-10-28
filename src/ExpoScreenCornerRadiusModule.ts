import { NativeModule, requireNativeModule } from "expo";

import type { CornerRadii } from "./ExpoScreenCornerRadius.types";

declare class ExpoScreenCornerRadiusModule extends NativeModule {
    getCornerRadiusSync(): number | null;
    getCornerRadius(): Promise<number | null>;
    getCornerRadiiSync(): CornerRadii | null;
    getCornerRadii(): Promise<CornerRadii | null>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoScreenCornerRadiusModule>(
    "ExpoScreenCornerRadius"
);
