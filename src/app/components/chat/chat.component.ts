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
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

  @ViewChild('messageInput') messageInput: ElementRef | undefined;
  @ViewChild('messageContainer') messageContainer: ElementRef | undefined;

  authenticatedUser: Profile | null = null; // Current authenticated user profile
  isImageDeleted: boolean = false; // Flag to indicate if image is deleted
  profileDetails: any; // Profile details
  imageUrl: SafeUrl | undefined; // Safe URL for image
  profiles: Profile[] = []; // Array of profiles
  imageArray: Uint8Array | undefined; // Image array
  senderImageSafeUrl: SafeUrl | undefined; // Safe URL for sender image
  selectedUser: Profile | null = null; // Currently selected user profile
  newMessage = ''; // New message text
  messages: MessageReadDtoWithSafeUrl[] = []; // Array of messages with safe URLs
  editingMessage: MessageReadDtoWithSafeUrl | null = null; // Currently editing message
  unreadMessagesSubscription: Subscription | undefined; // Subscription for unread messages
  showEmojiPicker = false; // Flag to show/hide emoji picker
  searchText: any; // Search text

  constructor(
    private profileService: ProfileService,
    private imageService: ImageService,
    private authService: AuthService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private searchService: SearchService,
    public themeService: ThemeService
  ) { }
  ngOnInit() { // Initialize component
    // Get authenticated user from token
    this.authenticatedUser = this.authService.getUserFromToken();
    // Fetch all profiles and subscribe to the result
    this.profileService.getAllProfiles().subscribe(profiles => {
      // Filter out authenticated user's profile
      this.profiles = profiles.filter(profile => profile.userId !== this.authenticatedUser?.userId);

      // Iterate through each profile
      this.profiles.forEach(profile => {
        // If profile has image, fetch image URL
        if (profile.hasImage) {
          this.getImageByUserId(profile.userId).subscribe(imageUrl => {
            profile.imageUrl = imageUrl; // Set profile image URL
          });
        }
        // Get unread message count for the profile
        this.chatService.getUnreadMessageCount(profile.userId, this.authenticatedUser?.userId ?? 0).subscribe(count => {
          profile.unreadMessageCount = count; // Set unread message count
          this.cdr.detectChanges(); // Detect changes
        });
      });
      // Select user from route parameters
      this.selectUserFromRouteParams();
    });

    // Subscribe to route parameter changes
    this.route.paramMap.subscribe(() => {
      this.selectUserFromRouteParams(); // Select user from route parameters
    });

    // Subscribe to current search text changes
    this.searchService.currentSearchText.subscribe(searchText => this.searchText = searchText);
  }

  selectUserFromRouteParams() { // Select user from route parameters
    // Get user ID from route parameters
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    // Find user profile
    const user = this.profiles.find(profile => profile.userId === userId);
    // If user found, select user
    if (user) {
      this.selectUser(user);
    }
  }

  selectUser(user: Profile) { // Select user
    // Set selected user
    this.selectedUser = user;
    // Clear messages
    this.messages = [];
    // Load messages for selected user
    this.loadMessages(user);
    // Focus on message input
    this.messageInput?.nativeElement.focus();
    // Mark messages as read
    this.chatService.markMessagesAsRead(user.userId, this.authenticatedUser?.userId ?? 0).subscribe(() => {
      user.unreadMessageCount = 0; // Reset unread message count
    });
  }

  // Fetch image by user ID
  getImageByUserId(userId: number): Observable<SafeUrl | undefined> {
    // Check if image is not deleted
    if (!this.isImageDeleted) {
      return this.imageService.getImageByUserId(userId).pipe(
        // Map response to SafeUrl
        map((response: ArrayBuffer) => {
          const blob = new Blob([response], { type: 'image/jpeg' });
          const blobUrl = URL.createObjectURL(blob);
          return this.sanitizer.bypassSecurityTrustUrl(blobUrl); // Bypass security and return URL
        })
      );
    }
    return of(undefined); // Return undefined if image is deleted
  }

  loadMessages(user: Profile) { // Load messages for user
    const senderId = this.authService.getUserId();
    if (senderId === null) {
      return; // If sender ID is null, return
    }

    // Fetch messages between sender and user
    this.chatService.getMessages(senderId, user.userId).subscribe((messages: MessageReadDto[]) => {
      const imageRequests: Observable<MessageReadDtoWithSafeUrl>[] = messages.map(message => {
        return this.loadMessageImage(message); // Load message image
      });

      forkJoin(imageRequests).subscribe((messagesWithImages: MessageReadDtoWithSafeUrl[]) => {
        // Set messages with images
        this.messages = messagesWithImages;
        this.scrollToBottom(); // Scroll to bottom
        this.cdr.detectChanges(); // Detect changes
        this.scrollToBottom(); // Scroll to bottom
      });
    });
  }

  loadMessageImage(message: MessageReadDto): Observable<MessageReadDtoWithSafeUrl> { // Load message image
    // If sender ID is null, return message without image URL
    if (!message.senderId) {
      return of({ ...message, senderImageSafeUrl: undefined });
    }

    return this.profileService.getProfileById(message.senderId).pipe(
      switchMap(profile => {
        // If profile has image, fetch image URL
        if (profile.hasImage) {
          return this.imageService.getImageByUserId(profile.userId).pipe(
            // Map image data to message with image URL
            map(imageData => ({
              ...message,
              senderImageSafeUrl: this.byteArrayToSafeUrl(imageData)
            }))
          );
        } else {
          return of({ ...message, senderImageSafeUrl: undefined }); // Return message without image URL
        }
      })
    );
  }

  sendMessage() { // Send message
    // If new message is empty, return
    if (!this.newMessage.trim()) {
      return;
    }
    // If editing message, update message, else send new message
    if (this.editingMessage) {
      this.updateMessage(this.editingMessage.messageId, this.newMessage);
    } else {
      this.sendNewMessage();
    }
  }

  sendNewMessage() { // Send new message
    // Create message DTO
    const messageDto: MessageDto = {
      senderId: this.authenticatedUser!.userId,
      receiverId: this.selectedUser!.userId,
      messageText: this.newMessage,
      imageId: 0
    };

    // Send message
    this.chatService.sendMessage(messageDto).subscribe(() => {
      this.newMessage = ''; // Clear new message
      this.loadMessages(this.selectedUser!); // Reload messages
    });
  }

  updateMessage(id: number, newMessageText: string) { // Update message
    // Create message DTO
    const messageDto: MessageDto = {
      senderId: this.authenticatedUser!.userId,
      receiverId: this.selectedUser!.userId,
      messageText: newMessageText,
      imageId: 0
    };

    // Update message
    this.chatService.updateMessage(id, messageDto).subscribe(() => {
      this.editingMessage = null; // Clear editing message
      this.newMessage = ''; // Clear new message
      this.loadMessages(this.selectedUser!); // Reload messages
    }, error => {
      console.error('Error updating message:', error); // Log error if update fails
    });
  }

  deleteMessage(id: number) { // Delete message
    // Delete message
    this.chatService.deleteMessage(id).subscribe(() => {
      // Filter out deleted message
      this.messages = this.messages.filter(message => message.messageId !== id);
    }, error => {
      console.error('Error deleting message:', error); // Log error if delete fails
    });
  }

  startEditingMessage(message: MessageReadDtoWithSafeUrl) { // Start editing message
    this.editingMessage = message; // Set editing message
    this.newMessage = message.messageText; // Set new message to message text
    this.messageInput?.nativeElement.focus(); // Focus on message input
  }

  scrollToBottom() { // Scroll to bottom of message container
    if (this.messageContainer) {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }
  }

  byteArrayToSafeUrl(byteArray: ArrayBuffer): SafeUrl { // Convert byte array to SafeUrl
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const blobUrl = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustUrl(blobUrl); // Bypass security and return URL
  }

  toggleEmojiPicker() { // Toggle emoji picker visibility
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: { emoji: { native: any; }; }) { // Add emoji to message
    const text = `${this.newMessage}${event.emoji.native}`; // Append emoji to message text
    this.newMessage = text; // Update new message
    this.showEmojiPicker = false; // Hide emoji picker
    setTimeout(() => this.messageInput?.nativeElement.focus(), 0); // Focus on message input
  }

  isEmoji(str: string) { // Check if string is emoji
    const regex = emojiRegex();
    return regex.test(str); // Test if string is emoji
  }

  sendEmoji() { // Send emoji as message
    // Create message DTO
    const messageDto: MessageDto = {
      senderId: this.authenticatedUser!.userId,
      receiverId: this.selectedUser!.userId,
      messageText: this.newMessage,
      imageId: 0
    };

    // Send emoji message
    this.chatService.sendMessage(messageDto).subscribe(() => {
      this.newMessage = ''; // Clear new message
      this.loadMessages(this.selectedUser!); // Reload messages
    });
  }

  onEnter(event: Event) { // Handle Enter key press
    event.preventDefault(); // Prevent default Enter behavior
    // If message contains emoji, send emoji, else send message
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
