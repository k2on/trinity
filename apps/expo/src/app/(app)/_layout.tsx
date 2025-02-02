import { Button, SafeAreaView, Text } from "react-native";
import { Slot } from "expo-router";

import { api } from "~/utils/api";
import { useSignIn } from "~/utils/auth";
// import { signIn, useUser } from "~/utils/auth";
import { getToken } from "~/utils/session-store";

export default function Layout() {
  const signIn = useSignIn();

  const { data, isLoading } = api.auth.getSession.useQuery();
  if (isLoading)
    return (
      <SafeAreaView>
        <Text className="text-white">Loading</Text>
      </SafeAreaView>
    );

  if (!data) {
    return (
      <SafeAreaView>
        <Text className="text-white">Please sign in</Text>

        <Button title="Sign In" onPress={() => signIn()} />
      </SafeAreaView>
    );
  }

  return <Slot />;
}
