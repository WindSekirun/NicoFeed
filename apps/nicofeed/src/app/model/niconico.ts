export interface NicoNicoRoot {
  meta: Meta;
  data: Data;
}

export interface Meta {
  status: number;
}

export interface Data {
  items: Item[];
  summary: Summary;
}

export interface Item {
  type: string;
  relationships: Relationships;
  isPremium: boolean;
  description: string;
  strippedDescription: string;
  shortDescription: string;
  id: number;
  nickname: string;
  icons: Icons;
}

export interface Relationships {
  sessionUser: SessionUser;
}

export interface SessionUser {
  isFollowing: boolean;
}

export interface Icons {
  small: string;
  large: string;
}

export interface Summary {
  followees: number;
  followers: number;
  hasNext: boolean;
  cursor: string;
}
