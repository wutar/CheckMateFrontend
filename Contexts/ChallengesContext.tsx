import React, { createContext, useState, useEffect, useContext } from "react";
import * as firebase from "@react-native-firebase/app";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { AuthContext, AuthContextProps } from "./AuthContext";
import { Challenge } from "../base-types";

export interface ChallengesContextProps {
  acceptChallenge(id: string): void;
  denyChallenge(id: string): void;
  createChallenge(opponent: string, discipline: string): void;
  challenges: Array<Challenge>;
}

export const ChallengesContext = createContext({} as ChallengesContextProps);

export const ChallengesProvider = (props) => {
  const auth: AuthContextProps = useContext(AuthContext);
  const [challenges, setChallenges] = useState<Array<Challenge>>([]);

  const acceptChallenge = (id: string): void => {
    firestore().collection("challenges").doc(id).update({ accepted: true });
  };

  const denyChallenge = (id: string): void => {
    firestore().collection("challenges").doc(id).delete();
  };

  const createChallenge = (opponent: string, discipline: string): void => {
    firestore()
      .collection("challenges")
      .add({
        challenger: auth.user?.email,
        challengedUser: opponent,
        discipline: discipline,
        accepted: false,
        started: false,
      })
      .then(() => {
        console.log("User added!");
      });
  };
  useEffect(() => {
    if (auth.user !== null) {
      firestore()
        .collection("challenges")
        .where("challenger", "==", auth.user?.email)
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            const challenge = doc.data() as Challenge;
            setChallenges([...challenges, challenge]);
          });
        });
      /* firestore()
        .collection("challenges")
        .where("challengedUser", "==", auth.user?.email)
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            setChallenges([...challenges, (doc.data as unknown) as Challenge]);
          });
        });*/
    }
  }, [auth.user]);

  return (
    <ChallengesContext.Provider
      value={{ acceptChallenge, denyChallenge, createChallenge, challenges }}
    >
      {props.children}
    </ChallengesContext.Provider>
  );
};
