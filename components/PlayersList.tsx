import {
  ListView,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Text, Overlay } from "react-native-elements";
import {
  LocationContext,
  LocationContextProps,
} from "../Contexts/LocationContext";
import React, { useContext, Fragment, useState } from "react";
import PlayerStats from "./PlayerStats";
import {
  ChallengesContextProps,
  ChallengesContext,
} from "../Contexts/ChallengesContext";
import { User } from "../base-types";
import { AuthContextProps, AuthContext } from "../Contexts/AuthContext";
import firebase from "firebase";
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
  overlay: {
    width: "90%",
    height: 500,
  },
});

interface PlayersListProps {}
export default function PlayersList(props: PlayersListProps) {
  const auth: AuthContextProps = useContext(AuthContext);
  const location: LocationContextProps = useContext(LocationContext);
  const challenges: ChallengesContextProps = useContext(ChallengesContext);
  const [selectedUser, setSelectedUser] = useState<User | null>();
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
            {user.hitMetadata!.distance.toFixed(3)} km
          </Text>
        </TouchableOpacity>
      );
    });
    return userListItems;
  };

  const getChallenges = (): Array<JSX.Element> => {
    const userListItems = challenges.challenges.map((challenge) => {
      const opponent: User =
        challenge.challengedUser?.email == auth.user!.email
          ? challenge.challenger
          : challenge.challengedUser;
      return (
        <TouchableOpacity
          key={opponent.email + challenge.discipline}
          style={styles.user}
        >
          <Text style={styles.name}>{opponent.name}</Text>
          <Text style={styles.name}>{challenge.discipline}</Text>
          <Text style={styles.name}>Lv. {opponent.checkersLevel}</Text>
        </TouchableOpacity>
      );
    });
    return userListItems;
  };

  return (
    <View style={styles.container}>
      <Text h1 style={styles.h1}>
        Ongoing Challenges
      </Text>
      {getChallenges()}
      <Text h1 style={styles.h1}>
        Nearby users
      </Text>
      {getUsers()}
      {selectedUser && (
        <Overlay
          overlayStyle={styles.overlay}
          isVisible={selectedUser!.name !== ""}
          onBackdropPress={() => setSelectedUser(null)}
        >
          <PlayerStats {...selectedUser} />
        </Overlay>
      )}
    </View>
  );
}
