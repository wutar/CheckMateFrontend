import { firestore } from "firebase";

export interface Challenge {
  id?: string;
  winnerEmail?: string;
  discipline: string;
  challenger: User;
  challengedUser: User;
  accepted: boolean;
  started: boolean;
  endedEmail?: string;
  endedTime?: number;
}

export interface HitMetaData {
  distance: number;
  bearing: number;
}

export interface GeoPoint {
  longitude: number;
  latitude: number;
  Rc?: number;
  wc?: number;
}

export interface Position {
  geohash: string;
  geopoint: GeoPoint;
}

export interface User {
  email: string;
  potentialDouchebagPoints: number;
  goXP: number;
  chessXP: number;
  checkersXP: number;
  goLevel: number;
  chessLevel: number;
  checkersLevel: number;
  hitMetadata?: HitMetaData;
  name: string;
  location?: Position;
}

export interface Hotspot {
  hitMetaData: object;
  id: number;
  position: Position;
}

const updateUserTable = (user: User): void => {
  firestore()
    .collection("users")
    .where("email", "==", user?.email)
    .get()
    .then((snapshot) => {
      const ref = snapshot.docs[0];
      firestore().collection("users").doc(ref.id).update(user);
    });
};

const updateChallenger = (user: User): void => {
  firestore()
    .collection("challenges")
    .where("challenger.email", "==", user?.email)
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        doc.ref?.update({ challenger: user! });
      });
    });
};

const updateChallengedUser = (user: User): void => {
  firestore()
    .collection("challenges")
    .where("challengedUser.email", "==", user?.email)
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        doc.ref?.update({ challengedUser: user! });
      });
    });
};

export function update(user: User) {
  updateUserTable(user);
  updateChallenger(user);
  updateChallengedUser(user);
}
