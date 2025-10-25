import { registerWebModule, NativeModule } from "expo";

class ExpoScreenCornerRadiusModule extends NativeModule {
    getCornerRadiusSync(): number | null {
        // Web does not have access to screen corner radius, return null as a fallback.
        return null;
    }

    async getCornerRadius(): Promise<number | null> {
        // Web does not have access to screen corner radius, return null as a fallback.
        return null;
    }
}

export default registerWebModule(
    ExpoScreenCornerRadiusModule,
    "ExpoScreenCornerRadiusModule"
);
