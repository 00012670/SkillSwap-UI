import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageService } from 'src/app/services/image.service';
import { Profile } from 'src/app/models/profile.model';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userId: number | null = null;
  role: string = '';
  username: string = '';
  userProfiles: Profile[] = [];
  imageUrl: SafeUrl | null = null;
  showSearch: boolean | undefined;
  searchText: any;

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private userStore: UserStoreService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    public searchService: SearchService,
  ) {}

  ngOnInit(): void {
    this.userStore.getUsernameFromStore().subscribe(username => {
      this.username = username || this.auth.getUsernameFromToken();
      this.fetchUserProfile();
    });

    this.searchService.currentShowSearch.subscribe(showSearch => this.showSearch = showSearch);
  }

  fetchUserProfile(): void {
    this.profileService.getAllProfiles().subscribe(profiles => {
      this.userProfiles = profiles.filter(profile => profile.username === this.username);
      if (this.userProfiles.length > 0) {
        this.userId = this.userProfiles[0].userId;
        this.role = this.auth.getRoleFromToken();
        this.getUserProfile();
      }
    });
  }

  getUserProfile(): void {
    if (this.userId !== null) {
      this.profileService.getProfileById(this.userId).subscribe(
        profile => {
          if (profile.hasImage) {
            this.getImageByUserId(profile.userId);
          } else {
            this.imageUrl = null;
          }
        },
        error => {
          console.error('Error fetching user profile:', error);
        }
      );
    }
  }

  getImageByUserId(userId: number): void {
    this.imageService.getImageByUserId(userId).subscribe(
      (response: ArrayBuffer) => {
        const blob = new Blob([response], { type: 'image/jpeg' });
        const blobUrl = URL.createObjectURL(blob);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
      },
      error => {
        console.error('Error fetching user image:', error);
      }
    );
  }

  logout(): void {
    this.auth.signOut();
  }
}
