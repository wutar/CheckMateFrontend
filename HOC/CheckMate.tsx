import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { ButtonGroup, ElementObject, Input } from "react-native-elements";
import Swiper from "react-native-swiper";
import PlayersMap from "../components/PlayersMap";
import { AuthContext, AuthContextProps } from "../Contexts/AuthContext";
import AuthorizationApp from "../components/auth/AuthorizationApp";
import PlayersList from "../components/PlayersList";
import PlayerStats from "../components/PlayerStats";
const opponents = require("./img/face-to-face.png");
const map = require("./img/treasure-map.png");
const profile = require("./img/ninja-heroic-stance.png");

const windowHeight = Dimensions.get("window").height - 240;
const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
    paddingBottom: 1000,
    height: windowHeight,
  },
  floatingButtons: {
    backgroundColor: "#ffffff00",
    height: 60,
    width: "100%",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 30,
    left: 5,
    right: 5,
    borderRadius: 10,
  },
  navIcon: {
    borderWidth: 0,
    height: 60,
    width: 60,
  },
  button: {
    borderWidth: 0,
    backgroundColor: "#ffffff00",
    height: 60,
    width: 60,
    marginHorizontal: 20,
  },
  selectedButton: {
    backgroundColor: "#23F5A0",
  },
});

export default function CheckMate() {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const swiper = useRef<Swiper>(null);
  const toPlayersListButton = (): JSX.Element => (
    <Image source={opponents} style={styles.navIcon} />
  );
  const toPlayersMapButton = (): JSX.Element => (
    <Image source={map} style={styles.navIcon} />
  );
  const toPlayerStatsButton = (): JSX.Element => (
    <Image source={profile} style={styles.navIcon} />
  );

  const buttons = [
    { element: toPlayersListButton },
    { element: toPlayersMapButton },
    { element: toPlayerStatsButton },
  ];
  const updateIndex = (index) => {
    swiper.current?.scrollTo(index);
  };
  const navigatorButtons = (): JSX.Element => {
    return (
      <ButtonGroup
        containerStyle={styles.floatingButtons}
        innerBorderStyle={{ width: 0, color: "#ffffffff" }}
        buttonStyle={styles.button}
        buttons={buttons}
        onPress={(index) => {
          updateIndex(index);
        }}
        selectedButtonStyle={styles.selectedButton}
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
        <PlayerStats {...auth.user} />
      </Swiper>
      {navigatorButtons()}
    </>
  ) : (
    <AuthorizationApp />
  );
}
