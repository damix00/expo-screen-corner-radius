import { useEvent } from "expo";
import ExpoScreenCornerRadius from "expo-screen-corner-radius";
import { useState } from "react";
import {
    Button,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function App() {
    const [h, setH] = useState(128);
    const r = ExpoScreenCornerRadius.getCornerRadius();

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
                        borderRadius: r,
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
                    <Text style={styles.header}>
                        If you can see the red, something is wrong
                    </Text>
                    <Group name="Default corner radius">
                        <Text>{r}</Text>
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
