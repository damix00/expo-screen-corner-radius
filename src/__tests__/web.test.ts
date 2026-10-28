import WebModule from "../ExpoScreenCornerRadiusModule.web";

jest.mock("expo", () => ({
    NativeModule: class {},
    registerWebModule: (ModuleClass: new () => unknown) => new ModuleClass(),
}));

describe("web module", () => {
    it("returns null synchronously", () => {
        expect(WebModule.getCornerRadiusSync()).toBeNull();
        expect(WebModule.getCornerRadiiSync()).toBeNull();
    });

    it("resolves to null asynchronously", async () => {
        await expect(WebModule.getCornerRadius()).resolves.toBeNull();
        await expect(WebModule.getCornerRadii()).resolves.toBeNull();
    });
});
