import { OAuthProviderConfig, OAuthOptions } from "@koons/auth";

export interface GoogleProfile {
    sub: string;
    name: string;
    email: string;
    picture?: string;
}
export const Google = (
    options: OAuthOptions,
): OAuthProviderConfig<GoogleProfile> => ({
    id: "google",
    label: "Google",
    type: "oauth",
    authorization: "https://accounts.google.com/o/oauth2/auth",
    token: "https://oauth2.googleapis.com/token",
    userinfo: "https://www.googleapis.com/oauth2/v3/userinfo",
    scope: options.scope || ["openid", "profile", "email"],
    profile(profile) {
        console.log(profile);
        return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
        };
    },
    ...options,
});
