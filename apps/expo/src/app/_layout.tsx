import "@bacons/text-decoder/install";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

import { TRPCProvider } from "~/utils/api";

import "../styles.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <GestureHandlerRootView>
      <TRPCProvider>
        {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
        <Stack
          screenOptions={{
            title: "Trinity",
            headerTitleStyle: {
              color: colorScheme == "dark" ? "white" : "black",
            },
            headerStyle: {
              backgroundColor: colorScheme == "dark" ? "#111" : "#fff",
            },
            contentStyle: {
              backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
            },
          }}
        />
        <StatusBar />
      </TRPCProvider>
    </GestureHandlerRootView>
  );
}
