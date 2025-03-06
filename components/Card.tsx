import { Shadows } from "@/constants/Shadows";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ViewProps, View, ViewStyle } from "react-native";

type Props = ViewProps;

export function Card({style, ...rest}: Props) {
    const colors = useThemeColors();
    return(
        <View style={[styles, {backgroundColor: colors.grayWhite}, style]} {...rest}></View>
    )
}

const styles = {
    backgroundColor: "#FFF",
    borderRadius: 8,
    ...Shadows.dp2
} satisfies ViewStyle