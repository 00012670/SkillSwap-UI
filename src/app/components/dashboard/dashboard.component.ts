import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { SkillsService } from 'src/app/services/skill.service';
import { SkillLevel } from 'src/app/models/skill.model';
import { SearchService } from 'src/app/services/search.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationModalComponent } from '../notification/notification.component';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/notification.model';
import { CalendarComponent } from '../calendar/calendar.component';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  userProfile: Profile = { userId: 0, username: '', email: '', password: '', fullName: '', bio: '', skillInterested: '', token: '', role: '', skills: [], unreadMessageCount: 0};
  userId: number | null = null;
  skills: any[] = [];
  skillList: any[] = [];
  userProfiles: any = [];
  role!: string;
  notificationList: Notification[] = [];
  notifications: any


  searchText: any;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private skillsService: SkillsService,
    private userStore: UserStoreService,
    private searchService: SearchService,
    private modalService: NgbModal,
    private notificationService: NotificationService,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.userStore.getRoleFromStore().subscribe(val => {
      this.role = val || this.authService.getRoleFromToken();
      this.loadDataBasedOnRole();
      this.searchService.currentSearchText.subscribe(searchText => this.searchText = searchText);
      this.userId = this.authService.getUserId();
      if (this.userId !== null) {
        this.getNotifications();
      }
    });
  }

  loadDataBasedOnRole(): void {
    if (this.role === 'Admin') {
      this.loadAllProfiles();
    } else if (this.role === 'User') {
      this.loadAllSkills();
    }
  }

  loadAllProfiles(): void {
    this.profileService.getAllProfiles().subscribe(profiles => {
      this.userProfiles = profiles;
    });
  }

  loadAllSkills(): void {
    this.skillsService.getAllSkills().subscribe(skills => {
      this.skillList = skills;
    });
  }

  getSkills(): void {
    if (this.userId !== null) {
      this.skillsService.getSkillsByUserId(this.userId).subscribe(skills => {
        this.skillList = skills;
      });
    }
  }

  getLevel(level: SkillLevel): string {
    const levels = {
      [SkillLevel.Foundational]: 'Foundational',
      [SkillLevel.Competent]: 'Competent',
      [SkillLevel.Expert]: 'Expert',
      [SkillLevel.Master]: 'Master'
    };
    return levels[level] || '';
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

  openNotification(notifaction: Notification) {
    const modalRef = this.modalService.open(NotificationModalComponent);
    modalRef.componentInstance.notification = notifaction;
    modalRef.componentInstance.receiverId = this.userProfile.userId;
  }

  openCalendar() {
    const modalRef = this.modalService.open(CalendarComponent);
  }
}
