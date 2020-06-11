import React, { createContext, useState, useEffect, useContext } from "react";
import * as firebase from "@react-native-firebase/app";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { AuthContext, AuthContextProps } from "./AuthContext";
import { Challenge, User } from "../base-types";

export interface ChallengesContextProps {
  acceptChallenge(challenge: Challenge): void;
  startChallenge(challenge: Challenge): void;
  denyChallenge(challenge: Challenge): void;
  createChallenge(opponent: User, discipline: string): void;
  challenges: Array<Challenge>;
}

export const ChallengesContext = createContext({} as ChallengesContextProps);

export const ChallengesProvider = (props) => {
  const auth: AuthContextProps = useContext(AuthContext);
  const [challenges, setChallenges] = useState<Array<Challenge>>([]);

  const startChallenge = (challenge: Challenge): void => {
    firestore()
      .collection("challenges")
      .doc(challenge.id)
      .update({ started: true });
  };
  const acceptChallenge = (challenge: Challenge): void => {
    firestore()
      .collection("challenges")
      .doc(challenge.id)
      .update({ accepted: true });
  };

  const denyChallenge = (challenge: Challenge): void => {
    firestore().collection("challenges").doc(challenge.id).delete();
  };

  const createChallenge = (opponent: User, discipline: string): void => {
    firestore()
      .collection("challenges")
      .add({
        challenger: auth.user,
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
    if (auth.user) {
      firestore()
        .collection("challenges")
        .where("challenger.email", "==", auth.user?.email)
        .onSnapshot((snapshot) => {
          let newArray: Array<Challenge> = [];
          snapshot.docs.forEach((doc) => {
            let challenge = doc.data() as Challenge;
            challenge.id = doc.id;
            if (
              !challenges.some(
                (c) =>
                  c.challengedUser.email === challenge.challengedUser.email &&
                  c.discipline === challenge.discipline
              )
            ) {
              newArray.push(challenge);
            }
          });
          setChallenges(newArray);
        });
      firestore()
        .collection("challenges")
        .where("challengedUser.email", "==", auth.user?.email)
        .onSnapshot((snapshot) => {
          snapshot.docs.forEach((doc) => {
            let challenge = doc.data() as Challenge;
            challenge.id = doc.id;
            if (
              !challenges.some(
                (c) =>
                  c.challenger.email === challenge.challenger.email &&
                  c.discipline === challenge.discipline
              )
            ) {
              setChallenges([...challenges, challenge]);
            }
          });
        });
    }
  }, [auth.user]);

  return (
    <ChallengesContext.Provider
      value={{
        startChallenge,
        acceptChallenge,
        denyChallenge,
        createChallenge,
        challenges,
      }}
    >
      {props.children}
    </ChallengesContext.Provider>
  );
};
