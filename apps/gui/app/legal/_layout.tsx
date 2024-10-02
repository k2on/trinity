import { Slot, Stack } from "expo-router";
import { ScrollView, View } from "react-native";

export default function Layout() {
    return (
        <ScrollView className="max-w-3xl mx-auto">
            <Slot />
        </ScrollView>
    );
}
