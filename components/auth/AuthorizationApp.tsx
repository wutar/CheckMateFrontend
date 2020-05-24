import React, { useContext, useState } from "react";
import { AuthContext, AuthContextProps } from "../../Contexts/AuthContext";
import { Input, Button } from "react-native-elements";
import { View, Text } from "react-native";
import Login from "./Login";
import Register from "./Register";
import LinearGradient from "react-native-linear-gradient";

const styles = {
  view: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
};
export default function AuthorizationApp() {
  const auth: AuthContextProps = useContext(AuthContext);
  const [registered, setRegistered] = useState(true);

  if (registered) {
    return (
      <View style={styles.view}>
        <LinearGradient
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          colors={["#93a4c3", "#1d233e"]}
          style={styles.gradient}
        >
          <Login />
          <Text
            style={{ color: "white", textDecorationLine: "underline" }}
            onPress={() => setRegistered(false)}
          >
            Don't have an account?
          </Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.view}>
      <LinearGradient
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        colors={["#93a4c3", "#1d233e"]}
        style={styles.gradient}
      >
        <Register />
        <Text
          style={{ color: "white", textDecorationLine: "underline" }}
          onPress={() => setRegistered(true)}
        >
          Already have an account?
        </Text>
      </LinearGradient>
    </View>
  );
}
