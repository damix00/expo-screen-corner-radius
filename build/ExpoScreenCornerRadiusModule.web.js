import { registerWebModule, NativeModule } from "expo";
// Web does not have access to the screen corner radius, so every function returns null.
class ExpoScreenCornerRadiusModule extends NativeModule {
    getCornerRadiusSync() {
        return null;
    }
    async getCornerRadius() {
        return null;
    }
    getCornerRadiiSync() {
        return null;
    }
    async getCornerRadii() {
        return null;
    }
}
export default registerWebModule(ExpoScreenCornerRadiusModule, "ExpoScreenCornerRadiusModule");
//# sourceMappingURL=ExpoScreenCornerRadiusModule.web.js.map