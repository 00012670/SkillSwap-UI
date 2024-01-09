import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { ParamMap } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileDetails: Profile = {
    id: '',
    username: '',
    fullname: '',
    bio: '',
    skillsInterested: '',
    picture: ''
  }

  public users: any = [];
  public username: string = "";
  public role!: string;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private router: Router

  ) { }

//   ngOnInit() {
//     this.route.paramMap.subscribe({
//         next: (params: ParamMap) => {
//             const id = params.get('id');

//             if (id) {
//                 this.profileService.getProfile(id)
//                     .subscribe({
//                         next: (response) => {
//                             this.profileDetails = response;
//                         }
//                     });
//             }
//         }
//     });
// }

ngOnInit() {
  this.api.getUsers()
    .subscribe(res => {
      this.users = res;
    });

  this.userStore.getUsernameFromStore()
    .subscribe(val => {
      const UsernameFromToken = this.auth.getUsernameFromToken();
      this.username = val || UsernameFromToken
    });
  this.userStore.getRoleFromStore()
    .subscribe(val => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    })
}

  updateProfile() {
    this.profileService.updateProfile(this.profileDetails.id, this.
      profileDetails)
      .subscribe({
        next: (response) => {
          this.router.navigate(['skills'])
        }
      })
  }
}

