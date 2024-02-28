export interface User {
  userId: number;
  username: string;
  // ... other properties ...
}

export interface Skill {
  skillId: number;
  name: string;
  // ... other properties ...
}

export interface Review {
  reviewId: number;
  fromUserId: number;
  toUserId: number;
  skillId: number;
  requestId: number;
  rating: number;
  text: string;
}
