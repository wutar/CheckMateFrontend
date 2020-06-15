export interface Challenge {
  id?: string;
  winnerEmail?: string;
  discipline: string;
  challenger: User;
  challengedUser: User;
  accepted: boolean;
  started: boolean;
  endedEmail: string;
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
