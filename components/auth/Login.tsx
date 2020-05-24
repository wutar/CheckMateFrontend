import React, { useContext, useState } from "react";
import { AuthContext, AuthContextProps } from "../../Contexts/AuthContext";
import { Input, Button } from "react-native-elements";
import { View, Text, TextInput } from "react-native";
import { isNull } from "ts-type-guards";

export default function Login() {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const auth: AuthContextProps = useContext(AuthContext);
  const [error, setError] = useState<string>("");

  const login = () => {
    if (password === "" || isNull(password) || email === "" || isNull(email)) {
      setError("All fields are required!");
    } else {
      setError(auth.error);
      auth.login(password, email);
    }
  };

  return (
    <>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={() => login()} />
      <Text style={{ color: "red" }}>{error}</Text>
    </>
  );
}
