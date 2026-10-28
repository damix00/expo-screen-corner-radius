import { registerWebModule, NativeModule } from "expo";

import type { CornerRadii } from "./ExpoScreenCornerRadius.types";

// Web does not have access to the screen corner radius, so every function returns null.
class ExpoScreenCornerRadiusModule extends NativeModule {
    getCornerRadiusSync(): number | null {
        return null;
    }

    async getCornerRadius(): Promise<number | null> {
        return null;
    }

    getCornerRadiiSync(): CornerRadii | null {
        return null;
    }

    async getCornerRadii(): Promise<CornerRadii | null> {
        return null;
    }
}

export default registerWebModule(
    ExpoScreenCornerRadiusModule,
    "ExpoScreenCornerRadiusModule"
);
