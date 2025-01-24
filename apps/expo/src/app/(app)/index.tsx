import { Button, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { api } from "~/utils/api";
import { useSignOut, useUser } from "~/utils/auth";

export default function Index() {
  const utils = api.useUtils();
  const signOut = useSignOut();
  const user = useUser();

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: "Home Page" }} />
      <Text className="text-white">Create</Text>
      <Image
        source={{ uri: user?.image! }}
        className="h-24 w-24 rounded-full"
      />
      <Button title="Louout" onPress={() => signOut()} />
    </SafeAreaView>
  );
}
