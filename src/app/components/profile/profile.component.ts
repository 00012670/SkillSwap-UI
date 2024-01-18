import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { ImageService } from 'src/app/services/image.service';
import { Pipe, PipeTransform } from '@angular/core';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})


export class ProfileComponent implements OnInit {
  id: any;

  profileDetails: Profile = {
    id: '',
    username: '',
    email: '',
    password: '',
    fullName: '',
    bio: '',
    skillInterested: '',
  };

  @Pipe({
    name: 'filterSkills'
  })


  public users: any = [];
  public username: string = "";
  public role!: string;

  profileList: any;
  imageList: any;
  profileImage: any;
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
    private router: Router,
    private imageService: ImageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (id) {
          this.profileService.getProfileById(id)
            .subscribe({
              next: (response) => {
                this.profileDetails = response;
                this.GetImagebyId(this.profileDetails.id);
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

    this.GetAllImages();
  }

  // ngOnInit() {
  //   this.route.paramMap.subscribe({
  //     next: (params) => {
  //       const id = params.get('id');

  //       if(id) {
  //         this.profileService.getProfileById(id)
  //         .subscribe({
  //           next: (response) => {
  //             this.profileDetails = response;
  //           }
  //         })
  //       }
  //     }
  //   });

  //   this.userStore.getUsernameFromStore().subscribe(val => {
  //     const usernameFromToken = this.auth.getUsernameFromToken();
  //     this.username = val || usernameFromToken;
  //   });

  //   this.userStore.getRoleFromStore().subscribe(val => {
  //     const roleFromToken = this.auth.getRoleFromToken();
  //     this.role = val || roleFromToken;
  //   });

  //   this.GetAllImages();
  // }

  UploadImage(code: any) {
    if (!this.imageList) {
      console.error('No image selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file);

    this.imageService.uploadImage(formData).subscribe({
      next: (response) => {
        console.log('Image uploaded successfully:', response);
        this.updateProfile();
      },
      error: (error) => {
        console.error('Error uploading image:', error);
      },
    });
  }

  updateProfile() {
    this.profileService.updateProfile(this.profileDetails.id, this.profileDetails)
    .subscribe({
      next: (response) => {
        this.router.navigate(['dashboard'])
      }
    })
  }

  // UploadImage(code: any, image: any) {
  //   if (!this.imageList) {
  //     console.error('No image selected.');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('filecollection', this.file);

  //   this.imageService.uploadImage(formData).subscribe({
  //     next: (response) => {
  //       console.log('Image uploaded successfully:', response);
  //     },
  //     error: (error) => {
  //       console.error('Error uploading image:', error);
  //     },
  //   });
  // }

  GetAllImages() {
    this.imageService.getAllImages().subscribe(result => {
      this.profileList = result;
    });
  }

  GetImagebyId(imgCode: any) {
    this.imageService.getImagebyId(imgCode).subscribe(result => {
      this.profileImage = result; // Assign the retrieved image to the profileImage property
    });
  }


  onchange(event: any) {
    let reader = new FileReader();
    this.file = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.imageList = reader.result;
    };
  }

  // RemoveImage(code: any, name: any) {
  //   if (confirm("Do you want remove the product : " + name + " ?")) {
  //     this.profileService.removeImage(code).subscribe(result => {
  //       alert("Upload completed"); // Use alertify instead of alertifyjs
  //       this.GetAllProfiles();
  //     });
  //   }
  // }

  // ProceedUpload() {
  //   let formdata = new FormData();
  //   formdata.append("file", this.file, this.EditProfileCode)
  //   this.profileService.uploadImage(formdata).pipe(

  //     map(events => {
  //       switch (events.type) {
  //         case HttpEventType.UploadProgress:
  //           this.progressvalue = Math.round(events.loaded / events.total! * 100);
  //           break;
  //         case HttpEventType.Response:
  //           this.GetAllProfiles();
  //           alert("Upload completed");
  //           setTimeout(() => {
  //             this.progressvalue = 0;
  //           }, 2500);
  //           break;

  //       }
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       alert('Failed to upload')
  //       return of("failed");
  //     })

  //   ).subscribe(() => {
  //     // this.Getallproducts();
  //     // alertifyjs.success("Upload completed");
  //   });
  // }

  // GetProfileInfo(code: any, prodimage: any, name: any) {
  //   this.profileImage = prodimage;
  //   this.EditProfileCode = code;
  //   this.open();
  // }
  // open() {
  //   this.modalService.open(this.addview, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //   }, (reason) => {
  //   });
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }
}


