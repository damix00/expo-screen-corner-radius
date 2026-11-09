import * as Device from "expo-device";
import {
    CornerRadii,
    ScreenCornerView,
    useCornerRadii,
    useCornerRadius,
} from "expo-screen-corner-radius";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const colors = {
    background: "#07070B",
    panel: "#111118",
    panelBorder: "#262636",
    accent: "#A78BFA",
    accentSoft: "#C4B5FD",
    text: "#F5F5FA",
    muted: "#8E8EA6",
};

// Gap between the outer trace and the inner panel, to show concentric corners.
const PANEL_INSET = 14;

export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <Screen />
        </SafeAreaProvider>
    );
}

function Screen() {
    const corners = useCornerRadii();
    const radius = useCornerRadius();
    const insets = useSafeAreaInsets();
    const unit = Platform.OS === "android" ? "dp" : "pt";
    const uniform =
        !!corners &&
        corners.topLeft === corners.topRight &&
        corners.topLeft === corners.bottomLeft &&
        corners.topLeft === corners.bottomRight;

    return (
        <View style={styles.root}>
            {/* Traces the physical screen edge. */}
            <ScreenCornerView pointerEvents="none" style={styles.trace} />

            {/* Inset panel whose corners stay concentric with the screen. */}
            <ScreenCornerView inset={PANEL_INSET} style={styles.panel}>
                <View
                    style={[
                        styles.content,
                        {
                            paddingTop: insets.top + 8,
                            paddingBottom: insets.bottom + 8,
                        },
                    ]}>
                    <View style={styles.header}>
                        <Text style={styles.eyebrow}>
                            expo-screen-corner-radius
                        </Text>
                        <Text style={styles.device}>Screen corners</Text>
                        <Text style={styles.model}>
                            {Device.osName} {Device.osVersion}
                        </Text>
                    </View>

                    <View style={styles.hero}>
                        <Text style={styles.heroValue}>
                            {radius === null ? "—" : formatRadius(radius)}
                        </Text>
                        <Text style={styles.heroUnit}>
                            {radius === null
                                ? "corner radius unknown"
                                : `${unit} screen corner radius`}
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <CornerGrid corners={corners} />
                        <Text style={styles.caption}>
                            {uniform
                                ? "All four corners match"
                                : corners
                                  ? "Corners differ"
                                  : "Not reported on this device"}
                            {"  ·  "}
                            <Text style={styles.code}>useCornerRadii()</Text>
                        </Text>
                    </View>
                </View>
            </ScreenCornerView>
        </View>
    );
}

function CornerGrid({ corners }: { corners: CornerRadii | null }) {
    const items: { key: keyof CornerRadii; label: string }[] = [
        { key: "topLeft", label: "Top left" },
        { key: "topRight", label: "Top right" },
        { key: "bottomLeft", label: "Bottom left" },
        { key: "bottomRight", label: "Bottom right" },
    ];

    return (
        <View style={styles.grid}>
            {items.map(({ key, label }) => (
                <View key={key} style={styles.tile}>
                    <CornerGlyph corner={key} radius={corners?.[key] ?? 0} />
                    <View>
                        <Text style={styles.tileValue}>
                            {corners ? formatRadius(corners[key]) : "—"}
                        </Text>
                        <Text style={styles.tileLabel}>{label}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

// Draws one corner at half scale, so the shape of each corner is visible at a glance.
function CornerGlyph({
    corner,
    radius,
}: {
    corner: keyof CornerRadii;
    radius: number;
}) {
    const size = 34;
    const r = Math.min(size, radius / 2);
    const top = corner.startsWith("top");
    const left = corner.endsWith("Left");

    return (
        <View style={[styles.glyph, { width: size, height: size }]}>
            <View
                style={{
                    position: "absolute",
                    width: size * 2,
                    height: size * 2,
                    [top ? "top" : "bottom"]: 0,
                    [left ? "left" : "right"]: 0,
                    borderWidth: 2.5,
                    borderColor: colors.accent,
                    borderRadius: r,
                    borderCurve: "continuous",
                }}
            />
        </View>
    );
}

function formatRadius(value: number) {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.background,
    },
    trace: {
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        borderWidth: 3,
        borderColor: colors.accent,
    },
    panel: {
        position: "absolute",
        top: PANEL_INSET,
        left: PANEL_INSET,
        right: PANEL_INSET,
        bottom: PANEL_INSET,
        backgroundColor: colors.panel,
        borderWidth: 1,
        borderColor: colors.panelBorder,
        overflow: "hidden",
    },
    content: {
        flex: 1,
        paddingHorizontal: 22,
        justifyContent: "space-between",
    },
    header: {
        alignItems: "center",
        gap: 4,
    },
    eyebrow: {
        color: colors.accentSoft,
        fontSize: 12,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        fontWeight: "600",
    },
    device: {
        color: colors.text,
        fontSize: 22,
        fontWeight: "600",
        marginTop: 6,
    },
    model: {
        color: colors.muted,
        fontSize: 13,
        fontVariant: ["tabular-nums"],
    },
    hero: {
        alignItems: "center",
    },
    heroValue: {
        color: colors.text,
        fontSize: 120,
        fontWeight: "200",
        letterSpacing: -4,
        fontVariant: ["tabular-nums"],
    },
    heroUnit: {
        color: colors.muted,
        fontSize: 15,
        marginTop: -6,
    },
    footer: {
        gap: 14,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        maxWidth: 520,
        width: "100%",
        alignSelf: "center",
    },
    tile: {
        flexBasis: "47%",
        flexGrow: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 14,
        borderRadius: 16,
        borderCurve: "continuous",
        backgroundColor: "#181822",
    },
    glyph: {
        overflow: "hidden",
    },
    tileValue: {
        color: colors.text,
        fontSize: 22,
        fontWeight: "600",
        fontVariant: ["tabular-nums"],
    },
    tileLabel: {
        color: colors.muted,
        fontSize: 12,
    },
    caption: {
        color: colors.muted,
        fontSize: 12,
        textAlign: "center",
    },
    code: {
        color: colors.accentSoft,
        fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    },
});
