import React, { useEffect, useState, useRef, useContext } from "react";
import { Text, View, Button } from "react-native";
import { ButtonGroup, ElementObject } from "react-native-elements";
import Swiper from "react-native-swiper";
import PlayersMap from "../components/PlayersMap";
import { AuthContext } from "../Contexts/AuthContext";

function GamesOverview() {
  return (
    <View>
      <Text> Games of Player</Text>
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

export default function CheckMate() {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const swiper = useRef<Swiper>(null);
  const buttons = ["ToGames", "ToMap", "ToStats"];
  const updateIndex = (index) => {
    swiper.current?.scrollTo(index);
  };
  const { loggedIn, login, logout } = useContext(AuthContext);
  return loggedIn ? (
    <>
      <Swiper
        index={selectedIndex}
        ref={swiper}
        showsPagination={false}
        loop={false}
      >
        <GamesOverview />
        <PlayersMap />
        <PlayerStats />
      </Swiper>
      <ButtonGroup buttons={buttons} onPress={updateIndex} />
    </>
  ) : (
    <Button title="login" onPress={login} />
  );
}
