import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { ImageService } from 'src/app/services/image.service';
import { catchError, map, of } from 'rxjs';
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

export class ProfileComponent implements OnInit {
  userId: any;

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
  };

  public users: any = [];
  public username: string = "";
  public role!: string;
  public imageUrl: SafeUrl | undefined;
  errorMessage: string = '';
  profileList: any;
  imageList: any;
  profileImage: any;
  img: any;
  imgCode: string = '';
  EditProfileCode = '';
  Result: any;
  file!: File;
  progressvalue = 0;

  isImageChosen: boolean = false;
  isImageUploaded: boolean = false;

  @ViewChild('content') addview !: ElementRef;
  @ViewChild('fileupload') fileupload !: ElementRef;

  constructor(
    private profileService: ProfileService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private toast: NgToastService,
    private cdr: ChangeDetectorRef,

  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = Number(params.get('id'));

        if (id) {
          this.profileService.getProfileById(id)
            .subscribe({
              next: (response) => {
                this.profileDetails = response;
                this.getImageByUserId(this.profileDetails.userId);
              }
            })
        }
      }
    });

    this.userStore.getUsernameFromStore().subscribe(val => {
      const usernameFromToken = this.auth.getUsernameFromToken();
      this.username = val || usernameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe(val => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }

  uploadImage() {
    this.imageService.uploadImage(this.profileDetails.userId, this.file).pipe(
      map(events => {
        switch (events.type) {
          case HttpEventType.UploadProgress:
            this.progressvalue = Math.round(events.loaded / events.total! * 100);
            break;
          case HttpEventType.Response:
            this.toast.success({ detail: "SUCCESS", summary: "Image uploaded successfully", duration: 5000 });
            setTimeout(() => {
              this.progressvalue = 0;
            }, 2500);
            break;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Failed to upload');
        return of("failed");
      })
    ).subscribe(result => {
      this.isImageUploaded = true;
    });
  }

  updateProfile() {
    this.profileService.updateProfile(this.profileDetails.userId, this.profileDetails)
      .subscribe({
        next: (response) => {
          this.toast.success({ detail: "SUCCESS", summary: "Profile updated successfully", duration: 5000 });
        },
        error: (error) => {
          console.error('Failed to update profile', error);
        }
      });
  }

  getImageByUserId(userId: number) {
    this.imageService.getImageByUserId(userId).subscribe((response: ArrayBuffer) => {
      const blob = new Blob([response], { type: 'image/jpeg' });
      const blobUrl = URL.createObjectURL(blob);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
    });
  }


  base64ToBlob(base64: string, contentType: string) {
    const sliceSize = 1024;
    const byteCharacters = atob(base64);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  onchange(event: any) {
    let reader = new FileReader();
    this.file = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.profileImage = reader.result;
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      this.isImageChosen = true;
    };
  }

  removeImage() {
    if (this.profileDetails.userId) {
      this.imageService.removeImage(this.profileDetails.userId).subscribe({
        next: (response) => {
          this.toast.success({ detail: "SUCCESS", summary: "Image removed successfully", duration: 5000 });
          this.imageUrl = undefined;
          this.profileDetails.profileImage = undefined;
          this.isImageUploaded = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to remove image', error);
        }
      });
    }
  }





  // ProceedUpload(userId: number) {
  //   this.imageService.uploadImage(this.EditProfileCode, userId, this.file).pipe(
  //     map(events => {
  //       switch (events.type) {
  //         case HttpEventType.UploadProgress:
  //           this.progressvalue = Math.round(events.loaded / events.total! * 100);
  //           break;
  //         case HttpEventType.Response:
  //           this.imgCode = this.EditProfileCode;
  //           this.GetAllImages();
  //           console.log("Upload completed");
  //           setTimeout(() => {
  //             this.progressvalue = 0;
  //           }, 2500);
  //           break;
  //       }
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       console.log('Failed to upload');
  //       return of("failed");
  //     })
  //   ).subscribe(result => {});
  // }
}
