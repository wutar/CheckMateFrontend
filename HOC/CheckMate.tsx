import React, { useEffect, useState, useRef, useContext } from "react";
import { Text, View, Button } from "react-native";
import { ButtonGroup, ElementObject, Input } from "react-native-elements";
import Swiper from "react-native-swiper";
import PlayersMap from "../components/PlayersMap";
import { AuthContext, AuthContextProps } from "../Contexts/AuthContext";
import AuthorizationApp from "../components/auth/AuthorizationApp";
import PlayersList from "../components/PlayersList";
import PlayerStats from "../components/PlayerStats";

function GamesOverview() {
  return (
    <View>
      <Text> Games of Player</Text>
    </View>
  );
}
/*
function PlayerStats() {
  const auth: AuthContextProps = useContext(AuthContext);

  return (
    <View>
      <Text> Your stats </Text>
      <Button title="Logout" onPress={() => auth.logout()} />
    </View>
  );
}*/

export default function CheckMate() {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const swiper = useRef<Swiper>(null);
  const buttons = ["ToGames", "ToMap", "ToStats"];
  const updateIndex = (index) => {
    swiper.current?.scrollTo(index);
  };
  const auth: AuthContextProps = useContext(AuthContext);
  return auth.user ? (
    <>
      <Swiper
        index={selectedIndex}
        ref={swiper}
        showsPagination={false}
        loop={false}
      >
        <PlayersList />
        <PlayersMap />
        <PlayerStats
          username={auth.user.displayName!}
          goLevel={0}
          chessLevel={0}
          checkersLevel={0}
        />
      </Swiper>
      <ButtonGroup
        buttons={buttons}
        onPress={(index) => {
          alert("yeer");
          updateIndex(index);
        }}
      />
    </>
  ) : (
    <AuthorizationApp />
  );
}
