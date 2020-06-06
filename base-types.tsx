export interface Challenge {
  discipline: string;
  challenger: User;
  challengedUser: User;
  accepted: boolean;
  started: boolean;
}

export interface HitMetaData {
  distance: number;
  bearing: number;
}

export interface GeoPoint {
  longitude: number;
  latitude: number;
}
export interface Position {
  geohash: string;
  geopoint: GeoPoint;
}
export interface User {
  email: string;
  goLevel: number;
  chessLevel: number;
  checkersLevel: number;
  hitMetadata?: HitMetaData;
  name: string;
  position?: Position;
}

export interface Hotspot {
  hitMetaData: object;
  id: number;
  position: Position;
}
