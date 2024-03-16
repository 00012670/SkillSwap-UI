export interface User {
  userId: number;
  username: string;
}

export interface Skill {
  skillId: number;
  name: string;
}

export interface Review {
  reviewId: number;
  fromUserId: User;
  fromUserName: string; 
  toUserId: number;
  skillId: number;
  requestId: number;
  rating: number;
  text: string;
}
