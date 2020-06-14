import React, { createContext, useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { AuthContext, AuthContextProps } from "./AuthContext";
import { Challenge, User } from "../base-types";

export interface ChallengesContextProps {
  acceptChallenge(challenge: Challenge): void;
  startChallenge(challenge: Challenge): void;
  deleteChallenge(challenge: Challenge): void;
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
        .then((snapshot) => {
          const ref = snapshot.docs[0];
          firestore().collection("users").doc(ref.id).update(player);
        });
    });
  };
  const addExpPoints = (
    loser: User,
    winner: User,
    discipline: string
  ): void => {
    const opponentLevel = loser[discipline.toLowerCase() + "Level"];
    const gainedPoints = (opponentLevel * 100) / 7;
    const initialPoints = winner[discipline.toLowerCase() + "XP"] | 0;
    const totalPoints = initialPoints + gainedPoints;
    const newLevel = Math.cbrt(totalPoints);
    winner[discipline.toLowerCase() + "XP"] = totalPoints.toFixed(0);
    winner[discipline.toLowerCase() + "Level"] = newLevel.toFixed(0);
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
    deleteChallenge(challenge);
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
    deleteChallenge(challenge);
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

  const deleteChallenge = (challenge: Challenge): void => {
    firestore().collection("challenges").doc(challenge.id).delete();
  };

  const replace = (challenge: Challenge): void => {
    firestore().collection("challenges").doc(challenge.id).update(challenge);
  };

  const subscribeToUsers = (challenge: Challenge): void => {
    firestore()
      .collection("users")
      .where("email", "==", challenge.challenger.email)
      .onSnapshot((snapshot) => {
        challenge.challenger = snapshot.docs[0].data() as User;
        replace(challenge);
      });
    firestore()
      .collection("users")
      .where("email", "==", challenge.challengedUser.email)
      .onSnapshot((snapshot) => {
        challenge.challengedUser = snapshot.docs[0].data() as User;
        replace(challenge);
      });
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
        console.log("Challenge added!");
      });
  };

  let newArray: Array<Challenge> = [];

  useEffect(() => {
    if (auth.user) {
      firestore()
        .collection("challenges")
        .where("challenger.email", "==", auth.user?.email)
        .onSnapshot((snapshot) => {
          newArray = [
            ...newArray.filter(
              (c) => c.challengedUser.email == auth.user!.email
            ),
          ];
          snapshot.docs.forEach((doc) => {
            let challenge = doc.data() as Challenge;
            challenge.id = doc.id;
            //subscribeToUsers(challenge);
            newArray.push(challenge);
          });
          setChallenges(newArray);
        });
      firestore()
        .collection("challenges")
        .where("challengedUser.email", "==", auth.user?.email)
        .onSnapshot((snapshot) => {
          newArray = [
            ...newArray.filter((c) => c.challenger.email == auth.user!.email),
          ];
          snapshot.docs.forEach((doc) => {
            let challenge = doc.data() as Challenge;
            challenge.id = doc.id;
            //subscribeToUsers(challenge);
            newArray.push(challenge);
          });
          setChallenges(newArray);
        });
      newArray.forEach((c) => {
        subscribeToUsers(c);
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
        deleteChallenge: deleteChallenge,
        createChallenge,
        challenges,
      }}
    >
      {props.children}
    </ChallengesContext.Provider>
  );
};
