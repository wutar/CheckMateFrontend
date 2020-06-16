import React, { useEffect, useContext } from "react";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
const pagoda = require("./img/pagoda.png"); //from game-icons.net
const ninja = require("./img/ninja-head.png"); //from game-icons.net

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  LocationContextProps,
  LocationContext,
} from "../Contexts/LocationContext";
import {
  ChallengesContextProps,
  ChallengesContext,
} from "../Contexts/ChallengesContext";
import { AuthContextProps, AuthContext } from "../Contexts/AuthContext";
import { withTheme } from "react-native-elements";

const mapStylesJSON = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8ec3b9",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1a3646",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#4bd2ef",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#4b6878",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#64779e",
      },
    ],
  },
  {
    featureType: "administrative.neighborhood",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#4b6878",
      },
    ],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#334e87",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#023e58",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#283d6a",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6f9ba5",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#023e58",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3C7680",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#304a7d",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#98a5be",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#2c6675",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#255763",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#b0d5ce",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#023e58",
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#98a5be",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#283d6a",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#3a4762",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#0e1626",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#4e6d70",
      },
    ],
  },
];

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
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    height: 60,
    width: 60,
  },
  opponentName: {
    marginLeft: 15,
    color: "white",
  },
});

export default function PlayersMap() {
  const location: LocationContextProps = useContext(LocationContext);
  const challengesContext: ChallengesContextProps = useContext(
    ChallengesContext
  );
  const auth: AuthContextProps = useContext(AuthContext);
  const getMarkers = (): Array<JSX.Element> => {
    const hotspotMarkers = location.hotspots.map((hotspot) => {
      return (
        <Marker
          key={hotspot.id}
          coordinate={{
            latitude: hotspot.position.geopoint.latitude,
            longitude: hotspot.position.geopoint.longitude,
          }}
        >
          <Image source={pagoda} style={styles.image} />
        </Marker>
      );
    });
    const usersMarkers = challengesContext.challenges
      .filter((c) => c.accepted)
      .map((challenge) => {
        const opponent =
          auth.user!.email == challenge.challengedUser.email
            ? challenge.challenger
            : challenge.challengedUser;
        if (!opponent.location?.geopoint.latitude)
          return (
            <Marker
              key={opponent.email + challenge.discipline}
              coordinate={{
                latitude: opponent.location!.geopoint.wc!,
                longitude: opponent.location!.geopoint.Rc!,
              }}
            >
              <Image source={ninja} style={styles.image} />
              <Text style={styles.opponentName}>{opponent.name}</Text>
            </Marker>
          );
        return (
          <Marker
            key={opponent.email + challenge.discipline}
            coordinate={{
              latitude: opponent.location!.geopoint.latitude,
              longitude: opponent.location!.geopoint.longitude,
            }}
          >
            <Image source={ninja} style={styles.image} />
            <Text style={styles.opponentName}>{opponent.name}</Text>
          </Marker>
        );
      });

    return [...hotspotMarkers, ...usersMarkers];
  };
  useEffect(() => {
    return () => {};
  }, []);
  if (!(location.currentLatitude === 0 && location.currentLongitude === 0))
    return (
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={mapStylesJSON}
          showsUserLocation={true}
          followsUserLocation={true}
          scrollEnabled={true}
          zoomEnabled={true}
          initialRegion={{
            latitude: location.currentLatitude,
            longitude: location.currentLongitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {getMarkers()}
        </MapView>
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: Dimensions.get("window").width - 20,
            backgroundColor: "transparent",
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: Dimensions.get("window").width - 20,
            left: 0,
            backgroundColor: "transparent",
          }}
        ></View>
      </View>
    );
  return (
    <View>
      <Text> Location not enabled </Text>
    </View>
  );
}
