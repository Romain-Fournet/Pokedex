import { Colors } from "@/constants/Colors"
import { createMultiStyleIconSet } from "@expo/vector-icons"
import { View, ViewStyle } from "react-native"
import { ThemedText } from "../ThemedText"
import { useThemeColors } from "@/hooks/useThemeColors"

type Props = {
    name: keyof typeof Colors["type"]
}

export function PokemonType({ name }: Props){
    const colors = useThemeColors()
    return (
        <View style={[rootStyles, {backgroundColor: Colors.type[name]}]}>
            <ThemedText color="grayWhite" variant="subtitle3" style={{textTransform: 'capitalize'}}>{name}</ThemedText>
        </View>
    )
}

const rootStyles = {
    flex: 0,
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 8
} satisfies ViewStyle