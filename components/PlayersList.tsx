import { ListView, FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { LocationContext } from "../Contexts/LocationContext";
import React, { useContext, Fragment } from "react";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
  },
  h1: {
    fontSize: 20,
    color: "#ffffff",
    marginBottom: 20,
    marginLeft: 20,
  },
  user: {
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: 2,
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 15,
    fontSize: 25,
    color: "#ffffff",
  },
  distance: {},
});
export default function PlayersList() {
  const location = useContext(LocationContext);
  const getUsers = (): Array<JSX.Element> => {
    const userListItems = location.nearUsers.map((user) => {
      return (
        <Text key={user.name} style={styles.user}>
          {user.name} {user.hitMetadata.distance.toFixed(3)} km
        </Text>
      );
    });
    return userListItems;
  };
  return (
    <View style={styles.container}>
      <Text h1 style={styles.h1}>
        Nearby users
      </Text>
      {getUsers()}
    </View>
  );
}
