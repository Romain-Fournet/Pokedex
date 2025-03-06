import { Card } from "@/components/Card";
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStats } from "@/components/pokemon/PokemonStats";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { basePokemonStats, formatWeight, getPokemonArtWork } from "@/functions/pokemon";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import { View, Image, Pressable, StyleSheet, Text } from "react-native";
import {Audio} from "expo-av"

export default function Pokemon(){
    const colors = useThemeColors()
    const params = useLocalSearchParams() as {id: string};
    const id = parseInt(params.id, 10)
    const { data: pokemon } = useFetchQuery('/pokemon/[id]', {id: params.id})
    const { data: species } = useFetchQuery('/pokemon-species/[id]', {id: params.id})
    const mainType = pokemon?.types?.[0].type.name
    const colorType = mainType ? Colors.type[mainType] : colors.tint 
    const types = pokemon?.types ?? []
    const bio = species?.flavor_text_entries.find(({language}) => language.name == 'en')?.flavor_text.replaceAll("\n", " ")
    const stats = pokemon?.stats ?? basePokemonStats

    const onChevronLeftPressed = () => {
        router.replace({pathname: '/pokemon/[id]', params: {id: Math.max(id - 1, 1)}})
    }

    const onPokemonPressed = async () => {
        const cry = pokemon?.cries.latest
        if(!cry){
            return
        }
        const {sound} = await Audio.Sound.createAsync({
            uri: cry
        }, {shouldPlay: true})

        sound.playAsync()
    }

    const onChevronRightPressed = () => {
        router.replace({pathname: '/pokemon/[id]', params: {id: Math.min(id + 1, 151)}})
    }

    return(
        <RootView backgroundColor={colorType}>
            <View>
                <Image style={styles.pokeball} source={require('@/assets/images/pokeball_big.png')} width={208} height={208}/>
                <Row style={styles.header}>
                    <Row gap={8}>
                        <Pressable onPress={router.back}>
                            <Image source={require('@/assets/images/arrow_back.png')} width={32} height={32}/>
                        </Pressable>
                        <ThemedText color="grayWhite" variant="headline" style={{textTransform: 'capitalize'}}>{pokemon?.name}</ThemedText>
                    </Row>
                    <ThemedText color="grayWhite" variant="subtitle2" >#{params.id.padStart(3, '0')}</ThemedText>
                </Row>
                <Card style={styles.card}>
                    <Row style={styles.imageRow}>
                        {id === 1 ?<View style={{width: 24, height: 24}}></View> : <Pressable onPress={() => onChevronLeftPressed()}>
                            <Image width={24} height={24} source={require('@/assets/images/chevron_left.png')}></Image>
                        </Pressable>}
                        <Pressable onPress={() => onPokemonPressed()}>
                            <Image style={styles.artwork} source={{uri : getPokemonArtWork(params.id)}} width={200} height={200}/>
                        </Pressable>
                        {id === 151 ? <View style={{width: 24, height: 24}}></View> : <Pressable onPress={() => onChevronRightPressed()}>
                            <Image width={24} height={24} source={require('@/assets/images/chevron_right.png')}></Image>
                        </Pressable>}
                    </Row>
                    <Row gap={16} style={{height: 20}}>
                        {types.map((type) => <PokemonType name={type.type.name} key={type.type.name}/>)}
                    </Row>
                    <ThemedText variant="subtitle1" style={{color: colorType}}>About</ThemedText>
                    <Row>
                        <PokemonSpec style={{borderStyle: 'solid', borderRightWidth: 1, borderColor: colors.grayLight}} title={formatWeight(pokemon?.weight)} description="Weight" image={require('@/assets/images/weight.png')}/>
                        <PokemonSpec style={{borderStyle: 'solid', borderRightWidth: 1, borderColor: colors.grayLight}} title={formatWeight(pokemon?.height)} description="Size" image={require('@/assets/images/straighten.png')}/>
                        <PokemonSpec title={pokemon?.moves.slice(0, 2).map(m => m.move.name).join("\n")} description="Moves"/>
                    </Row>
                    <ThemedText>{bio}</ThemedText>
                    <ThemedText variant="subtitle1" style={{color: colorType}}>Base stats</ThemedText>
                    <View style={{alignSelf: 'stretch'}}>
                        {stats.map(stat => <PokemonStats key={stat.stat.name} name={stat.stat.name} value={stat.base_stat} color={colorType} />)}
                    </View>
                </Card>
            </View>
        </RootView>
    )
}

const styles = StyleSheet.create({
    header: {
        margin: 20,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pokeball: {
        position: 'absolute',
        right: 8,
        top: 8
    },
    artwork: {},
    body: {
    },
    card: {
        marginTop: 144,
        paddingHorizontal: 20,
        paddingTop: 54,
        paddingBottom: 20,
        gap: 16,
        alignItems: 'center'
    },
    imageRow: {
        position: 'absolute',
        top: -140,
        zIndex: 2,
        left: 0,
        right: 0,
        justifyContent: 'space-between',
        paddingHorizontal: 20
    }
})
