import {
    SafeAreaView,
    View,
    Text,
    Platform,
    AppState,
    Alert,
    RefreshControl,
} from "react-native";
import { Button } from "@/components/Button";
import { api, getBaseUrl, RouterOutputs } from "@/utils/api";
import { FlashList } from "@shopify/flash-list";
import { Link, useRouter } from "expo-router";
import { EllipsisVerticalIcon, User2Icon } from "lucide-react-native";
import { Avatar } from "@/components/Avatar";
import * as timeago from "timeago.js";
import en_short from "timeago.js/lib/lang/en_short";
import {
    useState,
    useEffect,
    useMemo,
    useRef,
    useCallback,
    ReactNode,
} from "react";
import { toast } from "burnt";
import * as Notifications from "expo-notifications";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { Skeleton } from "moti/skeleton";
import { haptics } from "@/utils/haptics";
import { StatusBar } from "react-native";
import { error } from "@/utils/toast";
import * as WebBrowser from "expo-web-browser";
import { store } from "@/utils/store";

timeago.register("en_short", en_short);

export function useNotification() {
    const [notification, setNotification] =
        useState<Notifications.Notification | null>(null);

    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(
            (receivedNotification) => {
                setNotification(receivedNotification);
            },
        );

        return () => subscription.remove();
    }, []);

    return notification;
}

export default function Page() {
    const utils = api.useUtils();

    const notification = useNotification();

    useEffect(() => {
        if (notification) {
            utils.invalidate();
        }
    }, [notification]);

    const [appState, setAppState] = useState(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            (nextAppState) => {
                if (
                    appState.match(/inactive|background/) &&
                    nextAppState === "active"
                ) {
                    // App has come to the foreground
                    utils.invalidate();
                }
                setAppState(nextAppState);
            },
        );

        return () => {
            subscription.remove();
        };
    }, [appState]);

    const router = useRouter();

    const { data: me } = api.user.me.useQuery();
    const { mutate: logout } = store.removeToken.useMutation();

    return (
        <SafeAreaView
            className="flex-1 items-center justify-center"
            style={{
                paddingTop:
                    Platform.OS == "android"
                        ? StatusBar.currentHeight
                        : undefined,
            }}
        >
            <Avatar size={50} account={me || null} />
            <Text className="text-white">Hello {me?.name}</Text>
            <Button
                variant="outline"
                onPress={() => {
                    logout();
                }}
            >
                Signout
            </Button>
        </SafeAreaView>
    );
}
