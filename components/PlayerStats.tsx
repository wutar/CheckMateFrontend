import React, { useContext } from "react";
import { AuthContext, AuthContextProps } from "../Contexts/AuthContext";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import {
  ChallengesContextProps,
  ChallengesContext,
} from "../Contexts/ChallengesContext";
import { User } from "../base-types";
const info = require("./img/info.png");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
  },
  h1: {
    fontSize: 30,
    color: "#ffffff",
    marginBottom: 20,
    marginTop: 20,
    marginLeft: "auto",
    marginRight: "auto",
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
    fontSize: 30,
    color: "#ffffff",
  },
  disciplineName: {
    fontSize: 25,
    color: "#ffffff",
  },
  level: {
    fontSize: 18,
    color: "#ffffff",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#23F5A0",
    justifyContent: "flex-end",
    marginTop: 60,
    height: 50,

    alignItems: "center",
    alignContent: "center",
    width: "100%",
  },
  logoutButtonText: {
    flex: 1,
    color: "white",
    textAlign: "center",
    width: 50,
    marginHorizontal: "auto",
    textTransform: "uppercase",
    fontSize: 23,
    alignSelf: "center",
  },
  discipline: {
    display: "flex",
    flexDirection: "row",
    padding: 20,
  },
  challengeButton: {
    display: "flex",
    backgroundColor: "#23F5A0",
    height: 50,
  },
  challengeButtonText: {
    color: "white",
    marginTop: 7,
    fontSize: 25,
  },
  left: {
    display: "flex",
    width: "50%",
  },
  infoButton: {
    marginLeft: "50%",
    top: 10,
    width: 35,
    height: 35,
  },
});

function Discipline(props: {
  name: string;
  level: number;
  onChallenge: () => void;
  isLoggedInUser: boolean;
  infoLink: string;
}): JSX.Element {
  return (
    <View style={styles.discipline}>
      <View style={styles.left}>
        <Text style={styles.disciplineName}>{props.name}</Text>
        <Text style={styles.level}>Lv. {props.level}</Text>
      </View>
      {!props.isLoggedInUser ? (
        <TouchableOpacity
          style={styles.challengeButton}
          onPress={() => props.onChallenge()}
        >
          <Text style={styles.challengeButtonText}>Challenge </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => Linking.openURL(props.infoLink)}>
          <Image style={styles.infoButton} source={info} />
        </TouchableOpacity>
      )}
    </View>
  );
}
export default function PlayerStats(props: User) {
  const auth: AuthContextProps = useContext(AuthContext);
  const challenges: ChallengesContextProps = useContext(ChallengesContext);
  const isLoggedInUser = (): boolean => {
    return props.name == auth.user?.name;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}> {props.name} </Text>
      <Discipline
        infoLink="https://www.britgo.org/intro/intro2.html"
        isLoggedInUser={isLoggedInUser()}
        name="Go"
        level={0}
        onChallenge={() => challenges.createChallenge(props, "Go")}
      />
      <Discipline
        infoLink="https://www.chess.com/learn-how-to-play-chess"
        isLoggedInUser={isLoggedInUser()}
        name="Chess"
        level={0}
        onChallenge={() => challenges.createChallenge(props, "Chess")}
      />
      <Discipline
        infoLink="https://www.filiphofer.com/en/american-checkers-rules/"
        isLoggedInUser={isLoggedInUser()}
        name="Checkers"
        level={0}
        onChallenge={() => challenges.createChallenge(props, "Checkers")}
      />

      {isLoggedInUser() && (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => auth.logout()}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
