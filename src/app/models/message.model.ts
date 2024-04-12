import { SafeUrl } from "@angular/platform-browser";

export interface Message {
  messageId: number;
  userId?: number;
  senderId: number;
  receiverId: number;
  messageText: string;
  timestamp: Date;
  sender?: User;
  receiver?: User;
  isEdited?: boolean;
}

export interface MessageReadDto {
  messageId: number;
  senderId: number;
  senderUsername: string;
  imageId: number;
  messageText: string;
  timestamp: Date;
  receiverId: number;
  isEdited?: boolean;
}

export interface MessageDto {
  senderId: number;
  imageId: number;
  receiverId: number;
  messageText: string;
  isEdited?: boolean;
}

export interface MessageReadDtoWithSafeUrl extends MessageReadDto {
  senderImageSafeUrl?: SafeUrl; // Add this line
}

export interface User {
  // Include the properties of the User model here
}
