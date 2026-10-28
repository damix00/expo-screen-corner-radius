import {
    getCornerRadii,
    getCornerRadiiSync,
    getCornerRadius,
    getCornerRadiusSync,
} from "..";

jest.mock("../ExpoScreenCornerRadiusModule", () => ({
    __esModule: true,
    default: {
        getCornerRadiusSync: jest.fn(),
        getCornerRadius: jest.fn(),
        getCornerRadiiSync: jest.fn(),
        getCornerRadii: jest.fn(),
    },
}));

const mockModule = jest.requireMock("../ExpoScreenCornerRadiusModule").default;

const duoOuter = { topLeft: 8, topRight: 59, bottomLeft: 8, bottomRight: 59 };

beforeEach(() => {
    jest.resetAllMocks();
});

describe("getCornerRadiusSync", () => {
    it("returns the native value", () => {
        mockModule.getCornerRadiusSync.mockReturnValue(62);
        expect(getCornerRadiusSync()).toBe(62);
    });

    it("passes null through for unknown devices", () => {
        mockModule.getCornerRadiusSync.mockReturnValue(null);
        expect(getCornerRadiusSync()).toBeNull();
    });
});

describe("getCornerRadius", () => {
    it("resolves to the native value", async () => {
        mockModule.getCornerRadius.mockResolvedValue(59);
        await expect(getCornerRadius()).resolves.toBe(59);
    });

    it("resolves to null for unknown devices", async () => {
        mockModule.getCornerRadius.mockResolvedValue(null);
        await expect(getCornerRadius()).resolves.toBeNull();
    });
});

describe("getCornerRadiiSync", () => {
    it("returns each corner from the native module", () => {
        mockModule.getCornerRadiiSync.mockReturnValue(duoOuter);
        expect(getCornerRadiiSync()).toEqual(duoOuter);
    });

    it("passes null through for unknown devices", () => {
        mockModule.getCornerRadiiSync.mockReturnValue(null);
        expect(getCornerRadiiSync()).toBeNull();
    });
});

describe("getCornerRadii", () => {
    it("resolves to each corner from the native module", async () => {
        mockModule.getCornerRadii.mockResolvedValue(duoOuter);
        await expect(getCornerRadii()).resolves.toEqual(duoOuter);
    });

    it("resolves to null for unknown devices", async () => {
        mockModule.getCornerRadii.mockResolvedValue(null);
        await expect(getCornerRadii()).resolves.toBeNull();
    });
});
