import { useEffect, useRef } from "react";
import type { AuthConfig } from "@trinity/auth";
import type {
    AuthProvider,
    AuthProviderBase,
    OAuthProviderConfig,
    OTPAuthProviderConfig,
    TAuthConfig,
} from "@koons/auth";
import {
    AuthRequestPromptOptions,
    AuthSessionResult,
    makeRedirectUri,
    useAuthRequest,
} from "expo-auth-session";
import { api } from "./api";
import { store } from "./store";

function useLogin(redirect: () => void) {
    const firstLoad = useRef(true);

    const { data: token, isLoading } = store.getToken.useQuery();
    const { mutate } = store.setToken.useMutation();

    useEffect(() => {
        if (firstLoad.current && !isLoading) {
            firstLoad.current = false;
            return;
        }
        if (!token) return;

        redirect();
    }, [token, isLoading]);

    return { saveToken: mutate };
}

interface ProxyCallbackOptions {
    type: "oauth" | "otp";
    provider: string;
    redirect: () => void;
}

type ProxyCallback = (opts: ProxyCallbackOptions) => unknown;

function createRecursiveProxy(
    callback: ProxyCallback,
    type: "oauth" | "otp" | undefined,
    providerId: string | undefined,
) {
    const proxy: unknown = new Proxy(
        () => {
            // dummy no-op function since we don't have any
            // client-side target we want to remap to
        },
        {
            get(_obj, key) {
                if (typeof key !== "string") return undefined;
                if (key != "otp" && key != "oauth")
                    throw Error("Invalid auth type");

                // Recursively compose the full path until a function is invoked
                return createRecursiveProxy(callback, key, undefined);
            },
            apply(_1, _2, args) {
                // Call the callback function with the entire path we
                // recursively created and forward the arguments
                if (type == undefined) throw Error("auth type is undefined");
                const [provider, redirect] = args;
                if (provider == undefined) throw Error("provider is undefined");
                if (typeof provider != "string")
                    throw Error("provider is not a string");
                return callback({
                    type,
                    provider,
                    redirect,
                });
            },
        },
    );

    return proxy;
}

type InferOTPInput<T> = T extends OTPAuthProviderConfig<infer I> ? I : never;

type OAuthLoginReturn = {
    login: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>;
    isLoading: boolean;
    error: { message: string } | null;
};

function oauthLogin(
    config: ReactConfig,
    providerId: string,
    redirect: () => void,
): OAuthLoginReturn {
    const { data } = api.auth.config.useQuery();

    const provider = data && data.oauth && data.oauth[providerId];

    const { saveToken } = useLogin(redirect);

    const redirectUri = makeRedirectUri({
        scheme: config.scheme,
    });

    const { mutate: oauthCallback, error } = api.auth.oauthCallback.useMutation(
        {
            onSuccess(token) {
                saveToken({ token });
            },
        },
    );

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: provider?.clientId || "",
            scopes: provider?.scope || [],
            // To follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            redirectUri,
        },
        {
            authorizationEndpoint: provider?.authorization,
            tokenEndpoint: provider?.token,
        },
    );

    useEffect(() => {
        if (response?.type === "success") {
            const { code } = response.params;
            if (!code) return;
            oauthCallback({
                code,
                provider: providerId as any,
                redirectUri,
            });
        }
    }, [response]);

    return {
        login: provider ? promptAsync : async (o) => ({ type: "cancel" }),
        isLoading: !request,
        error: error && { message: error.message },
    };
}

interface OTPAuthLoginReturn<I> {
    login: (input: I, code: string) => void;
    sendCode: (input: I) => void;
    isLoading: boolean;
    error: { message: string } | null;
}

function otpLogin<I extends Record<string, unknown>>(
    provider: string,
    redirect: () => void,
): OTPAuthLoginReturn<I> {
    const { saveToken } = useLogin(redirect);

    const {
        mutate: mutateSend,
        isLoading: isLoadingSend,
        error: errorSend,
    } = api.auth.sendOtp.useMutation();
    const {
        mutate: mutateVerify,
        isLoading: isLoadingVerify,
        error: errorVerify,
    } = api.auth.verifyOtp.useMutation({
        onSuccess(token, variables, context) {
            saveToken({ token });
        },
    });

    const login: OTPAuthLoginReturn<I>["login"] = (input, code) =>
        mutateVerify({
            provider: provider as any,
            input: input,
            code,
        });
    const sendCode: OTPAuthLoginReturn<I>["sendCode"] = (input) =>
        mutateSend({
            provider: provider as any,
            input: input,
        });

    const error = errorSend || errorVerify;

    return {
        login,
        sendCode,
        isLoading: isLoadingSend || isLoadingVerify,
        error: error && { message: error.message },
    };
}

interface ReactConfig {
    scheme?: string;
}

export function createAuthReact<TConfig extends TAuthConfig>(
    reactConfig: ReactConfig,
) {
    return createRecursiveProxy(
        (opts) => {
            return opts.type == "oauth"
                ? oauthLogin(reactConfig, opts.provider, opts.redirect)
                : otpLogin(opts.provider, opts.redirect);
        },
        undefined,
        undefined,
    ) as {
        oauth: <P extends keyof TConfig["providers"]["oauth"]>(
            provider: P,
            callback?: () => void,
        ) => OAuthLoginReturn;
        otp: <
            P extends keyof TConfig["providers"]["otp"],
            I = InferOTPInput<TConfig["providers"]["otp"][P]>,
        >(
            provider: P,
            callback?: () => void,
        ) => OTPAuthLoginReturn<I>;
    };
}
