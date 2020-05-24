import React, { useContext, useState } from "react";
import { AuthContext, AuthContextProps } from "../../Contexts/AuthContext";
import { Input, Button } from "react-native-elements";
import { View, Text, TextInput } from "react-native";
import { isNull } from "ts-type-guards";

const styles = {
  view: {
    marginTop: 200,
    padding: 10,
    backgroundColor: "white",
    height: 250,
    borderRadius: 5,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  button: {
    marginTop: 5,
  },
};
export default function Register() {
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const auth: AuthContextProps = useContext(AuthContext);
  const [error, setError] = useState("");

  const register = () => {
    if (password === "" || isNull(password) || email === "" || isNull(email)) {
      setError("All fields are required!");
    } else {
      if (password === passwordConfirmation) {
        setError(auth.error);
        auth.register(password, email);
      } else {
        setError("Passwords don't match. Did you mistype?");
      }
    }
  };

  return (
    <View style={styles.view}>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm Password"
        value={passwordConfirmation}
        secureTextEntry
        onChangeText={(text) => setPasswordConfirmation(text)}
        style={styles.input}
      />
      <Button color="#fffff" title="Register" onPress={() => register()} />
      <Text style={{ color: "red" }}>{error}</Text>
    </View>
  );
}
