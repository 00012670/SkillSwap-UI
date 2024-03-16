export interface User {
  userId: number;
  username: string;
}

export interface Skill {
  skillId: number;
  name: string;
}

export interface CreateSwapRequest {
  requestId: number;
  initiatorId: number;
  receiverId: number;
  skillOfferedId: number;
  skillRequestedId: number;
  statusRequest: Status;
  details: string;
}


export interface GetSwapRequest {
status: any;
  requestId: number;
  initiatorId: number;
  initiatorName: string;
  receiverId: number;
  receiverName: string;
  skillOfferedId: number;
  skillOfferedName: string;
  skillRequestedId: number;
  skillRequestedName: string;
  statusRequest: Status;
  details: string;
}



export enum Status {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Invalid = 3,
}

export interface UpdateSwapRequest {
  statusRequest: Status;
}
