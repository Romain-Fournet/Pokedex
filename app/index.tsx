import { Card } from "@/components/Card";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { SearchBar } from "@/components/SearchBar";
import { SortButton } from "@/components/SortButton";
import { ThemedText } from "@/components/ThemedText";
import { getPokemonId } from "@/functions/pokemon";
import { useInfiniteFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useState } from "react";
import { StyleSheet, Image, FlatList, ActivityIndicator } from "react-native";

export default function Index() {
  const colors = useThemeColors();
  const {data, isFetching, fetchNextPage} = useInfiniteFetchQuery('/pokemon?limit=21')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<"id" | "name">("id")
  const pokemons = data?.pages.flatMap(page => page.results.map(r => ({name: r.name, id: getPokemonId(r.url)}))) ?? []
  const filteredPokemons = [...(search 
    ? pokemons.filter(p => 
        p.name.includes(search.toLowerCase()) || 
        p.id.toString().includes(search)
      ) 
      : pokemons
    )].sort((a, b) => (a[sortKey] < b[sortKey] ? -1 : 1))
  return (
    <RootView>
      <Row style={styles.header} gap={16}>
        <Image source={require("@/assets/images/pokeball.png")} width={24} height={24}></Image>
        <ThemedText variant="headline" color="grayLight">Pokédex</ThemedText>
      </Row>
      <Row gap={16} style={styles.form}>
        <SearchBar value={search} onChange={setSearch}></SearchBar>
        <SortButton value={sortKey} onChange={setSortKey}/>
      </Row> 
      <Card style={styles.body}>
        <FlatList 
          data={filteredPokemons}
          numColumns={3}
          columnWrapperStyle={styles.gridGap}
          contentContainerStyle={[styles.gridGap, styles.list]}
          ListFooterComponent={isFetching ? <ActivityIndicator color={colors.tint}></ActivityIndicator> : null}
          onEndReached={search ? undefined : () => fetchNextPage()}
          renderItem={({item}) => <PokemonCard id={item.id} name={item.name} style={{flex: 1/3}}/>
          } keyExtractor={(item) => item.id.toString()}/>
      </Card>
    </RootView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingBottom: 8
  },
  body: {
    flex: 1,
    marginTop: 16
  },
  gridGap: {
    gap: 8
  },
  list: {
    padding: 12
  },
  form: {
    paddingHorizontal: 12
  }
})