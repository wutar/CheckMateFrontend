import { ListView, FlatList, Text } from "react-native";
import { LocationContext } from "../Contexts/LocationContext";
import React, { useContext } from "react";

export default function PlayersList() {
  const location = useContext(LocationContext);
  const getUsers = (): Array<JSX.Element> => {
    const userListItems = location.nearUsers.map((user) => {
      return (
        <Text key={user.name}>
          {user.name} {user.hitMetadata.distance}{" "}
        </Text>
      );
    });
    return userListItems;
  };
  return <>{getUsers()}</>;
}
