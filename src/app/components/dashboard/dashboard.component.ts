import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';
import { ImageService } from 'src/app/services/image.service';
import { SkillsService } from 'src/app/services/skills.service';
import { SkillLevel, Skill } from 'src/app/models/skill.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  userId: number | null = null;
  imageUrl: SafeUrl | undefined;
  hasImage: boolean = false;
  skills: any[] = [];
  skillList: any[] = [];
  userProfiles: any = [];
  username: string = "";
  role!: string;

  searchText: any;
  isImageDeleted: boolean = false;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private skillsService: SkillsService,
    private userStore: UserStoreService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.userId = userId;
      this.fetchUserProfile(userId);
    }

    this.profileService.userProfile$.subscribe(profile => {
      if (profile) {
        this.userProfiles = [profile];
        if (profile.hasImage) {
          this.getImageByUserId(profile.userId);
        } else {
          this.hasImage = false;
        }
      }
    });


    this.userStore.getUsernameFromStore().pipe(
      switchMap(val => {
        const usernameFromToken = this.authService.getUsernameFromToken();
        this.username = val || usernameFromToken;
        return this.profileService.getAllProfiles();
      })
    ).subscribe(profiles => {
      this.userProfiles = profiles.filter((profile: Profile) => profile.username === this.username);
      if (this.userProfiles.length > 0) {
        this.skills = this.userProfiles[0].skills;
      }
    });

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
    });
  }


  fetchUserProfile(userId: number): void {
    this.profileService.getProfileById(userId).subscribe(profile => {
      this.userProfiles = [profile];
      if (profile.hasImage) {
        this.getImageByUserId(profile.userId);
      } else {
        this.hasImage = false;
      }
    });
  }

  getImageByUserId(userId: number) {
    if (!this.isImageDeleted) {
      this.imageService.getImageByUserId(userId).subscribe(
        (response: ArrayBuffer) => {
          const blob = new Blob([response], { type: 'image/jpeg' });
          const blobUrl = URL.createObjectURL(blob);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
        },
      );
    }
  }

  deleteProfile(userId: number) {
    this.profileService.deleteProfile(userId).subscribe(() => {
      this.userProfiles = this.userProfiles.filter((userProfile: Profile) => userProfile.userId !== userId);
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


  logout() {
    this.authService.signOut();
  }
}
