import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { ProfileService } from 'src/app/services/profile.service';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, forkJoin, map, switchMap, startWith } from 'rxjs';
import { of } from 'rxjs';
import { MessageDto, MessageReadDto, MessageReadDtoWithSafeUrl } from 'src/app/models/message.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import emojiRegex from 'emoji-regex';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

  @ViewChild('messageInput') messageInput: ElementRef | undefined;
  @ViewChild('messageContainer') messageContainer: ElementRef | undefined;

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
  editingMessage: MessageReadDtoWithSafeUrl | null = null;
  unreadMessagesSubscription: Subscription | undefined;
  showEmojiPicker = false;
  searchText: any;

  constructor(
    private profileService: ProfileService,
    private imageService: ImageService,
    private authService: AuthService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private searchService: SearchService
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
        this.chatService.getUnreadMessageCount(profile.userId, this.authenticatedUser?.userId ?? 0).subscribe(count => {
          profile.unreadMessageCount = count;
          this.cdr.detectChanges();
        });
      });
      this.selectUserFromRouteParams();
    });

    this.route.paramMap.subscribe(() => {
      this.selectUserFromRouteParams();
    });

    this.searchService.currentSearchText.subscribe(searchText => this.searchText = searchText);
  }



  selectUserFromRouteParams() {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    const user = this.profiles.find(profile => profile.userId === userId);
    if (user) {
      this.selectUser(user);
    }
  }

  selectUser(user: Profile) {
    this.selectedUser = user;
    this.messages = [];
    this.loadMessages(user);
    this.messageInput?.nativeElement.focus();
    this.chatService.markMessagesAsRead(user.userId, this.authenticatedUser?.userId ?? 0).subscribe(() => {
      user.unreadMessageCount = 0;
    });
  }

  getImageByUserId(userId: number): Observable<SafeUrl | undefined> {
    if (!this.isImageDeleted) {
      return this.imageService.getImageByUserId(userId).pipe(
        map((response: ArrayBuffer) => {
          const blob = new Blob([response], { type: 'image/jpeg' });
          const blobUrl = URL.createObjectURL(blob);
          return this.sanitizer.bypassSecurityTrustUrl(blobUrl);
        })
      );
    }
    return of(undefined);
  }

  loadMessages(user: Profile) {
    const senderId = this.authService.getUserId();
    if (senderId === null) {
      return;
    }

    this.chatService.getMessages(senderId, user.userId).subscribe((messages: MessageReadDto[]) => {
      const imageRequests: Observable<MessageReadDtoWithSafeUrl>[] = messages.map(message => {
        return this.loadMessageImage(message);
      });

      forkJoin(imageRequests).subscribe((messagesWithImages: MessageReadDtoWithSafeUrl[]) => {
        this.messages = messagesWithImages;
        this.scrollToBottom();
        this.cdr.detectChanges();
        this.scrollToBottom();
      });
    });
  }

  loadMessageImage(message: MessageReadDto): Observable<MessageReadDtoWithSafeUrl> {
    if (!message.senderId) {
      return of({ ...message, senderImageSafeUrl: undefined });
    }

    return this.profileService.getProfileById(message.senderId).pipe(
      switchMap(profile => {
        if (profile.hasImage) {
          return this.imageService.getImageByUserId(profile.userId).pipe(
            map(imageData => ({
              ...message,
              senderImageSafeUrl: this.byteArrayToSafeUrl(imageData)
            }))
          );
        } else {
          return of({ ...message, senderImageSafeUrl: undefined });
        }
      })
    );
  }

  sendMessage() {
    if (!this.newMessage.trim()) {
      return;
    }
    if (this.editingMessage) {
      this.updateMessage(this.editingMessage.messageId, this.newMessage);
    } else {
      this.sendNewMessage();
    }
  }

  sendNewMessage() {
    const messageDto: MessageDto = {
      senderId: this.authenticatedUser!.userId,
      receiverId: this.selectedUser!.userId,
      messageText: this.newMessage,
      imageId: 0
    };

    this.chatService.sendMessage(messageDto).subscribe(() => {
      this.newMessage = '';
      this.loadMessages(this.selectedUser!);
    });
  }

  updateMessage(id: number, newMessageText: string) {
    const messageDto: MessageDto = {
      senderId: this.authenticatedUser!.userId,
      receiverId: this.selectedUser!.userId,
      messageText: newMessageText,
      imageId: 0
    };

    this.chatService.updateMessage(id, messageDto).subscribe(() => {
      this.editingMessage = null;
      this.newMessage = '';
      this.loadMessages(this.selectedUser!);
    }, error => {
      console.error('Error updating message:', error);
    });
  }

  deleteMessage(id: number) {
    this.chatService.deleteMessage(id).subscribe(() => {
      this.messages = this.messages.filter(message => message.messageId !== id);
    }, error => {
      console.error('Error deleting message:', error);
    });
  }

  startEditingMessage(message: MessageReadDtoWithSafeUrl) {
    this.editingMessage = message;
    this.newMessage = message.messageText;
    this.messageInput?.nativeElement.focus();
  }

  scrollToBottom() {
    if (this.messageContainer) {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }
  }

  byteArrayToSafeUrl(byteArray: ArrayBuffer): SafeUrl {
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const blobUrl = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustUrl(blobUrl);
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: { emoji: { native: any; }; }) {
    const text = `${this.newMessage}${event.emoji.native}`;
    this.newMessage = text;
    this.showEmojiPicker = false;
    setTimeout(() => this.messageInput?.nativeElement.focus(), 0);
  }

  isEmoji(str: string) {
    const regex = emojiRegex();
    return regex.test(str);
  }


  sendEmoji() {
    const messageDto: MessageDto = {
      senderId: this.authenticatedUser!.userId,
      receiverId: this.selectedUser!.userId,
      messageText: this.newMessage,
      imageId: 0
    };

    this.chatService.sendMessage(messageDto).subscribe(() => {
      this.newMessage = '';
      this.loadMessages(this.selectedUser!);
    });
  }

  onEnter(event: Event) {
    event.preventDefault();
    if (this.isEmoji(this.newMessage)) {
      if (this.editingMessage) {
        this.updateMessage(this.editingMessage.messageId, this.newMessage);
      } else {
        this.sendEmoji();
      }
    } else {
      this.sendMessage();
    }
  }
}
