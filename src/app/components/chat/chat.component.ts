import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { ProfileService } from 'src/app/services/profile.service';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, catchError, forkJoin, map, switchMap } from 'rxjs';
import { of } from 'rxjs';
import { MessageDto, MessageReadDto, MessageReadDtoWithSafeUrl } from 'src/app/models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

  authenticatedUser: Profile | null = null;
  isImageDeleted: boolean = false;
  profileDetails: any;
  imageUrl: SafeUrl | undefined;
  profiles: Profile[] = [];
  imageArray: Uint8Array | undefined;
  senderImageSafeUrl: SafeUrl | undefined;
  selectedUser: Profile | null = null;
  newMessage = '';
  messages: MessageReadDtoWithSafeUrl[] = [];


  constructor(
    private profileService: ProfileService,
    private imageService: ImageService,
    private chatService: ChatService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.authenticatedUser = this.authService.getUserFromToken();

    this.profileService.getAllProfiles().subscribe(profiles => {
      this.profiles = profiles.filter(profile => profile.userId !== this.authenticatedUser?.userId);
      this.profiles.forEach(profile => {
        if (profile.hasImage) {
          this.getImageByUserId(profile.userId).subscribe(imageUrl => {
            profile.imageUrl = imageUrl;
          });
        }
      });
    });
  }



  selectUser(user: Profile) {
    this.selectedUser = user;
    this.loadMessages(user);
  }

  getImageByUserId(userId: number): Observable<SafeUrl> {
    return new Observable<SafeUrl>(observer => {
        if (!this.isImageDeleted) {
            this.imageService.getImageByUserId(userId).subscribe(
                (response: ArrayBuffer) => {
                    const blob = new Blob([response], { type: 'image/jpeg' });
                    const blobUrl = URL.createObjectURL(blob);
                    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
                    observer.next(safeUrl);
                    observer.complete();

                    // Convert Blob to Uint8Array
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        this.imageArray = new Uint8Array(reader.result as ArrayBuffer);
                    };
                    reader.readAsArrayBuffer(blob);
                }
            );
        }
        else {
            observer.next(undefined);
            observer.complete();
        }
    });
}

sendMessage() {
  const messageDto: MessageDto = {
    senderId: this.authenticatedUser?.userId ?? 0,
    receiverId: this.selectedUser?.userId ?? 0,
    messageText: this.newMessage,
    imageId: 0
  };

  this.chatService.sendMessage(messageDto).subscribe(() => {
    console.log('Message sent successfully');
    // Clear the newMessage field
    this.newMessage = '';
    // Reload the messages
    if (this.selectedUser) {
      this.loadMessages(this.selectedUser);
    }
  }, error => {
    console.error('Error sending message:', error);
    // ...
  });
}


loadMessages(user: Profile) {
  const senderId = this.authService.getUserId();
  if (senderId !== null) {
    this.chatService.getMessages(senderId, user.userId).subscribe((messages: MessageReadDto[]) => {
      const imageRequests = messages.map(message => {
        if (message.senderId) {
          return this.profileService.getProfileById(message.senderId).pipe(
            switchMap(profile => {
              if (profile.hasImage) {
                return this.imageService.getImageByUserId(profile.userId);
              } else {
                return of(undefined);
              }
            }),
            map(imageData => ({
              ...message,
              senderImageSafeUrl: imageData ? this.byteArrayToSafeUrl(imageData) : undefined
            }))
          );
        } else {
          return of({
            ...message,
            senderImageSafeUrl: undefined
          });
        }
      });

      forkJoin(imageRequests).subscribe((messagesWithImages: MessageReadDtoWithSafeUrl[]) => {
        this.messages = messagesWithImages;
      });
    });
  }
}


  byteArrayToSafeUrl(byteArray: ArrayBuffer): SafeUrl {
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const blobUrl = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustUrl(blobUrl);
  }

  updateMessage(id: number, newMessageText: string) {
    const messageDto: MessageDto = {
      senderId: this.authenticatedUser?.userId ?? 0,
      receiverId: this.selectedUser?.userId ?? 0,
      messageText: newMessageText,
      imageId: 0
    };

    this.chatService.updateMessage(id, messageDto).subscribe(() => {
      console.log('Message updated successfully');
      // Reload the messages
      if (this.selectedUser) {
        this.loadMessages(this.selectedUser);
      }
    }, error => {
      console.error('Error updating message:', error);
      // ...
    });
  }

  deleteMessage(id: number) {
    this.chatService.deleteMessage(id).subscribe(() => {
      // Reload the messages
      if (this.selectedUser) {
        this.loadMessages(this.selectedUser);
      }
    }, error => {
      console.error('Error deleting message:', error);
      // ...
    });
  }



}
