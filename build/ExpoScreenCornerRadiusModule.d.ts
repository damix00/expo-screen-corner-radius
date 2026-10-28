import { NativeModule } from "expo";
import type { CornerRadii } from "./ExpoScreenCornerRadius.types";
declare class ExpoScreenCornerRadiusModule extends NativeModule {
    getCornerRadiusSync(): number | null;
    getCornerRadius(): Promise<number | null>;
    getCornerRadiiSync(): CornerRadii | null;
    getCornerRadii(): Promise<CornerRadii | null>;
}
declare const _default: ExpoScreenCornerRadiusModule;
export default _default;
//# sourceMappingURL=ExpoScreenCornerRadiusModule.d.ts.map