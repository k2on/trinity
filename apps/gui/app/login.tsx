import {
    KeyboardAvoidingView,
    SafeAreaView,
    View,
    Text,
    TextInput,
    Platform,
    TouchableOpacity,
    Linking,
} from "react-native";
import { useGlobalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";

import { auth } from "@/utils/auth";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { MotiView } from "moti";
import { haptics } from "@/utils/haptics";
import { getBaseUrl } from "@/utils/api";

WebBrowser.maybeCompleteAuthSession();

export const useRedirect = () => {
    const { r } = useGlobalSearchParams<{ r?: string }>();
    return () => {
        try {
            router.dismissAll();
        } catch (e) {}
        router.replace((r as any) || "/(app)");
    };
};

const parsePhone = (phone: string): string => {
    return phone.startsWith("+1") ? phone : "+1" + phone;
};

export default function Page() {
    const redirect = useRedirect();
    const { login, isLoading, error } = auth.oauth("google", redirect);

    const onLegal = async () => {
        await Linking.openURL(`${getBaseUrl()}/legal`);
    };

    return (
        <SafeAreaView className="flex-1 items-center justify-center">
            <Button onPress={() => login()}>Login with Google</Button>
        </SafeAreaView>
    );
}
