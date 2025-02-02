import type { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT == "development";
const ifDev = (str: string) => (IS_DEV ? str : "");

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Trinity" + ifDev(" [Development Build]"),
  slug: "trinity",
  scheme: "trinity",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#FFFFFF",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    buildNumber: "4",
    bundleIdentifier: "com.koonindustries.trinity" + ifDev(".dev"),
    supportsTablet: true,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
          NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
        },
      ],
    },
  },
  android: {
    package: "com.koonindustries.trinity" + ifDev(".dev"),
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#FFFFFF",
    },
  },
  extra: {
    eas: {
      projectId: "24b305b0-49ea-41ef-8500-fad83a983f2e",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
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
});
