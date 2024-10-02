import { Redirect, SplashScreen, Stack, usePathname } from "expo-router";
import { Text, View } from "@/components/Themed";
// import { useAuth } from "@/utils/auth";
import { ReactNode, useEffect, useRef, useState } from "react";
import { store } from "@/utils/store";
import * as Notifications from "expo-notifications";
import { Platform, SafeAreaView } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { api } from "@/utils/api";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "index",
};

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            handleRegistrationError(
                "Permission not granted to get push token for push notification!",
            );
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError("Project ID not found");
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log("pushtoken", pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        return null;
    }
}

export default function AppLayout() {
    const { data: token, isLoading } = store.getToken.useQuery();
    const { mutate } = api.user.pushToken.useMutation();
    // const [notification, setNotification] = useState<
    //     Notifications.Notification | undefined
    // >(undefined);

    // const notificationListener = useRef<Notifications.Subscription>();
    // const responseListener = useRef<Notifications.Subscription>();

    const { data: me } = api.user.me.useQuery(undefined, {
        enabled: !!token,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        onSuccess(data) {
            if (!data) return;

            if (Platform.OS == "web") return; // Ignore on web
            if (!token) return; // Ignore if not logged in
            // @ts-ignore TODO: Add pushToken to User in @koons/auth
            if (!data.pushToken) {
                registerForPushNotificationsAsync()
                    .then((token) => {
                        if (!token) return;
                        console.log("token", token);
                        mutate({ token });
                    })
                    .catch((error: any) => console.error(`${error}`));
            }

            // notificationListener.current =
            //     Notifications.addNotificationReceivedListener(
            //         (notification) => {
            //             setNotification(notification);
            //         },
            //     );

            // responseListener.current =
            //     Notifications.addNotificationResponseReceivedListener(
            //         (response) => {
            //             console.log(response);
            //         },
            //     );

            // return () => {
            //     notificationListener.current &&
            //         Notifications.removeNotificationSubscription(
            //             notificationListener.current,
            //         );
            //     responseListener.current &&
            //         Notifications.removeNotificationSubscription(
            //             responseListener.current,
            //         );
            // };
        },
    });

    const ref = useRef<string>();
    const pathname = usePathname();

    useEffect(() => {
        if (ref.current) return;
        ref.current = pathname;
    }, []);

    // You can keep the splash screen open, or render a loading screen like we do here.
    if (isLoading) {
        return null;
    }

    SplashScreen.hideAsync();

    // Only require authentication within the (app) group's layout as users
    // need to be able to access the (auth) group and sign in again.
    if (!token) {
        // On web, static rendering will stop here as the user is not authenticated
        // in the headless Node process that the pages are rendered in.

        return (
            <Redirect
                href={{
                    pathname: "/login",
                    params:
                        ref.current != "/"
                            ? { r: ref.current || "/" }
                            : undefined,
                }}
            />
        );
    }

    // This layout can be deferred because it's not the root layout.
    return (
        <Stack
            screenOptions={{
                headerBackTitle: "Back",
                headerTintColor: "white",
            }}
        >
            <Stack.Screen options={{ headerShown: false }} name="index" />
            <Stack.Screen
                options={{
                    animation: "slide_from_bottom",
                    gestureEnabled: false,
                    headerShown: false,
                }}
                name="request"
            />
            <Stack.Screen
                options={{ presentation: "modal", title: "Account" }}
                name="account"
            />
            <Stack.Screen
                options={{
                    animation: "slide_from_bottom",
                    headerShown: false,
                    gestureEnabled: false,
                }}
                name="search"
            />
            <Stack.Screen options={{ headerShown: false }} name="send" />
            <Stack.Screen options={{ title: "Ranking" }} name="leaderboard" />
        </Stack>
    );
}
