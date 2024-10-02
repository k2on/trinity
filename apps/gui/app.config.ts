import type { ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT == "development";
const ifDev = (str: string) => (IS_DEV ? str : "");

const defineConfig = (): ExpoConfig => ({
    name: "Trinity" + ifDev(" [Development Build]"),
    slug: "trinity",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "trinity",
    userInterfaceStyle: "automatic",
    splash: {
        image: "./assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: "#000000",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: false,
        bundleIdentifier: "us.koon.trinity" + ifDev(".dev"),
        buildNumber: "1",
        infoPlist: {
            ITSAppUsesNonExemptEncryption: false,
        },
        privacyManifests: {
            NSPrivacyAccessedAPITypes: [
                {
                    NSPrivacyAccessedAPIType:
                        "NSPrivacyAccessedAPICategoryUserDefaults",
                    NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
                },
            ],
        },
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#9333ea",
        },
        icon: "./assets/images/icon.png",
        package: "us.koon.trinity" + ifDev(".dev"),
    },
    web: {
        bundler: "metro",
        output: "server",
        favicon: "./assets/images/favicon.png",
    },
    updates: {
        fallbackToCacheTimeout: 0,
        url: "https://u.expo.dev/6fb5996b-e099-474d-8d6c-ebec74a43627",
    },
    runtimeVersion: "1.0.0",
    plugins: [
        "expo-router",
        "expo-secure-store",
        "expo-localization",
        [
            "expo-image-picker",
            {
                photosPermission:
                    "Allow $(PRODUCT_NAME) to access your photos to let you upload a profile picture to your account.",
            },
        ],
        [
            "@sentry/react-native/expo",
            {
                organization: "koon-industries-llc",
                project: "trinity",
                url: "https://sentry.io/",
            },
        ],
        [
            "expo-build-properties",
            {
                ios: {
                    deploymentTarget: "13.4",
                },
            },
        ],
        [
            "app-icon-badge",
            {
                enabled: IS_DEV,
                badges: [
                    {
                        text: "DEV",
                        type: "banner",
                        color: "white",
                        background: "#9b0101",
                    },
                ],
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        router: {
            origin: false,
        },
        eas: {
            projectId: "6fb5996b-e099-474d-8d6c-ebec74a43627",
        },
    },
    owner: "k2on",
});

export default defineConfig;
