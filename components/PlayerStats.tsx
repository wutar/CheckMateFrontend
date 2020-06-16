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
    marginTop: 12,
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
    marginTop: 20,
    display: "flex",
    backgroundColor: "#23F5A0",
    height: 50,
    padding: 5,
    paddingBottom: 15,
  },
  challengeButtonText: {
    color: "white",
    marginTop: 7,
    fontSize: 25,
  },
  PDP: {
    marginLeft: 20,
    marginTop: 12,
    fontSize: 18,
    color: "#F85858",
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
  XP: {
    alignSelf: "flex-end",
    marginRight: 80,
    marginTop: 15,
    fontSize: 18,
    color: "#ffffff",
  },
});

function Discipline(props: {
  name: string;
  XP: number;
  level: number;
  onChallenge: () => void;
  isLoggedInUser: boolean;
  infoLink: string;
}): JSX.Element {
  const nextLevel = props.level + 1;
  const minXPNextLevel = Math.pow(nextLevel, 3);
  const minXPCurrentLevel = Math.pow(props.level, 3);
  const XPGainedCurrentLevel = props.XP - minXPCurrentLevel;

  const neededXPCurrentLevel = minXPNextLevel - minXPCurrentLevel;

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
        <View>
          <TouchableOpacity onPress={() => Linking.openURL(props.infoLink)}>
            <Image style={styles.infoButton} source={info} />
          </TouchableOpacity>
          <Text style={styles.XP}>
            {XPGainedCurrentLevel}/{neededXPCurrentLevel} XP
          </Text>
        </View>
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
        level={props.goLevel}
        XP={props.checkersXP}
        onChallenge={() => challenges.createChallenge(props, "Go")}
      />
      <Discipline
        infoLink="https://www.chess.com/learn-how-to-play-chess"
        isLoggedInUser={isLoggedInUser()}
        name="Chess"
        level={props.chessLevel}
        XP={props.checkersXP}
        onChallenge={() => challenges.createChallenge(props, "Chess")}
      />
      <Discipline
        infoLink="https://www.filiphofer.com/en/american-checkers-rules/"
        isLoggedInUser={isLoggedInUser()}
        name="Checkers"
        level={props.checkersLevel}
        XP={props.checkersXP}
        onChallenge={() => challenges.createChallenge(props, "Checkers")}
      />
      <Text style={styles.PDP}>PDP: {props.potentialDouchebagPoints}</Text>

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
