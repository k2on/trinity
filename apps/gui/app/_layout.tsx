import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
    Stack,
    useNavigationContainerRef,
    usePathname,
    useRouter,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "./global.css";

import { useColorScheme } from "@/components/useColorScheme";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/query";
import { TRPCProvider } from "@/utils/api";
import { Toaster } from "burnt/web";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { StatusBar } from "react-native";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

// export const unstable_settings = {
//     // Ensure that reloading on `/modal` keeps a back button present.
//     initialRouteName: "index",
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

process.env.EXPO_SKIP_DURING_EXPORT !== "true" &&
    Sentry.init({
        dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
        debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
        integrations: [
            new Sentry.ReactNativeTracing({
                // Pass instrumentation to be used as `routingInstrumentation`
                routingInstrumentation,
                enableNativeFramesTracking: !isRunningInExpoGo(),
                // ...
            }),
        ],
    });

function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    // Capture the NavigationContainer ref and register it with the instrumentation.
    const ref = useNavigationContainerRef();

    useEffect(() => {
        if (ref) {
            routingInstrumentation.registerNavigationContainer(ref);
        }
    }, [ref]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    return (
        <QueryClientProvider client={queryClient}>
            <StatusBar barStyle="light-content" />
            <TRPCProvider>
                <ThemeProvider
                    value={colorScheme === "dark" ? DarkTheme : DarkTheme}
                >
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <BottomSheetModalProvider>
                            <Stack>
                                <Stack.Screen
                                    name="(app)"
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="login"
                                    options={{
                                        headerShown: false,
                                        gestureEnabled: false,
                                        animation: "none",
                                    }}
                                />
                                <Stack.Screen
                                    name="legal"
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="support"
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                            </Stack>
                            <Toaster theme="dark" />
                        </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                </ThemeProvider>
            </TRPCProvider>
        </QueryClientProvider>
    );
}

export default Sentry.wrap(RootLayout);
