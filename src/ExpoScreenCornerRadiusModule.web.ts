import { registerWebModule, NativeModule } from "expo";

class ExpoScreenCornerRadiusModule extends NativeModule {
    getCornerRadiusSync(): number {
        // Web does not have access to screen corner radius, return 0 as a fallback.
        return 0;
    }

    async getCornerRadius(): Promise<number> {
        // Web does not have access to screen corner radius, return 0 as a fallback.
        return 0;
    }
}

export default registerWebModule(
    ExpoScreenCornerRadiusModule,
    "ExpoScreenCornerRadiusModule"
);
