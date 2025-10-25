import { NativeModule, requireNativeModule } from "expo";

declare class ExpoScreenCornerRadiusModule extends NativeModule {
    getCornerRadiusSync(): number | null;
    getCornerRadius(): Promise<number | null>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoScreenCornerRadiusModule>(
    "ExpoScreenCornerRadius"
);
