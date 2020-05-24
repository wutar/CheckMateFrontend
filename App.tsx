import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  PermissionsAndroid,
  Button,
} from "react-native";
import { ButtonGroup, ElementObject } from "react-native-elements";
import Swiper from "react-native-swiper";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import RNReactNativeLocationServicesSettings from "react-native-location-services-settings";
import Geolocation from "@react-native-community/geolocation";
import PlayersMap from "./components/PlayersMap";

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

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const swiper = useRef<Swiper>(null);
  const buttons = ["ToGames", "ToMap", "ToStats"];
  const updateIndex = (index) => {
    swiper.current?.scrollTo(index);
  };
  return (
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
  );
}
