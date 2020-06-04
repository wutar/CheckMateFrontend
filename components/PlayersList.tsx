import {
  ListView,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Text, Overlay } from "react-native-elements";
import { LocationContext } from "../Contexts/LocationContext";
import React, { useContext, Fragment, useState } from "react";
import PlayerStats from "./PlayerStats";
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

interface User {
  hitMetadata: {
    distance: number;
    bearing: number;
  };
  name: string;
  position: {
    geohash: string;
    geopoint: {
      longitude: number;
      latitude: number;
    };
  };
}

interface PlayersListProps {}
export default function PlayersList(props: PlayersListProps) {
  const location = useContext(LocationContext);
  const [selectedUser, setSelectedUser] = useState<User>({
    hitMetadata: {
      distance: 0,
      bearing: 0,
    },
    name: "",
    position: {
      geohash: "",
      geopoint: {
        longitude: 0,
        latitude: 0,
      },
    },
  });
  const getUsers = (): Array<JSX.Element> => {
    const userListItems = location.nearUsers.map((user) => {
      return (
        <TouchableOpacity
          key={user.name}
          style={styles.user}
          onPress={() => setSelectedUser(user)}
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
      <Overlay
        isVisible={selectedUser.name !== ""}
        onBackdropPress={() =>
          setSelectedUser({
            hitMetadata: {
              distance: 0,
              bearing: 0,
            },
            name: "",
            position: {
              geohash: "",
              geopoint: {
                longitude: 0,
                latitude: 0,
              },
            },
          })
        }
      >
        <PlayerStats
          username={selectedUser.name}
          goLevel={0}
          checkersLevel={0}
          chessLevel={0}
        />
      </Overlay>
    </View>
  );
}
