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
import { SkillImageService } from 'src/app/services/skill-image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  // Initialize userProfile object with default values
  userProfile: Profile = { userId: 0, username: '', email: '', password: '', fullName: '', bio: '', skillInterested: '', token: '', role: '', skills: [], unreadMessageCount: 0 };
  userId: number | null = null;
  skills: any[] = [];
  skillList: any[] = [];
  userProfiles: any = [];
  role!: string;
  notificationList: Notification[] = [];
  notifications: any

  isImageChosen: boolean = false;
  isImageUploaded: boolean = false;
  isImageDeleted: boolean = false;
  imageSkillUrl: SafeUrl | undefined;

  searchText: any;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private skillsService: SkillsService,
    private userStore: UserStoreService,
    private searchService: SearchService,
    private modalService: NgbModal,
    private notificationService: NotificationService,
    public themeService: ThemeService,
    private skillImageService: SkillImageService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.userStore.getRoleFromStore().subscribe(val => {
      this.role = val || this.authService.getRoleFromToken(); // Set role to value from store or from token
      this.loadDataBasedOnRole();
      this.searchService.currentSearchText.subscribe(searchText => this.searchText = searchText); // Subscribe to currentSearchText and set searchText
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

  loadAllProfiles(): void { // Define loadAllProfiles method
    this.profileService.getAllProfiles().subscribe(profiles => { // Subscribe to getAllProfiles method of profileService
      this.userProfiles = profiles; // Set userProfiles to profiles
    });
  }

  loadAllSkills(): void {
    this.skillsService.getAllSkills().subscribe(skills => { // Subscribe to getAllSkills method of skillsService
      this.skillList = skills; // Set skillList to skills
      skills.forEach(skill => { // Iterate through skills
        // Get image URL for each skill
        this.skillImageService.getImageBySkillIdAsSafeUrl(skill.skillId, this.skillImageService, this.sanitizer).then((imageSkillUrl: SafeUrl | undefined) => {
          skill.imageSkillUrl = imageSkillUrl; // Set imageSkillUrl for skill
        });
      });
    });
  }

  getSkills(): void { // Define getSkills method
    if (this.userId !== null) {
      this.skillsService.getSkillsByUserId(this.userId).subscribe(skills => {
        this.skillList = skills; // Set skillList to skills
      });
    }
  }

  getLevel(level: SkillLevel): string { // Define getLevel method
    const levels = { // Define levels object mapping SkillLevel to string
      [SkillLevel.Foundational]: 'Foundational',
      [SkillLevel.Competent]: 'Competent',
      [SkillLevel.Expert]: 'Expert',
      [SkillLevel.Master]: 'Master'
    };
    return levels[level] || ''; // Return level string or empty string if not found
  }

  deleteProfile(userId: number) {
    this.profileService.deleteProfile(userId).subscribe(() => { //deleteProfile method of profileService
      this.userProfiles = this.userProfiles.filter((userProfile: Profile) => userProfile.userId !== userId); // Filter out deleted profile
    });
  }


  toggleBan(userProfile: Profile) {
    if (userProfile.isSuspended) { // If user is suspended
      this.profileService.unsuspendUser(userProfile.userId).subscribe(() => { // Unsuspend user
        userProfile.isSuspended = false; // Update user's suspension status
      });
    } else { // If user is not suspended
      this.profileService.suspendUser(userProfile.userId).subscribe(() => { // Suspend user
        userProfile.isSuspended = true; // Update user's suspension status
      });
    }
  }

  getNotifications(): void {
    if (this.userId !== null) {
      this.notificationService.getNotifications(this.userId).subscribe(notifications => {
        this.notificationList = notifications; // Set notificationList to notifications
      });
    }
  }

  openNotification(notifaction: Notification) {
    const modalRef = this.modalService.open(NotificationModalComponent); // Open notification modal
    modalRef.componentInstance.notification = notifaction; // Pass notification to modal component
    modalRef.componentInstance.receiverId = this.userProfile.userId; // Pass receiver ID to modal component
  }

  openCalendar() {
    const modalRef = this.modalService.open(CalendarComponent); // Open calendar modal
  }
}
