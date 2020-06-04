import {
  ListView,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
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
    color: "#ffffff",
  },
  name: {
    fontSize: 25,
    color: "#ffffff",
  },
  distance: {
    color: "#ffffff",
    fontSize: 15,
  },
});
export default function PlayersList() {
  const location = useContext(LocationContext);
  const getUsers = (): Array<JSX.Element> => {
    const userListItems = location.nearUsers.map((user) => {
      return (
        <TouchableOpacity
          key={user.name}
          style={styles.user}
          onPress={() => alert(user.name)}
        >
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.distance}>
            {user.hitMetadata.distance.toFixed(3)} km
          </Text>
        </TouchableOpacity>
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
