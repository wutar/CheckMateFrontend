import React, { useContext } from "react";
import { LocationContext } from "../Contexts/LocationContext";
import { AuthContext, AuthContextProps } from "../Contexts/AuthContext";
import { View, Text, StyleSheet } from "react-native";
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
    fontSize: 25,
    color: "#ffffff",
  },
  level: {
    fontSize: 25,
    color: "#ffffff",
  },
  logoutButton: {
    position: "absolute",
    justifyContent: "flex-end",
    height: 20,
    bottom: 0,
  },
  discipline: {
    padding: 20,
  },
});

export default function PlayerStats(props: PlayerStatsProps) {
  const auth: AuthContextProps = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}> {props.username} </Text>
      <View style={styles.discipline}>
        <Text style={styles.level}>Go: Lv. {props.goLevel}</Text>
      </View>
      <View style={styles.discipline}>
        <Text style={styles.level}>Chess: Lv. {props.chessLevel}</Text>
      </View>
      <View style={styles.discipline}>
        <Text style={styles.level}>Checkers: Lv. {props.checkersLevel}</Text>
      </View>
      <Button
        style={styles.logoutButton}
        title="Logout"
        onPress={() => auth.logout()}
      />
    </View>
  );
}
