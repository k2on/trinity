import { Link, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function Page() {
    return (
        <View>
            <Text className="text-4xl text-white">Legal for Trinity</Text>
            <Link className="text-white text-2xl" href="/legal/tos">
                Terms of Service
            </Link>
            <Link className="text-white text-2xl" href="/legal/privacy">
                Privacy Policy
            </Link>
        </View>
    );
}
