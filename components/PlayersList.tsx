import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Text, Overlay } from "react-native-elements";
import {
  LocationContext,
  LocationContextProps,
} from "../Contexts/LocationContext";
import React, { useContext, useState } from "react";
import PlayerStats from "./PlayerStats";
import {
  ChallengesContextProps,
  ChallengesContext,
} from "../Contexts/ChallengesContext";
const deny = require("./img/cancel.png"); //from game-icons.net
const accept = require("./img/check-mark.png"); //from game-icons.net
const start = require("./img/play-button.png"); //from game-icons.net
const won = require("./img/trophy.png"); //from game-icons.net
const lost = require("./img/thumb-down.png"); //from game-icons.net

import { User } from "../base-types";
import { AuthContextProps, AuthContext } from "../Contexts/AuthContext";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
  },

  level: {
    fontSize: 18,
    color: "#ffffff",
  },
  h1: {
    fontSize: 20,
    color: "#ffffff",
    marginBottom: 20,
    marginLeft: 20,
  },
  usersList: {
    marginBottom: 200,
  },
  user: {
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: 2,
    display: "flex",
    flexDirection: "row",
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
    marginTop: 10,
    marginLeft: 190,
  },
  overlay: {
    width: "90%",
    height: 500,
  },
  image: {
    height: 50,
    width: 50,
    margin: 5,
  },
  right: {
    width: "20%",
  },
  left: {
    display: "flex",
    width: "80%",
  },
  discipline: {
    fontSize: 25,
    color: "#ffffff",
    marginTop: 15,
  },
  pending: {
    fontSize: 18,
    color: "#ffffff",
  },
});

interface PlayersListProps {}
export default function PlayersList() {
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
            {user.hitMetadata!.distance.toFixed(3)} km away
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

      const getButtons = (): JSX.Element => {
        if (challenge.started) {
          return (
            <View>
              <TouchableOpacity
                onPress={() => challenges.winChallenge(challenge)}
              >
                <Image style={styles.image} source={won} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => challenges.looseChallenge(challenge, opponent)}
              >
                <Image style={styles.image} source={lost} />
              </TouchableOpacity>
            </View>
          );
        }
        if (challenge.accepted) {
          return (
            <TouchableOpacity
              onPress={() => challenges.startChallenge(challenge)}
            >
              <Image style={styles.image} source={start} />
            </TouchableOpacity>
          );
        }
        if (challenge.challengedUser.email == auth.user!.email) {
          return (
            <View>
              <TouchableOpacity
                onPress={() => challenges.acceptChallenge(challenge)}
              >
                <Image style={styles.image} source={accept} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => challenges.deleteChallenge(challenge)}
              >
                <Image style={styles.image} source={deny} />
              </TouchableOpacity>
            </View>
          );
        }
        return (
          <View>
            <Text style={styles.pending}>Pending </Text>
          </View>
        );
      };

      return (
        <View key={opponent.email + challenge.discipline} style={styles.user}>
          <View style={styles.left}>
            <Text style={styles.name}>{opponent.name}</Text>
            <Text style={styles.discipline}>{challenge.discipline}</Text>
            <Text style={styles.level}>
              Lv. {opponent[challenge.discipline.toLowerCase() + "Level"]}
            </Text>
          </View>
          <View style={styles.right}>{getButtons()}</View>
        </View>
      );
    });
    return userListItems;
  };

  return (
    <ScrollView style={styles.container}>
      {challenges.challenges.length > 0 && (
        <Text h1 style={styles.h1}>
          Ongoing Challenges
        </Text>
      )}
      {getChallenges()}
      <Text h1 style={styles.h1}>
        Nearby users
      </Text>
      <View style={styles.usersList}>{getUsers()}</View>
      {selectedUser && (
        <Overlay
          overlayStyle={styles.overlay}
          isVisible={selectedUser!.name !== ""}
          onBackdropPress={() => setSelectedUser(null)}
        >
          <PlayerStats {...selectedUser} />
        </Overlay>
      )}
    </ScrollView>
  );
}
