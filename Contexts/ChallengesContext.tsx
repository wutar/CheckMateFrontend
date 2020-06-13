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
  winChallenge(challenge: Challenge): void;
  looseChallenge(challenge: Challenge, opponent: User): void;
  createChallenge(opponent: User, discipline: string): void;
  challenges: Array<Challenge>;
}

export const ChallengesContext = createContext({} as ChallengesContextProps);

export const ChallengesProvider = (props) => {
  const auth: AuthContextProps = useContext(AuthContext);
  const [challenges, setChallenges] = useState<Array<Challenge>>([]);

  const addPotentialDouchebagPoint = (loser: User, winner: User): void => {
    [loser, winner].forEach((player) => {
      player.potentialDouchebagPoints += 1;
      firestore()
        .collection("users")
        .where("email", "==", player.email)
        .get()
        .then((docs) => {
          docs[0].update(player);
        });
    });
  };
  const addExpPoints = (
    loser: User,
    winner: User,
    discipline: string
  ): void => {
    const opponentLevel = loser[discipline.toLowerCase() + "Level"];
    const playerLevel = winner[discipline.toLowerCase() + "Level"];
    const gainedPoints = (opponentLevel * 100) / 7;
    const initialPoints = winner[discipline.toLowerCase() + "XP"] | 0;
    const totalPoints = initialPoints + gainedPoints;
    const newLevel = Math.cbrt(totalPoints);
    winner[discipline.toLowerCase() + "XP"] = totalPoints;
    winner[discipline.toLowerCase() + "Level"] = newLevel;
    firestore()
      .collection("users")
      .where("email", "==", winner.email)
      .get()
      .then((snapshot) => {
        const ref = snapshot.docs[0];
        firestore().collection("users").doc(ref.id).update(winner);
      });
  };

  const winChallenge = (challenge: Challenge): void => {
    const opponent =
      challenge.challengedUser.email == auth.user!.email
        ? challenge.challenger
        : challenge.challengedUser;
    if (!challenge.winnerEmail) {
      firestore()
        .collection("challenges")
        .doc(challenge.id)
        .update({ winnerEmail: auth.user!.email });
    } else if (challenge.winnerEmail === auth.user!.email) {
      addExpPoints(opponent, auth.user!, challenge.discipline);
    } else {
      addPotentialDouchebagPoint(auth.user!, opponent);
    }
  };

  const looseChallenge = (challenge: Challenge, opponent: User): void => {
    if (!challenge.winnerEmail) {
      firestore()
        .collection("challenges")
        .doc(challenge.id)
        .update({ winnerEmail: opponent.email });
    } else if (challenge.winnerEmail === opponent.email) {
      addExpPoints(auth.user!, opponent, challenge.discipline);
    } else {
      addPotentialDouchebagPoint(opponent, auth.user!);
    }
  };
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
        winChallenge,
        looseChallenge,
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
