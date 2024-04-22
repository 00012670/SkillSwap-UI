import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { SkillsService } from 'src/app/services/skill.service';
import { SkillLevel } from 'src/app/models/skill.model';
import { AppService } from 'src/app/services/app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationModalComponent } from '../notification/notification.component';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/notification.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  userProfile: Profile = { userId: 0, username: '', email: '', password: '', fullName: '', bio: '', skillInterested: '', token: '', role: '', skills: [] };
  userId: number | null = null;
  skills: any[] = [];
  skillList: any[] = [];
  userProfiles: any = [];
  role!: string;
  notificationList: Notification[] = [];


  searchText: any;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private skillsService: SkillsService,
    private userStore: UserStoreService,
    private appService: AppService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {

    this.userStore.getRoleFromStore().subscribe(val => {
      const roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken;

      if (this.role === 'Admin') {
        this.profileService.getAllProfiles().subscribe(profiles => {
          this.userProfiles = profiles;
        });
      }

      if (this.role === 'User') {
        this.skillsService.getAllSkills().subscribe(skills => {
          this.skillList = skills;
        });
      }

      this.appService.currentSearchText.subscribe(searchText => this.searchText = searchText);
      const userId = this.authService.getUserId();
      if (userId !== null) {
        this.userId = userId;
        this.getNotifications();
      }

    });

    //this.appService.changeShowSearch(true);

  }

  getSkills(): void {
    if (this.userId !== null) {
      this.skillsService.getSkillsByUserId(this.userId).subscribe(skills => {
        this.skillList = skills;
      });
    }
  }

  getLevel(level: SkillLevel): string {
    switch (level) {
      case SkillLevel.Foundational:
        return 'Foundational';
      case SkillLevel.Competent:
        return 'Competent';
      case SkillLevel.Expert:
        return 'Expert';
      case SkillLevel.Master:
        return 'Master';
      default:
        return '';
    }
  }

  deleteProfile(userId: number) {
    this.profileService.deleteProfile(userId).subscribe(() => {
      this.userProfiles = this.userProfiles.filter((userProfile: Profile) => userProfile.userId !== userId);
    });
  }

  toggleBan(userProfile: Profile) {
    if (userProfile.isSuspended) {
      this.profileService.unsuspendUser(userProfile.userId).subscribe(() => {
        userProfile.isSuspended = false;
      });
    } else {
      this.profileService.suspendUser(userProfile.userId).subscribe(() => {
        userProfile.isSuspended = true;
      });
    }
  }

  getNotifications(): void {
    if (this.userId !== null) {
      this.notificationService.getNotifications(this.userId).subscribe(notifications => {
        this.notificationList = notifications;
      });
    }
  }



  open(notifaction: Notification) {
    const modalRef = this.modalService.open(NotificationModalComponent);
    modalRef.componentInstance.notification = notifaction;
    modalRef.componentInstance.receiverId = this.userProfile.userId;
  }
}
