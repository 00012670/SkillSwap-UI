export interface Message {
  messageId: number;
  userId?: number;
  senderId: number;
  receiverId: number;
  messageText: string;
  timestamp: Date;
  sender?: User;
  receiver?: User;
}

export interface MessageReadDto {
  messageId: number;
  senderUsername: string;
  messageText: string;
  timestamp: Date;
}

export interface MessageDto {
  senderId: number;
  receiverId: number;
  messageText: string;
}

export interface User {
  // Include the properties of the User model here
}
