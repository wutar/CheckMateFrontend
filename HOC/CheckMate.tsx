import React, { useEffect, useState, useRef, useContext } from "react";
import { Text, View, Button, StyleSheet, Dimensions } from "react-native";
import { ButtonGroup, ElementObject, Input } from "react-native-elements";
import Swiper from "react-native-swiper";
import PlayersMap from "../components/PlayersMap";
import { AuthContext, AuthContextProps } from "../Contexts/AuthContext";
import AuthorizationApp from "../components/auth/AuthorizationApp";
import PlayersList from "../components/PlayersList";
import PlayerStats from "../components/PlayerStats";

const windowHeight = Dimensions.get("window").height - 240;
const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
    paddingBottom: 1000,
    height: windowHeight,
  },
  floatingButtons: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    borderRadius: 10,
  },
});

export default function CheckMate() {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const swiper = useRef<Swiper>(null);
  const buttons = ["ToGames", "ToMap", "ToStats"];
  const updateIndex = (index) => {
    swiper.current?.scrollTo(index);
  };
  const navigatorButtons = (): JSX.Element => {
    return (
      <ButtonGroup
        containerStyle={styles.floatingButtons}
        buttons={buttons}
        onPress={(index) => {
          updateIndex(index);
        }}
      />
    );
  };
  const auth: AuthContextProps = useContext(AuthContext);
  return auth.user ? (
    <>
      <Swiper
        index={selectedIndex}
        ref={swiper}
        showsPagination={false}
        loop={false}
        style={styles.mainContainer}
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
      {navigatorButtons()}
    </>
  ) : (
    <AuthorizationApp />
  );
}
