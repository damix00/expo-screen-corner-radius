import { act, render, renderHook } from "@testing-library/react-native";
import { Dimensions, StyleSheet } from "react-native";

import {
    ScreenCornerView,
    getConcentricRadii,
    useCornerRadii,
    useCornerRadius,
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
const duoInner = { topLeft: 55, topRight: 55, bottomLeft: 55, bottomRight: 55 };

type ChangeListener = () => void;
let listeners: ChangeListener[] = [];

beforeEach(() => {
    jest.resetAllMocks();
    listeners = [];
    jest.spyOn(Dimensions, "addEventListener").mockImplementation(((
        _type: string,
        listener: ChangeListener
    ) => {
        listeners.push(listener);
        return {
            remove: () => {
                listeners = listeners.filter((l) => l !== listener);
            },
        };
    }) as typeof Dimensions.addEventListener);
});

afterEach(() => {
    jest.restoreAllMocks();
});

function emitDimensionsChange() {
    act(() => listeners.forEach((listener) => listener()));
}

describe("useCornerRadii", () => {
    it("returns the current corners", () => {
        mockModule.getCornerRadiiSync.mockReturnValue(duoOuter);
        const { result } = renderHook(() => useCornerRadii());
        expect(result.current).toEqual(duoOuter);
    });

    it("updates when the window changes, such as when folding", () => {
        mockModule.getCornerRadiiSync.mockReturnValue(duoOuter);
        const { result } = renderHook(() => useCornerRadii());

        mockModule.getCornerRadiiSync.mockReturnValue(duoInner);
        emitDimensionsChange();
        expect(result.current).toEqual(duoInner);
    });

    it("keeps the same object when the corners don't change", () => {
        mockModule.getCornerRadiiSync.mockImplementation(() => ({ ...duoOuter }));
        const { result } = renderHook(() => useCornerRadii());
        const first = result.current;

        emitDimensionsChange();
        expect(result.current).toBe(first);
    });

    it("unsubscribes on unmount", () => {
        mockModule.getCornerRadiiSync.mockReturnValue(duoOuter);
        const { unmount } = renderHook(() => useCornerRadii());
        expect(listeners).toHaveLength(1);
        unmount();
        expect(listeners).toHaveLength(0);
    });

    it("returns null when unknown", () => {
        mockModule.getCornerRadiiSync.mockReturnValue(null);
        const { result } = renderHook(() => useCornerRadii());
        expect(result.current).toBeNull();
    });
});

describe("useCornerRadius", () => {
    it("returns the largest corner", () => {
        mockModule.getCornerRadiiSync.mockReturnValue(duoOuter);
        const { result } = renderHook(() => useCornerRadius());
        expect(result.current).toBe(59);
    });

    it("returns null when unknown", () => {
        mockModule.getCornerRadiiSync.mockReturnValue(null);
        const { result } = renderHook(() => useCornerRadius());
        expect(result.current).toBeNull();
    });
});

describe("getConcentricRadii", () => {
    it("shrinks each corner by the inset, never below zero", () => {
        expect(getConcentricRadii(duoOuter, 10)).toEqual({
            topLeft: 0,
            topRight: 49,
            bottomLeft: 0,
            bottomRight: 49,
        });
    });

    it("uses the fallback when the corners are unknown", () => {
        expect(getConcentricRadii(null, 4, 20)).toEqual({
            topLeft: 16,
            topRight: 16,
            bottomLeft: 16,
            bottomRight: 16,
        });
    });
});

describe("ScreenCornerView", () => {
    it("applies the screen corners, shrunk by the inset", () => {
        mockModule.getCornerRadiiSync.mockReturnValue(duoOuter);
        const { getByTestId } = render(
            <ScreenCornerView testID="view" inset={4} style={{ flex: 1 }} />
        );
        const style = StyleSheet.flatten(getByTestId("view").props.style);
        expect(style).toMatchObject({
            flex: 1,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 55,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 55,
        });
    });

    it("lets the style override the corners", () => {
        mockModule.getCornerRadiiSync.mockReturnValue(duoInner);
        const { getByTestId } = render(
            <ScreenCornerView testID="view" style={{ borderTopLeftRadius: 0 }} />
        );
        const style = StyleSheet.flatten(getByTestId("view").props.style);
        expect(style.borderTopLeftRadius).toBe(0);
        expect(style.borderTopRightRadius).toBe(55);
    });
});
