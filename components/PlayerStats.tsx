import React, { useContext } from "react";
import { LocationContext } from "../Contexts/LocationContext";
import { AuthContext, AuthContextProps } from "../Contexts/AuthContext";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";

interface PlayerStatsProps {
  username: string;
  goLevel: number;
  checkersLevel: number;
  chessLevel: number;
}
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
    position: "absolute",
    justifyContent: "flex-end",
    height: 20,
    bottom: 0,
  },
  discipline: {
    display: "flex",
    flexDirection: "row",
    padding: 20,
  },
  challengeButton: {
    display: "flex",
    backgroundColor: "white",
    height: 50,
  },
  challengeButtonText: {
    marginTop: 7,
    fontSize: 25,
  },
  left: {
    display: "flex",
    width: "50%",
  },
});

function Discipline(props: {
  name: string;
  level: number;
  onChallenge: () => void;
}): JSX.Element {
  return (
    <View style={styles.discipline}>
      <View style={styles.left}>
        <Text style={styles.disciplineName}>{props.name}</Text>
        <Text style={styles.level}>Lv. {props.level}</Text>
      </View>

      <TouchableOpacity
        style={styles.challengeButton}
        onPress={() => props.onChallenge()}
      >
        <Text style={styles.challengeButtonText}>Challenge </Text>
      </TouchableOpacity>
    </View>
  );
}
export default function PlayerStats(props: PlayerStatsProps) {
  const auth: AuthContextProps = useContext(AuthContext);
  const isLoggedInUser = (): boolean => {
    return props.username == auth.user?.displayName;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}> {props.username} </Text>
      <Discipline name="Go" level={0} onChallenge={() => alert("Challenge")} />
      <Discipline
        name="Chess"
        level={0}
        onChallenge={() => alert("Challenge")}
      />
      <Discipline
        name="Checkers"
        level={0}
        onChallenge={() => alert("Challenge")}
      />

      {isLoggedInUser() && (
        <Button
          style={styles.logoutButton}
          title="Logout"
          onPress={() => auth.logout()}
        />
      )}
    </View>
  );
}
