import { api } from "@/utils/api";
import { store } from "@/utils/store";
import { useImageUploader } from "@/utils/uploadthing";
import { Alert, ScrollView, TouchableOpacity, View, Text } from "react-native";
import { openSettings } from "expo-linking";
import { Avatar } from "@/components/Avatar";
import { CameraIcon } from "lucide-react-native";
import { useState } from "react";

export default function Page() {
    const { mutate: signOut } = store.removeToken.useMutation();
    const { data: token } = store.getToken.useQuery();
    const { data: me } = api.user.me.useQuery();
    const { mutate: removePushToken } = api.user.pushToken.useMutation({
        onSettled() {
            signOut();
        },
    });
    const [noPermissions, setNoPermissions] = useState(false);

    const utils = api.useUtils();

    const { openImagePicker, isUploading } = useImageUploader("profileImage", {
        headers: {
            Authorization: token || "",
        },
        onClientUploadComplete(_res) {
            utils.user.me.invalidate();
        },
    });
    const onInsufficientPermissions = () => {
        setNoPermissions(true);
        if (!noPermissions) return;
        Alert.alert(
            "No Permissions",
            "You need to allow the app to access your photos to upload a profile picture.",
            [{ text: "Dismiss" }],
        );
    };

    const onChangePicture = () => {
        openImagePicker({
            source: "library",
            onInsufficientPermissions,
        });
    };

    const onSignOut = () => {
        removePushToken({ token: null });
    };

    return (
        <>
            <ScrollView>
                <View className="flex items-center py-4">
                    <TouchableOpacity
                        onPress={onChangePicture}
                        activeOpacity={0.8}
                    >
                        <Avatar size={100} account={me || null} />
                        <View className="absolute bottom-0 right-0 p-2 rounded-full bg-black">
                            <CameraIcon size={20} color="gray" />
                        </View>
                    </TouchableOpacity>
                </View>
                <View className="p-4 flex flex-col gap-4">
                    <View className="bg-zinc-900 p-4 rounded-2xl flex flex-col gap-8">
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-white">Name</Text>
                            <Text className="text-white">{me?.name}</Text>
                        </View>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-white">Phone</Text>
                            <Text className="text-white">{me?.phone}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onSignOut} activeOpacity={0.8}>
                        <View className="bg-red-900 p-4 rounded-2xl flex flex-col gap-8">
                            <View className="flex flex-row justify-between items-center">
                                <Text className="text-white">
                                    Delete Account
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onSignOut} activeOpacity={0.8}>
                        <View className="bg-red-900 p-4 rounded-2xl flex flex-col gap-8">
                            <View className="flex flex-row justify-between items-center">
                                <Text className="text-white">Sign Out</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
}
