import React, { useContext, useState } from "react";
import { AuthContext, AuthContextProps } from "../../Contexts/AuthContext";
import { Input, Button } from "react-native-elements";
import { View, Text } from "react-native";
import Login from "./Login";
import Register from "./Register";

export default function AuthorizationApp() {
  const auth: AuthContextProps = useContext(AuthContext);
  const [registered, setRegistered] = useState(true);

  if (registered) {
    return (
      <View>
        <Login />
        <Text style={{ color: "blue" }} onPress={() => setRegistered(false)}>
          Don't have an account?
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Register />
      <Text style={{ color: "blue" }} onPress={() => setRegistered(true)}>
        Already have an account?
      </Text>
    </View>
  );
}
