import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { ImageService } from 'src/app/services/image.service';
import { map } from 'rxjs/operators';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgToastService } from 'ng-angular-popup';
import { Profile } from 'src/app/models/profile.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  public profileDetails: Profile = {
    userId: 0,
    username: '',
    email: '',
    password: '',
    fullName: '',
    bio: '',
    skillInterested: '',
    token: '',
    role: '',
    skills: [{
      skillId: 0,
      name: '',
      description: '',
      category: '',
      level: 0,
      prerequisity: '',
      userId: 0,
      user: '',
    }],
    unreadMessageCount: 0,
  }; userId: number | null = null;
  username: string = '';
  role: string | undefined;
  imageUrl: SafeUrl | undefined;
  file!: File;
  isImageChosen: boolean = false;
  isImageUploaded: boolean = false;
  isImageDeleted: boolean = false;

  @ViewChild('uploadImageRef', { static: false }) uploadImageRef!: ElementRef;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private userStore: UserStoreService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private toast: NgToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.userId = id ? +id : null;
      if (this.userId) {
        this.getProfileDetails();
      }
    });

    this.userStore.getUsernameFromStore().subscribe(val => {
      this.username = val || this.authService.getUsernameFromToken();
    });

    this.userStore.getRoleFromStore().subscribe(val => {
      this.role = val || this.authService.getRoleFromToken();
    });
  }

  getProfileDetails() {
    this.profileService.getProfileById(this.userId!).subscribe({
      next: response => {
        this.profileDetails = response;
        if (this.profileDetails.hasImage && !this.isImageDeleted) {
          this.getImageByUserId(this.profileDetails.userId);
        }
      },
      error: error => {
        console.error('Failed to get profile', error);
      }
    });
  }

  updateProfile() {
    this.profileService.updateProfile(this.profileDetails.userId, this.profileDetails).subscribe({
      next: () => {
        this.toast.success({ detail: 'SUCCESS', summary: 'Profile updated successfully', duration: 3000 });
      },
      error: error => {
        console.error('Failed to update profile', error);
      }
    });
  }

  uploadImage() {
    this.imageService.uploadImage(this.profileDetails.userId, this.file).pipe(
      map(event => {
        if (event.type === HttpEventType.Response) {
          this.toast.success({ detail: 'SUCCESS', summary: 'Image uploaded successfully', duration: 3000 });
          this.isImageDeleted = false;
          this.profileDetails.hasImage = true;
          this.isImageUploaded = true;
          this.isImageChosen = false;
        }
      })
    ).subscribe();
  }

  getImageByUserId(userId: number) {
    this.imageService.getImageByUserId(userId).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'image/jpeg' });
        const blobUrl = URL.createObjectURL(blob);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
        this.isImageUploaded = true;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status !== 404) {
          console.error('Failed to get image', error);
        }
      }
    });
  }

  onChange(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      this.isImageChosen = true;
    };
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const uploadImageInput = this.uploadImageRef.nativeElement;
      if (uploadImageInput) {
        uploadImageInput.value = '';
        this.cdr.detectChanges();
      }
    });
  }

  removeImage() {
    if (this.profileDetails.userId && confirm('Are you sure you want to remove the image?')) {
      this.imageService.removeImage(this.profileDetails.userId).subscribe({
        next: () => {
          this.toast.success({ detail: 'SUCCESS', summary: 'Image removed successfully', duration: 3000 });
          this.imageUrl = undefined;
          this.profileDetails.profileImage = undefined;
          this.isImageUploaded = false;
          this.isImageDeleted = true;
          this.isImageChosen = false;
          const uploadImageInput = this.uploadImageRef.nativeElement;
          if (uploadImageInput) {
            uploadImageInput.value = null;
          }
        },
        error: error => {
          console.error('Failed to remove image', error);
          this.toast.error({ detail: 'ERROR', summary: 'Failed to remove image', duration: 4000 });
        }
      });
    }
  }

  logout() {
    this.authService.signOut();
  }
}
