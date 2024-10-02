import { ReactNode } from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

type Variant = "default" | "outline";

export function Button(
    props: {
        variant?: Variant;
        children?: ReactNode;
        isLoading?: boolean;
    } & TouchableOpacity["props"],
) {
    const disabled = props.disabled || props.isLoading;
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            {...props}
            className={`${disabled ? "bg-zinc-800" : !props.variant ? "bg-blue-600" : "bg-transparent border-zinc-700 border-[1px]"} flex items-center justify-center flex-row rounded-full px-4 py-2 h-12 ${props.className}`}
        >
            {props.isLoading ? (
                <ActivityIndicator />
            ) : (
                <Text
                    className={`${disabled ? "text-gray-400" : "text-white"} text-center text-xl`}
                >
                    {props.children}
                </Text>
            )}
        </TouchableOpacity>
    );
}
