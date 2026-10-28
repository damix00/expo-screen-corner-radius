import {
    CornerRadii,
    getCornerRadii,
    getCornerRadiiSync,
    getCornerRadius,
    getCornerRadiusSync,
} from "expo-screen-corner-radius";
import { useEffect, useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function App() {
    const [h, setH] = useState(128);

    const [asyncRadius, setAsyncRadius] = useState<number | null | undefined>(
        undefined
    );

    const [r, setR] = useState(getCornerRadiusSync);
    const [corners, setCorners] = useState<CornerRadii | null>(
        getCornerRadiiSync
    );
    const [asyncCorners, setAsyncCorners] = useState<
        CornerRadii | null | undefined
    >(undefined);

    // The values change when a foldable is folded or the device is rotated.
    useEffect(() => {
        const refresh = () => {
            setR(getCornerRadiusSync());
            setCorners(getCornerRadiiSync());
            getCornerRadius().then(setAsyncRadius);
            getCornerRadii().then(setAsyncCorners);
        };
        refresh();
        const subscription = Dimensions.addEventListener("change", refresh);
        return () => subscription.remove();
    }, []);

    return (
        <>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                    setH(h === 128 ? Dimensions.get("window").height : 128)
                }
                style={[
                    styles.view,
                    {
                        backgroundColor: "red",
                        position: "absolute",
                        width: Dimensions.get("window").width,
                        height: h,
                        zIndex: 10,
                        bottom: 0,
                        borderTopLeftRadius: corners?.topLeft ?? 0,
                        borderTopRightRadius: corners?.topRight ?? 0,
                        borderBottomLeftRadius: corners?.bottomLeft ?? 0,
                        borderBottomRightRadius: corners?.bottomRight ?? 0,
                    },
                ]}
            />
            <SafeAreaView
                style={[
                    styles.container,
                    {
                        borderRadius: 20,
                    },
                ]}>
                <ScrollView style={styles.container}>
                    <Text style={styles.header}>Corner radius module</Text>
                    <Text style={{ marginHorizontal: 20, marginBottom: 20 }}>
                        The red area at the bottom changes height on tap. It
                        shows the corner radius applied to the screen.
                    </Text>
                    <Group name="Default corner radius">
                        <Text>{r}</Text>
                    </Group>
                    <Group name="Async corner radius">
                        <Text>
                            {asyncRadius !== undefined
                                ? asyncRadius
                                : "Loading..."}
                        </Text>
                    </Group>
                    <Group name="Per-corner radii">
                        <Text>{JSON.stringify(corners, null, 2)}</Text>
                    </Group>
                    <Group name="Async per-corner radii">
                        <Text>
                            {asyncCorners !== undefined
                                ? JSON.stringify(asyncCorners, null, 2)
                                : "Loading..."}
                        </Text>
                    </Group>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

function Group(props: { name: string; children: React.ReactNode }) {
    return (
        <View style={styles.group}>
            <Text style={styles.groupHeader}>{props.name}</Text>
            {props.children}
        </View>
    );
}

const styles = {
    header: {
        fontSize: 30,
        margin: 20,
    },
    groupHeader: {
        fontSize: 20,
        marginBottom: 20,
    },
    group: {
        margin: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
    },
    container: {
        flex: 1,
        backgroundColor: "#eee",
    },
    view: {
        flex: 1,
        height: 200,
    },
};
