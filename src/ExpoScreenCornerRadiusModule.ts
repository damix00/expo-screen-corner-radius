import { NativeModule, requireNativeModule } from "expo";

declare class ExpoScreenCornerRadiusModule extends NativeModule {
    getCornerRadius(): number;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoScreenCornerRadiusModule>(
    "ExpoScreenCornerRadius"
);
