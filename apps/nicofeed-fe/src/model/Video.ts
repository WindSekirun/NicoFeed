import { Follower } from './Followers';

export interface Video {
  id: number;
  userid: number;
  videoTitle: string;
  videoLink: string;
  videoPubDate: string;
  videoThumbnail: string;
  uploaderUserId: string;
  follower: Follower;
}
