import { Component } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { ProfileService } from 'src/app/services/profile.service';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, catchError, map } from 'rxjs';
import { of } from 'rxjs';
import { MessageReadDto } from 'src/app/models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent {

  authenticatedUser: Profile | null = null;
  isImageDeleted: boolean = false;
  profileDetails: any;
  imageUrl: SafeUrl | undefined;
  profiles: Profile[] = [];
  messages: MessageReadDto[] = [];
  selectedUser: Profile | null = null;
  newMessage = '';

  constructor(
    private profileService: ProfileService,
    private imageService: ImageService,
    private chatService: ChatService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.authenticatedUser = this.authService.getUserFromToken(); // Assign authenticated user
    this.profileService.getAllProfiles().subscribe(profiles => {
        this.profiles = profiles;
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

  sendMessage() {
    console.log('sendMessage called'); // Log when function is called
    console.log('newMessage:', this.newMessage); // Log newMessage
    console.log('selectedUser:', this.selectedUser); // Log selectedUser
    console.log('authenticatedUser:', this.authenticatedUser); // Log authenticatedUser
    if (this.newMessage.trim() !== '' && this.selectedUser && this.authenticatedUser) {
        const senderId = this.authService.getUserId();
        if (senderId !== null) {
            const imageUrl = this.authenticatedUser.imageUrl ? this.authenticatedUser.imageUrl.toString() : '';
            this.chatService.sendMessage(senderId, this.selectedUser.userId, this.newMessage, imageUrl).subscribe(() => {
                console.log('Message sent successfully'); // Log message
                if (this.selectedUser) {
                    this.loadMessages(this.selectedUser);
                }
                this.newMessage = '';
            }, error => {
                console.error('Error sending message:', error); // Log error
            }, () => {
                console.log('sendMessage Observable completed'); // Log when Observable completes
            });
        }
    }
}





  loadMessages(user: Profile) {
    const senderId = this.authService.getUserId();
    if (senderId !== null) {
      this.chatService.getMessages(senderId, user.userId).subscribe((messages: MessageReadDto[]) => {
        this.messages = messages;
      });
    }
  }

  getImageByUserId(userId: number): Observable<SafeUrl> {
    if (userId === undefined) {
      console.error('userId is undefined');
      return of(this.sanitizer.bypassSecurityTrustUrl('https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'));
    }

    return this.imageService.getImageByUserId(userId).pipe(
      map((response: ArrayBuffer) => {
        const blob = new Blob([response], { type: 'image/jpeg' });
        const blobUrl = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustUrl(blobUrl);
      }),
      catchError(error => {
        console.error(error);
        return of(this.sanitizer.bypassSecurityTrustUrl('https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'));
      })
    );
  }
}
