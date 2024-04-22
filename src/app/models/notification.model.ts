export interface Notification {
  notificationId: number;
  userId: number;
  senderId: number;
  content: string;
  isRead: boolean;
  dateCreated: Date;
  type: NotificationType;
}


export enum NotificationType {
  Message = 0,
  SwapRequest = 1
}

