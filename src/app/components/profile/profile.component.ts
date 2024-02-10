import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { ImageService } from 'src/app/services/image.service';
import { catchError, map, of } from 'rxjs';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


interface ImageResponse {
  $id: string;
  $values: Array<{
    $id: string;
    imageUrl: string;
  }>;
}

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

  profileList: any;
  imageList: any;
  profileImage: any;
  img: any;
  imgCode: string = '';

  EditProfileCode = '';
  Result: any;
  file!: File;
  progressvalue = 0;

  @ViewChild('content') addview !: ElementRef;
  @ViewChild('fileupload') fileupload !: ElementRef;


  constructor(
    private profileService: ProfileService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
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
                return this.GetImagebyId(this.profileDetails.userId);
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

  UploadImage(userId: number, imgCode: any, img: any) {
    this.profileImage = img;
    this.EditProfileCode = imgCode;
    this.ProceedUpload(userId);
  }


  ProceedUpload(userId: number) {
    this.imageService.uploadImage(this.EditProfileCode, userId, this.file).pipe(
      map(events => {
        switch (events.type) {
          case HttpEventType.UploadProgress:
            this.progressvalue = Math.round(events.loaded / events.total! * 100);
            break;
          case HttpEventType.Response:
            this.imgCode = this.EditProfileCode;
            this.GetAllImages();
            console.log("Upload completed");
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
    ).subscribe(result => {});
  }


  updateProfile() {
    this.profileService.updateProfile(this.profileDetails.userId, this.profileDetails)
      .subscribe({
        next: (response) => {
          this.ProceedUpload(this.profileDetails.userId);
        },
        error: (error) => {
          console.error('Failed to update profile', error);
        }
      });
  }


  GetAllImages() {
    this.imageService.getAllImages().subscribe(result => {
      this.profileList = result;
    });
  }

  GetImagebyId(imgCode: any) {
    this.imageService.getImagebyId(imgCode).subscribe((response: ImageResponse) => {
      const imageBlob = this.base64ToBlob(response.$values[0].imageUrl, 'image/png');
      const blobUrl = URL.createObjectURL(imageBlob);
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
    };
  }
}
