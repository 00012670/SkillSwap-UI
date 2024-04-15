import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageService } from 'src/app/services/image.service';
import { Profile } from 'src/app/models/profile.model';
import { AppService } from 'src/app/services/app.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  userId: number | null = null;
  role: string = '';
  userProfiles: Profile[] = [];
  imageUrl: SafeUrl | null = null;
  username: string = "";
  searchText: any;
  isImageDeleted: boolean = false;
  showSearch: boolean | undefined;

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private userStore: UserStoreService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    public  appService: AppService
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
          this.fetchUserProfile();
        }
      });
    });

    this.appService.currentShowSearch.subscribe(showSearch => this.showSearch = showSearch);
  }

  fetchUserProfile(): void {
    if (this.userId !== null) {
      this.getUserProfile(this.userId);
    }
  }

  getUserProfile(userId: number): void {
    this.profileService.getProfileById(userId).subscribe(
      (profile) => {
        if (profile.hasImage) {
          this.getImageByUserId(profile.userId);
        } else {
          this.imageUrl = null;
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  getImageByUserId(userId: number) {
    if (!this.isImageDeleted) {
      this.imageService.getImageByUserId(userId).subscribe(
        (response: ArrayBuffer) => {
          const blob = new Blob([response], { type: 'image/jpeg' });
          const blobUrl = URL.createObjectURL(blob);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
        },
        (error) => {
          console.error('Error fetching user image:', error);
        }
      );
    }
  }

  logout() {
    this.auth.signOut();
  }
}
