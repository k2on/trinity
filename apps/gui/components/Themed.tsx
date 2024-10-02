/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
    Text as DefaultText,
    View as DefaultView,
    TouchableOpacity,
    TextInput as DefaultTextInput,
} from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type ButtonProps = ThemeProps & {
    title: string;
    variant?: "default" | "ghost";
} & TouchableOpacity["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
    const theme = useColorScheme() ?? "light";
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}

export function Text(props: TextProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "background",
    );

    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Button(props: ButtonProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor(
        { light: "#eee", dark: "#222" },
        "background",
    );
    const color = useThemeColor({ light: "#555", dark: "#eee" }, "text");

    const variants = {
        default: {
            backgroundColor,
            color: undefined,
        },
        ghost: {
            backgroundColor: "transparent",
            color,
        },
    };

    // const color = useThemeColor({ light: "#333", dark: "#1ED760" }, 'text');

    return (
        <TouchableOpacity
            style={{
                backgroundColor:
                    variants[props.variant || "default"].backgroundColor,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 50,
            }}
            {...otherProps}
        >
            <DefaultText
                style={{
                    fontSize: 20,
                    color: variants[props.variant || "default"].color,
                }}
            >
                {props.title}
            </DefaultText>
        </TouchableOpacity>
    );
}

export function TextInput(props: TextInputProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const placeholderTextColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "text",
    );

    return (
        <DefaultTextInput
            placeholderTextColor={placeholderTextColor}
            style={[{ color }, style]}
            {...otherProps}
        />
    );
}
