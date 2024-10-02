import { AuthConfig } from "@trinity/auth";
import { createAuthReact } from "./koonsauth-react";
import { router, useGlobalSearchParams } from "expo-router";

export const auth = createAuthReact<AuthConfig>({
    scheme: "trinity",
});
