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

export interface SwapRequest {
  requestId: number;
  initiatorId: number;
  receiverId: number;
  skillOfferedId: number;
  skillRequestedId: number;
  statusRequest: Status;
  details: string;
}


export enum Status {
  Pending,
  Accepted,
  Rejected,
  Invalid
}
