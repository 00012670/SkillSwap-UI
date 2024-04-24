import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification, NotificationType } from 'src/app/models/notification.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationModalComponent {

  userId: number | null = null;
  notificationList: Notification[] = [];
  notificationType: NotificationType[] = [NotificationType.Message, NotificationType.SwapRequest]

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.userId = userId;
      this.getNotifications();
    }
  }

  getNotifications(): void {
    if (this.userId !== null) {
      this.notificationService.getNotifications(this.userId).subscribe(notifications => {
        this.notificationList = notifications;
      },
      error => {
        console.log('Error fetching notification:', error);

      }
    );
    }
  }

  deleteAllNotifications() {
    if (this.userId !== null) {
      this.notificationService.deleteAllNotifications(this.userId)
        .subscribe(() => {
         this.notificationList = [];
         this.changeDetector.detectChanges();
        }, error => {
          console.error('Failed to mark all notifications as read:', error);
        });
    }
  }

  formatDateInTimeZone(date: Date): string {
    const utcDate = new Date(date);
    const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000);
    return localDate.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  viewNotification(notification: Notification) {
    this.closeModal();
    if (notification.type === NotificationType.Message) {
      this.router.navigate(['/chat', notification.senderId]);
    } else if (notification.type === NotificationType.SwapRequest) {
      this.router.navigate(['/manage-requests', this.userId]);
    }
  }


  closeModal() {
    this.activeModal.close('Close click');
  }
}





