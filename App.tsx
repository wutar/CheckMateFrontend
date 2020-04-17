import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Swiper from "react-native-swiper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});

function PlayersMap() {
  return (
    <View>
      <Text> Player map </Text>
    </View>
  );
}

function GamesOverview() {
  return (
    <View>
      <Text> Games Overview </Text>
    </View>
  );
}

function PlayerStats() {
  return (
    <View>
      <Text> Your stats </Text>
    </View>
  );
}

export default function App() {
  return (
    <Swiper showsPagination={false} loop={false}>
      <GamesOverview />
      <PlayersMap />
      <PlayerStats />
    </Swiper>
  );
}
