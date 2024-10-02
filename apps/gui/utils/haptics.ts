import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const preform = (fn: () => Promise<void>) => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
        return () => fn();
    }
    return () => null;
};

const impact = (style: Haptics.ImpactFeedbackStyle) =>
    preform(() => Haptics.impactAsync(style));

const notification = (type: Haptics.NotificationFeedbackType) =>
    preform(() => Haptics.notificationAsync(type));

export const haptics = {
    light: impact(Haptics.ImpactFeedbackStyle.Light),
    medium: impact(Haptics.ImpactFeedbackStyle.Medium),
    heavy: impact(Haptics.ImpactFeedbackStyle.Heavy),
    success: notification(Haptics.NotificationFeedbackType.Success),
    error: notification(Haptics.NotificationFeedbackType.Error),
};
