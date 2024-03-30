import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { SkillLevel } from 'src/app/models/skill.model';
import { AuthService } from 'src/app/services/auth.service';
import { SkillsService } from 'src/app/services/skills.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-skills-list',
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss'],
})
export class SkillsListComponent implements OnInit {

  imageUrl: SafeUrl | undefined;
  searchText: any;
  userProfiles: any = [];
  username: string = "";
  role!: string;
  skillList: any[] = [];
  userId: number | null = null;


  isImageChosen: boolean = false;
  isImageUploaded: boolean = false;
  isImageDeleted: boolean = false;

  constructor(
    private auth: AuthService,
    private userStore: UserStoreService,
    private profileService: ProfileService,
    private skillsService: SkillsService,
    private sanitizer: DomSanitizer,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.userStore.getUsernameFromStore().subscribe(val => {
      const usernameFromToken = this.auth.getUsernameFromToken();
      this.username = val || usernameFromToken;
      this.profileService.getAllProfiles().subscribe(profiles => {
        this.userProfiles = profiles.filter((profile: Profile) => profile.username === this.username);
        if (this.userProfiles.length > 0) {
          this.userId = this.userProfiles[0].userId;
          this.role = this.auth.getRoleFromToken();
          this.getSkills();
          this.fetchUserProfile();
        }
      });
    });
  }

  getSkills(): void {
    if (this.role === 'Admin') {
      this.skillsService.getAllSkills().subscribe(skills => {
        this.skillList = skills;
      });
    } else if (this.role === 'User' && this.userId !== null) {
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

  // Fetch user profile to display image
  fetchUserProfile(): void {
    if (this.userId !== null) {
      this.profileService.getProfileById(this.userId).subscribe(profile => {
        if (profile.hasImage) {
          this.getImageByUserId(profile.userId);
        } else {
          this.imageUrl = undefined; // Reset imageUrl if profile does not have an image
        }
      });
    }
  }


  // Fetch user image
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


  logout() {
    this.auth.signOut();
  }
}

